const express = require("express");
const ServiceCategory = require("../models/service.model");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

const router = express.Router();

// Admin: create service category
router.post("/", protect, adminOnly, async (req, res) => {
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
      isAvailable,
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
      features: features || [],
      services: services || [],
      isAvailable,
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

// Public: get available service categories
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

// Admin: get all service categories, including unavailable
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  try {
    const categories = await ServiceCategory.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get all service categories",
      error: error.message,
    });
  }
});

// Public: get single available category by slug
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

// Admin: get single category by id
router.get("/admin/:id", protect, adminOnly, async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);

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

// Admin: update service category
router.put("/:id", protect, adminOnly, async (req, res) => {
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
      isAvailable,
    } = req.body;

    const category = await ServiceCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Service category not found",
      });
    }

    if (slug && slug !== category.slug) {
      const existingCategory = await ServiceCategory.findOne({ slug });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "Another service category already exists with this slug",
        });
      }
    }

    category.title = title ?? category.title;
    category.slug = slug ?? category.slug;
    category.shortDescription = shortDescription ?? category.shortDescription;
    category.description = description ?? category.description;
    category.image = image ?? category.image;
    category.bannerImage = bannerImage ?? category.bannerImage;
    category.features = features ?? category.features;
    category.services = services ?? category.services;
    category.isAvailable =
      typeof isAvailable === "boolean" ? isAvailable : category.isAvailable;

    const updatedCategory = await category.save();

    return res.status(200).json({
      success: true,
      message: "Service category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update service category",
      error: error.message,
    });
  }
});

// Admin: delete service category
router.delete("/:id", protect, adminOnly, async (req, res) => {
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