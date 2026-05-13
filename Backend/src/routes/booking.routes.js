const express = require("express");
const Booking = require("../models/booking.model");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      user,
      service,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      serviceTitle,
      bookingDate,
      bookingTime,
      note,
    } = req.body;

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !customerAddress ||
      !serviceTitle ||
      !bookingDate ||
      !bookingTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Required booking fields are missing",
      });
    }

    const booking = await Booking.create({
      user,
      service,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      serviceTitle,
      bookingDate,
      bookingTime,
      note,
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

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("service", "title category price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
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

router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("service", "title category price");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
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

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

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

module.exports = router;