const express = require("express");
const PDFDocument = require("pdfkit");
const Booking = require("../models/booking.model");
const ServiceCategory = require("../models/service.model");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

const router = express.Router();

// User: create booking
router.post("/", protect, async (req, res) => {
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
      transactionId,
      paymentPhone,
      paymentScreenshot,
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

    if (Number.isNaN(selectedBookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date",
      });
    }

    if (selectedBookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past",
      });
    }

    const totalAmount = selectedService.price * bookingQuantity;

    let finalPaymentStatus = "unpaid";

    if (paymentMethod === "bkash" || paymentMethod === "nagad") {
      finalPaymentStatus = "pending";
    }

    if (paymentMethod === "cash" || !paymentMethod) {
      finalPaymentStatus = "unpaid";
    }

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
      paymentMethod: paymentMethod || "cash",
      paymentStatus: finalPaymentStatus,
      transactionId,
      paymentPhone,
      paymentScreenshot,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
});

// User: get own booking history
router.get("/my-bookings", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get your bookings",
      error: error.message,
    });
  }
});

// Admin: get all bookings
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    const bookings = await Booking.find(filter)
      .populate("user", "name email phone")
      .populate("serviceCategory", "title slug image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get bookings",
      error: error.message,
    });
  }
});

// Admin: get booking stats
router.get("/admin/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
    });

    const processingBookings = await Booking.countDocuments({
      status: "processing",
    });

    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });

    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled",
    });

    const paidBookings = await Booking.countDocuments({
      paymentStatus: "paid",
    });

    const pendingPayments = await Booking.countDocuments({
      paymentStatus: "pending",
    });

    const unpaidBookings = await Booking.countDocuments({
      paymentStatus: "unpaid",
    });

    const revenueResult = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        processingBookings,
        completedBookings,
        cancelledBookings,
        paidBookings,
        pendingPayments,
        unpaidBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get booking stats",
      error: error.message,
    });
  }
});

// Admin: download booking/sales report PDF
router.get("/admin/reports/bookings", protect, adminOnly, async (req, res) => {
  try {
    const { status, paymentStatus, fromDate, toDate } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (fromDate || toDate) {
      filter.createdAt = {};

      if (fromDate) {
        const startDate = new Date(fromDate);
        startDate.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = startDate;
      }

      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }

    const bookings = await Booking.find(filter)
      .populate("user", "name email phone")
      .populate("serviceCategory", "title slug")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;

    const paidBookings = bookings.filter(
      (booking) => booking.paymentStatus === "paid"
    ).length;

    const pendingPayments = bookings.filter(
      (booking) => booking.paymentStatus === "pending"
    ).length;

    const unpaidBookings = bookings.filter(
      (booking) => booking.paymentStatus === "unpaid"
    ).length;

    const completedBookings = bookings.filter(
      (booking) => booking.status === "completed"
    ).length;

    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "cancelled"
    ).length;

    const totalRevenue = bookings
      .filter(
        (booking) =>
          booking.paymentStatus === "paid" && booking.status !== "cancelled"
      )
      .reduce((total, booking) => total + booking.totalAmount, 0);

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=booking-sales-report-${Date.now()}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(22).text("Home Service Management System", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(16).text("Admin Booking & Sales Report", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(10).text(`Report Date: ${new Date().toLocaleString()}`);
    doc.text(`Status Filter: ${status || "All"}`);
    doc.text(`Payment Filter: ${paymentStatus || "All"}`);
    doc.text(`From Date: ${fromDate || "All"}`);
    doc.text(`To Date: ${toDate || "All"}`);

    doc.moveDown();

    doc.fontSize(14).text("Summary");
    doc.fontSize(10).text(`Total Bookings: ${totalBookings}`);
    doc.text(`Completed Bookings: ${completedBookings}`);
    doc.text(`Cancelled Bookings: ${cancelledBookings}`);
    doc.text(`Paid Bookings: ${paidBookings}`);
    doc.text(`Pending Payments: ${pendingPayments}`);
    doc.text(`Unpaid Bookings: ${unpaidBookings}`);
    doc.text(`Total Revenue: ${totalRevenue} BDT`);

    doc.moveDown();

    doc.fontSize(14).text("Booking Details");

    if (bookings.length === 0) {
      doc.moveDown();
      doc.fontSize(10).text("No bookings found for this report.");
    }

    bookings.forEach((booking, index) => {
      doc.moveDown();

      doc.fontSize(11).text(`${index + 1}. ${booking.serviceTitle}`, {
        underline: true,
      });

      doc.fontSize(9);
      doc.text(`Booking ID: ${booking._id}`);
      doc.text(`Customer: ${booking.customerName}`);
      doc.text(`Email: ${booking.customerEmail}`);
      doc.text(`Phone: ${booking.customerPhone}`);
      doc.text(`Address: ${booking.customerAddress}`);
      doc.text(`Category: ${booking.serviceCategoryTitle}`);
      doc.text(`Booking Date: ${booking.bookingDate}`);
      doc.text(`Booking Time: ${booking.bookingTime}`);
      doc.text(`Quantity: ${booking.quantity}`);
      doc.text(`Total Amount: ${booking.totalAmount} BDT`);
      doc.text(`Booking Status: ${booking.status}`);
      doc.text(`Payment Method: ${booking.paymentMethod}`);
      doc.text(`Payment Status: ${booking.paymentStatus}`);
      doc.text(`Transaction ID: ${booking.transactionId || "N/A"}`);
      doc.text(`Payment Phone: ${booking.paymentPhone || "N/A"}`);
      doc.text(`Created At: ${new Date(booking.createdAt).toLocaleString()}`);

      if (booking.adminNote) {
        doc.text(`Admin Note: ${booking.adminNote}`);
      }

      if (booking.cancellationReason) {
        doc.text(`Cancellation Reason: ${booking.cancellationReason}`);
      }

      doc.moveDown(0.5);
      doc.text("---------------------------------------------");
    });

    doc.moveDown(2);

    doc.fontSize(10).text("Generated by Admin Panel", {
      align: "center",
    });

    doc.end();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate booking report",
      error: error.message,
    });
  }
});

// User/Admin: download booking invoice PDF
router.get("/:id/invoice", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("serviceCategory", "title slug image bannerImage");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=booking-invoice-${booking._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(22).text("Home Service Management System", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(16).text("Booking Invoice", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(10).text(`Invoice Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Booking ID: ${booking._id}`);
    doc.text(`Booking Created: ${new Date(booking.createdAt).toLocaleString()}`);

    doc.moveDown();

    doc.fontSize(14).text("Customer Information");
    doc.fontSize(10).text(`Name: ${booking.customerName}`);
    doc.text(`Email: ${booking.customerEmail}`);
    doc.text(`Phone: ${booking.customerPhone}`);
    doc.text(`Address: ${booking.customerAddress}`);

    doc.moveDown();

    doc.fontSize(14).text("Service Information");
    doc.fontSize(10).text(`Category: ${booking.serviceCategoryTitle}`);
    doc.text(`Service: ${booking.serviceTitle}`);
    doc.text(`Booking Date: ${booking.bookingDate}`);
    doc.text(`Booking Time: ${booking.bookingTime}`);
    doc.text(`Status: ${booking.status}`);

    doc.moveDown();

    doc.fontSize(14).text("Payment Information");
    doc.fontSize(10).text(`Payment Method: ${booking.paymentMethod}`);
    doc.text(`Payment Status: ${booking.paymentStatus}`);
    doc.text(`Transaction ID: ${booking.transactionId || "N/A"}`);
    doc.text(`Payment Phone: ${booking.paymentPhone || "N/A"}`);

    doc.moveDown();

    doc.fontSize(14).text("Price Summary");
    doc.fontSize(10).text(`Service Price: ${booking.servicePrice} BDT`);
    doc.text(`Quantity: ${booking.quantity}`);
    doc.text(`Total Amount: ${booking.totalAmount} BDT`);

    if (booking.note) {
      doc.moveDown();
      doc.fontSize(14).text("Customer Note");
      doc.fontSize(10).text(booking.note);
    }

    if (booking.adminNote) {
      doc.moveDown();
      doc.fontSize(14).text("Admin Note");
      doc.fontSize(10).text(booking.adminNote);
    }

    if (booking.cancellationReason) {
      doc.moveDown();
      doc.fontSize(14).text("Cancellation Reason");
      doc.fontSize(10).text(booking.cancellationReason);
    }

    doc.moveDown(2);

    doc.fontSize(10).text("Thank you for using our service!", {
      align: "center",
    });

    doc.end();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate invoice",
      error: error.message,
    });
  }
});

// User/Admin: get single booking
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("serviceCategory", "title slug image bannerImage");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get booking",
      error: error.message,
    });
  }
});

// Admin: update booking status
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const updateData = {
      status,
    };

    if (adminNote !== undefined) {
      updateData.adminNote = adminNote;
    }

    if (status === "cancelled") {
      updateData.cancelledBy = "admin";
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
});

// Admin: update payment status
router.patch("/:id/payment", protect, adminOnly, async (req, res) => {
  try {
    const { paymentStatus, transactionId, paymentPhone, adminNote } = req.body;

    const allowedPaymentStatuses = [
      "unpaid",
      "pending",
      "paid",
      "failed",
      "refunded",
    ];

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const updateData = {
      paymentStatus,
    };

    if (transactionId !== undefined) {
      updateData.transactionId = transactionId;
    }

    if (paymentPhone !== undefined) {
      updateData.paymentPhone = paymentPhone;
    }

    if (adminNote !== undefined) {
      updateData.adminNote = adminNote;
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
});

// User: cancel own booking
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own booking",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed booking cannot be cancelled",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Paid booking cannot be cancelled. Please contact support.",
      });
    }

    booking.status = "cancelled";
    booking.cancelledBy = "user";
    booking.cancellationReason = cancellationReason || "";

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
});

// ─── REVIEW ROUTES ────────────────────────────────────────────────────────────

// User: submit a review for a completed+paid booking
router.post("/:id/review", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only the booking owner can review
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only review your own booking",
      });
    }

    // Only allow review if booking is completed AND payment is paid
    if (booking.status !== "completed" || booking.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "You can only review a completed and paid booking",
      });
    }

    // Prevent duplicate review
    if (booking.review && booking.review.rating) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this booking",
      });
    }

    booking.review = {
      rating: Number(rating),
      comment: comment || "",
      reviewedAt: new Date(),
    };

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      review: booking.review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message,
    });
  }
});

// Public: get all reviews for a service category by its ID
router.get("/reviews/service/:serviceCategoryId", async (req, res) => {
  try {
    const reviews = await Booking.find({
      serviceCategory: req.params.serviceCategoryId,
      "review.rating": { $exists: true, $ne: null },
    })
      .populate("user", "name")
      .select("customerName serviceTitle review createdAt")
      .sort({ "review.reviewedAt": -1 });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? (
            reviews.reduce((sum, b) => sum + b.review.rating, 0) / totalReviews
          ).toFixed(1)
        : 0;

    return res.status(200).json({
      success: true,
      totalReviews,
      averageRating: Number(averageRating),
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get reviews",
      error: error.message,
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────

module.exports = router;