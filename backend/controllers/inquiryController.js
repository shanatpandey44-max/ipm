const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");
const nodemailer = require("nodemailer");

// Helper: send email notification
const notifyAdmin = async (inquiry) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: `"IPM Website" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || "admin@theipm.in",
      subject: `🔔 New Inquiry from ${inquiry.name}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:520px;margin:auto;padding:32px;background:#f8fafc;border-radius:12px;">
          <h2 style="color:#0B2545;margin-bottom:4px;">New Property Inquiry</h2>
          <p style="color:#64748b;margin-bottom:24px;font-size:14px;">Received just now via IPM website</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;color:#94a3b8;width:120px;">Name</td><td style="padding:8px 0;color:#0B2545;font-weight:600;">${inquiry.name}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Phone</td><td style="padding:8px 0;color:#0B2545;font-weight:600;">${inquiry.phone}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Email</td><td style="padding:8px 0;color:#0B2545;">${inquiry.email || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Type</td><td style="padding:8px 0;color:#0B2545;">${inquiry.inquiryType || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">City</td><td style="padding:8px 0;color:#0B2545;">${inquiry.city || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8;">Message</td><td style="padding:8px 0;color:#0B2545;">${inquiry.message || "—"}</td></tr>
          </table>
          <a href="${process.env.CLIENT_URL}/admin/inquiries" style="display:inline-block;margin-top:24px;background:#00A3E0;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View in Dashboard</a>
        </div>
      `,
    });
  } catch (err) {
    console.error("Email notification failed:", err.message);
  }
};

// @desc    Submit inquiry (public)
// @route   POST /api/inquiries
// @access  Public
exports.submitInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, inquiryType, propertyType, city, budget, message, propertyId, source } = req.body;

    if (propertyId) {
      const property = await Property.findById(propertyId);
      if (property) await Property.findByIdAndUpdate(propertyId, { $inc: { inquiries: 1 } });
    }

    const inquiry = await Inquiry.create({
      name, email, phone, inquiryType, propertyType, city, budget, message,
      property: propertyId || null,
      source: source || "website_form",
      utmSource: req.query.utm_source,
      utmMedium: req.query.utm_medium,
      utmCampaign: req.query.utm_campaign,
    });

    // Fire-and-forget email notification
    notifyAdmin(inquiry);

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully. Our team will contact you within 24 hours.",
      inquiryId: inquiry._id,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private (admin, agent)
exports.getInquiries = async (req, res, next) => {
  try {
    const { status, city, source, isRead, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (city) query.city = city;
    if (source) query.source = source;
    if (isRead !== undefined) query.isRead = isRead === "true";
    if (req.user.role === "agent") query.assignedTo = req.user.id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .populate("property", "title slug")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const unreadCount = await Inquiry.countDocuments({ isRead: false });

    res.status(200).json({
      success: true, total, page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)), unreadCount, inquiries,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single inquiry
// @route   GET /api/inquiries/:id
// @access  Private (admin, agent)
exports.getInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate("property", "title slug images location price")
      .populate("assignedTo", "name email phone")
      .populate("notes.addedBy", "name");

    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });

    if (!inquiry.isRead) await Inquiry.findByIdAndUpdate(req.params.id, { isRead: true });

    res.status(200).json({ success: true, inquiry });
  } catch (err) {
    next(err);
  }
};

// @desc    Update inquiry
// @route   PUT /api/inquiries/:id
// @access  Private (admin, agent)
exports.updateInquiry = async (req, res, next) => {
  try {
    const { status, assignedTo, followUpDate, note } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });

    if (status) inquiry.status = status;
    if (assignedTo) inquiry.assignedTo = assignedTo;
    if (followUpDate) inquiry.followUpDate = followUpDate;
    if (note) inquiry.notes.push({ text: note, addedBy: req.user.id });

    await inquiry.save();
    res.status(200).json({ success: true, inquiry });
  } catch (err) {
    next(err);
  }
};

// @desc    Get inquiry stats
// @route   GET /api/inquiries/stats
// @access  Private (admin)
exports.getInquiryStats = async (req, res, next) => {
  try {
    const [total, byStatus, byCity, bySource, todayCount, weekCount] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Inquiry.aggregate([{ $group: { _id: "$city", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Inquiry.aggregate([{ $group: { _id: "$source", count: { $sum: 1 } } }]),
      Inquiry.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
      Inquiry.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
    ]);

    res.status(200).json({ success: true, stats: { total, byStatus, byCity, bySource, todayCount, weekCount } });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (admin)
exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
    res.status(200).json({ success: true, message: "Inquiry deleted" });
  } catch (err) {
    next(err);
  }
};
