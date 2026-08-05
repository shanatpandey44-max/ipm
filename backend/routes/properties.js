const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const {
  getProperties, getProperty, createProperty,
  updateProperty, deleteProperty, deletePropertyImage,
  getPropertyStats,
} = require("../controllers/propertyController");

// Public routes
router.get("/", getProperties);
router.get("/stats", protect, authorize("admin"), getPropertyStats);
router.get("/:slug", getProperty);

// Protected routes
router.post(
  "/",
  protect,
  authorize("admin", "agent"),
  upload.array("images", 15),
  createProperty
);
router.put(
  "/:id",
  protect,
  authorize("admin", "agent"),
  upload.array("images", 10),
  updateProperty
);
router.delete("/:id", protect, authorize("admin"), deleteProperty);
router.delete("/:id/images/:public_id", protect, authorize("admin", "agent"), deletePropertyImage);

module.exports = router;
