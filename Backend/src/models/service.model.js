const mongoose = require("mongoose");

const serviceOptionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Service option title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Service option description is required"],
    },

    price: {
      type: Number,
      required: [true, "Service option price is required"],
    },

    duration: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const serviceCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Category title is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    image: {
      type: String,
      default: "",
    },

    bannerImage: {
      type: String,
      default: "",
    },

    features: {
      type: [String],
      default: [],
    },

    services: {
      type: [serviceOptionSchema],
      default: [],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceCategory = mongoose.model("ServiceCategory", serviceCategorySchema);

module.exports = ServiceCategory;