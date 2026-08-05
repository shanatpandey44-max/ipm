const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  submitInquiry, getInquiries, getInquiry,
  updateInquiry, deleteInquiry, getInquiryStats,
} = require("../controllers/inquiryController");

// Public
router.post("/", submitInquiry);

// Protected
router.get("/", protect, authorize("admin", "agent"), getInquiries);
router.get("/stats", protect, authorize("admin"), getInquiryStats);
router.get("/:id", protect, authorize("admin", "agent"), getInquiry);
router.put("/:id", protect, authorize("admin", "agent"), updateInquiry);
router.delete("/:id", protect, authorize("admin"), deleteInquiry);

module.exports = router;
