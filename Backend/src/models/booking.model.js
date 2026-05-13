const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },

    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },

    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
    },

    customerPhone: {
      type: String,
      required: [true, "Customer phone is required"],
      trim: true,
    },

    customerAddress: {
      type: String,
      required: [true, "Customer address is required"],
    },

    serviceTitle: {
      type: String,
      required: [true, "Service title is required"],
    },

    bookingDate: {
      type: String,
      required: [true, "Booking date is required"],
    },

    bookingTime: {
      type: String,
      required: [true, "Booking time is required"],
    },

    note: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;