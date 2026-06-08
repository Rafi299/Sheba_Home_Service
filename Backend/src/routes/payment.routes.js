const express = require("express");
const SSLCommerzPayment = require("sslcommerz-lts");
const Booking = require("../models/booking.model");
const ServiceCategory = require("../models/service.model");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

const STORE_ID = process.env.SSLCOMMERZ_STORE_ID;
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD;
const IS_LIVE = process.env.SSLCOMMERZ_IS_LIVE === "true";

// ─── INITIATE PAYMENT ─────────────────────────────────────────────────────────
router.post("/initiate", protect, async (req, res) => {
  try {
    const {
      serviceCategory,
      serviceOptionId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      bookingDate,
      bookingTime,
      quantity,
      note,
      paymentMethod,
    } = req.body;

    if (
      !serviceCategory ||
      !serviceOptionId ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !customerAddress ||
      !bookingDate ||
      !bookingTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Required booking fields are missing",
      });
    }

    if (!["online"].includes(paymentMethod)) {
  return res.status(400).json({
    success: false,
    message: "Invalid payment method for SSLCommerz",
  });
}

    const category = await ServiceCategory.findById(serviceCategory);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Service category not found",
      });
    }

    if (!category.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "This service category is currently unavailable",
      });
    }

    const selectedService = category.services.id(serviceOptionId);

    if (!selectedService) {
      return res.status(404).json({
        success: false,
        message: "Selected service option not found",
      });
    }

    const MAX_BOOKING_QUANTITY = 10;
    const bookingQuantity = Number(quantity) || 1;

    if (bookingQuantity < 1 || bookingQuantity > MAX_BOOKING_QUANTITY) {
      return res.status(400).json({
        success: false,
        message: `Quantity must be between 1 and ${MAX_BOOKING_QUANTITY}`,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedBookingDate = new Date(bookingDate);
    selectedBookingDate.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(selectedBookingDate.getTime()) ||
      selectedBookingDate < today
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or past booking date",
      });
    }

    const totalAmount = selectedService.price * bookingQuantity;

    const booking = await Booking.create({
      user: req.user._id,
      serviceCategory: category._id,
      serviceOptionId: selectedService._id,
      serviceCategoryTitle: category.title,
      serviceTitle: selectedService.title,
      servicePrice: selectedService.price,
      quantity: bookingQuantity,
      totalAmount,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      bookingDate,
      bookingTime,
      note,
      paymentMethod,
      paymentStatus: "pending",
      status: "pending",
    });

    const transactionId = `TXN-${booking._id}-${Date.now()}`;

    booking.transactionId = transactionId;
    await booking.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const serverUrl = process.env.SERVER_URL || "http://localhost:5000";

    const sslData = {
      total_amount: totalAmount,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${serverUrl}/api/payment/success/${booking._id}`,
      fail_url: `${serverUrl}/api/payment/fail/${booking._id}`,
      cancel_url: `${serverUrl}/api/payment/cancel/${booking._id}`,
      ipn_url: `${serverUrl}/api/payment/ipn`,
      shipping_method: "NO",
      product_name: selectedService.title,
      product_category: category.title,
      product_profile: "service",
      cus_name: customerName,
      cus_email: customerEmail,
      cus_add1: customerAddress,
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: customerPhone,
    };

    console.log("paymentMethod =", paymentMethod);
console.log("STORE_ID =", STORE_ID);
console.log("IS_LIVE =", IS_LIVE);

const sslcommerz = new SSLCommerzPayment(
  STORE_ID,
  STORE_PASSWORD,
  IS_LIVE
);

const apiResponse = await sslcommerz.init(sslData);

    if (!apiResponse?.GatewayPageURL) {
      booking.paymentStatus = "failed";
      await booking.save();

      return res.status(500).json({
        success: false,
        message: "Failed to initiate SSLCommerz payment. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      gatewayUrl: apiResponse.GatewayPageURL,
      bookingId: booking._id,
    });
  } catch (error) {
  console.error("PAYMENT ERROR:", error);

  return res.status(500).json({
    success: false,
    message: "Payment initiation failed",
    error: error.message,
  });
}
});

// ─── PAYMENT SUCCESS CALLBACK (called by SSLCommerz) ─────────────────────────
router.post("/success/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { tran_id, val_id, status, risk_level, risk_title } = req.body;

    if (status !== "VALID" && status !== "VALIDATED") {
      return res.redirect(
        `${process.env.CLIENT_URL}/payment-failed?bookingId=${bookingId}&reason=invalid_status`
      );
    }

    const sslcommerz = new SSLCommerzPayment(STORE_ID, STORE_PASSWORD, IS_LIVE);
    const validationResponse = await sslcommerz.validate({ val_id });

    if (
      validationResponse?.status !== "VALID" &&
      validationResponse?.status !== "VALIDATED"
    ) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: "failed",
      });

      return res.redirect(
        `${process.env.CLIENT_URL}/payment-failed?bookingId=${bookingId}&reason=validation_failed`
      );
    }

    // Capture risk variables directly out of gateway validation feedback payload
    const isRisky = 
      risk_level === "1" || 
      validationResponse?.risk_level === "1" ||
      (risk_title && risk_title !== "Safe");

    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: "paid",
      transactionId: tran_id,
    });

    const redirectUrl = `${process.env.CLIENT_URL}/payment-success?bookingId=${bookingId}${isRisky ? "&risk=true" : ""}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    return res.redirect(
      `${process.env.CLIENT_URL}/payment-failed?bookingId=${req.params.bookingId}&reason=server_error`
    );
  }
});

// ─── PAYMENT FAIL CALLBACK ────────────────────────────────────────────────────
router.post("/fail/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: "failed",
    });

    return res.redirect(
      `${process.env.CLIENT_URL}/payment-failed?bookingId=${bookingId}&reason=payment_failed`
    );
  } catch (error) {
    return res.redirect(
      `${process.env.CLIENT_URL}/payment-failed?bookingId=${req.params.bookingId}&reason=server_error`
    );
  }
});

// ─── PAYMENT CANCEL CALLBACK ──────────────────────────────────────────────────
router.post("/cancel/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: "failed",
      status: "cancelled",
      cancelledBy: "user",
      cancellationReason: "Payment cancelled by user",
    });

    return res.redirect(
      `${process.env.CLIENT_URL}/payment-failed?bookingId=${bookingId}&reason=cancelled`
    );
  } catch (error) {
    return res.redirect(
      `${process.env.CLIENT_URL}/payment-failed?bookingId=${req.params.bookingId}&reason=server_error`
    );
  }
});

// ─── IPN (Instant Payment Notification) ──────────────────────────────────────
router.post("/ipn", async (req, res) => {
  try {
    const { tran_id, status, val_id } = req.body;

    if (status === "VALID" || status === "VALIDATED") {
      const sslcommerz = new SSLCommerzPayment(
        STORE_ID,
        STORE_PASSWORD,
        IS_LIVE
      );
      const validationResponse = await sslcommerz.validate({ val_id });

      if (
        validationResponse?.status === "VALID" ||
        validationResponse?.status === "VALIDATED"
      ) {
        await Booking.findOneAndUpdate(
          { transactionId: tran_id },
          { paymentStatus: "paid" }
        );
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
});

module.exports = router;