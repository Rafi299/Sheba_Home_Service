const express = require("express");
const ServiceCategory = require("../models/service.model");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      description,
      image,
      bannerImage,
      features,
      services,
    } = req.body;

    if (!title || !slug || !shortDescription || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, shortDescription, and description are required",
      });
    }

    const existingCategory = await ServiceCategory.findOne({ slug });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Service category already exists with this slug",
      });
    }

    const category = await ServiceCategory.create({
      title,
      slug,
      shortDescription,
      description,
      image,
      bannerImage,
      features,
      services,
    });

    return res.status(201).json({
      success: true,
      message: "Service category created successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create service category",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await ServiceCategory.find({ isAvailable: true }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get service categories",
      error: error.message,
    });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const category = await ServiceCategory.findOne({
      slug: req.params.slug,
      isAvailable: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Service category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get service category",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await ServiceCategory.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Service category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete service category",
      error: error.message,
    });
  }
});

module.exports = router;