const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    serviceCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCategory",
      default: null,
    },

    serviceOptionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    serviceCategoryTitle: {
      type: String,
      required: [true, "Service category title is required"],
      trim: true,
    },

    serviceTitle: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },

    servicePrice: {
      type: Number,
      required: [true, "Service price is required"],
      default: 0,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      default: 0,
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

    adminNote: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "completed", "cancelled"],
      default: "pending",
    },

    paymentMethod: {
  type: String,
  enum: ["cash", "online", "bkash", "nagad", "card"],
  default: "cash",
  },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed", "refunded"],
      default: "unpaid",
    },

    transactionId: {
      type: String,
      default: "",
    },

    paymentPhone: {
      type: String,
      default: "",
    },

    paymentScreenshot: {
      type: String,
      default: "",
    },

    cancelledBy: {
      type: String,
      enum: ["user", "admin", ""],
      default: "",
    },

    cancellationReason: {
      type: String,
      default: "",
    },

    // ─── Review fields ───────────────────────────────────────────
    review: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },
      comment: {
        type: String,
        trim: true,
        default: "",
      },
      reviewedAt: {
        type: Date,
        default: null,
      },
    },
    // ─────────────────────────────────────────────────────────────
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;