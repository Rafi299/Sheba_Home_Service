const express = require("express");
const upload = require("../middlewares/upload.middleware");
const imagekit = require("../config/imagekit");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/image",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file uploaded",
        });
      }

      const fileName = `${Date.now()}-${req.file.originalname}`;

      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName,
        folder: "/home-service",
      });

      return res.status(201).json({
        success: true,
        message: "Image uploaded successfully",
        image: {
          url: result.url,
          fileId: result.fileId,
          name: result.name,
          thumbnailUrl: result.thumbnailUrl,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: error.message,
      });
    }
  }
);

module.exports = router;