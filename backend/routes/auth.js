const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  register, login, logout, getMe,
  updateProfile, changePassword, toggleFavorite,
  forgotPassword, resetPassword,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.put("/favorites/:propertyId", protect, toggleFavorite);

module.exports = router;
