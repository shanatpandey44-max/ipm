const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getDashboard, getUsers, createAgent,
  updateUser, deleteUser,
} = require("../controllers/adminController");

router.use(protect, authorize("admin")); // All admin routes protected

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.post("/users/agent", createAgent);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
