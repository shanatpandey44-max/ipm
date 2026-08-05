const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    // Who submitted
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },

    // What they want
    inquiryType: {
      type: String,
      enum: ["Purchase", "Rent", "Sell", "Evaluation", "Mortgage", "General"],
      default: "General",
    },
    propertyType: { type: String },
    city: {
      type: String,
      enum: ["Indore", "Ujjain", "Dewas", "Bhopal", "Any"],
      default: "Any",
    },
    budget: {
      min: { type: Number },
      max: { type: Number },
    },
    message: { type: String, maxlength: 1000 },

    // Which property (if from property page)
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },

    // Source tracking
    source: {
      type: String,
      enum: ["website_form", "property_page", "whatsapp", "phone", "walk_in", "referral"],
      default: "website_form",
    },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },

    // CRM Status (Phase 2 - Lead Management)
    status: {
      type: String,
      enum: ["new", "contacted", "site_visit_scheduled", "negotiating", "converted", "lost"],
      default: "new",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: [
      {
        text: { type: String },
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    followUpDate: { type: Date },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ phone: 1 });
inquirySchema.index({ isRead: 1 });

module.exports = mongoose.model("Inquiry", inquirySchema);
