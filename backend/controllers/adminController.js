const User = require("../models/User");
const Property = require("../models/Property");
const Inquiry = require("../models/Inquiry");

// @desc    Get dashboard overview stats
// @route   GET /api/admin/dashboard
// @access  Private (admin)
exports.getDashboard = async (req, res, next) => {
  try {
    const [
      totalProperties, totalUsers, totalInquiries,
      newInquiriesToday, activeAgents,
      recentInquiries, recentProperties,
      inquiriesByMonth,
    ] = await Promise.all([
      Property.countDocuments({ isActive: true }),
      User.countDocuments({ role: "user", isActive: true }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
      User.countDocuments({ role: "agent", isActive: true }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).populate("property", "title"),
      Property.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).select("title type location.city price images"),
      Inquiry.aggregate([
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 },
      ]),
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        totalProperties,
        totalUsers,
        totalInquiries,
        newInquiriesToday,
        activeAgents,
        recentInquiries,
        recentProperties,
        inquiriesByMonth: inquiriesByMonth.reverse(),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({ success: true, total, users });
  } catch (err) {
    next(err);
  }
};

// @desc    Create agent account
// @route   POST /api/admin/users/agent
// @access  Private (admin)
exports.createAgent = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const agent = await User.create({ name, email, phone, password, role: "agent" });
    res.status(201).json({
      success: true,
      message: "Agent account created",
      user: { _id: agent._id, name: agent.name, email: agent.email, role: agent.role },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user role or status
// @route   PUT /api/admin/users/:id
// @access  Private (admin)
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;

    // Prevent admin from deactivating themselves
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot modify your own account here" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
