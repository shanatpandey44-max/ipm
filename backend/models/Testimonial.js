const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    location: { type: String, trim: true },
    avatar: {
      public_id: { type: String },
      url: { type: String, default: "" },
    },
    quote: {
      type: String,
      required: true,
      maxlength: [800, "Quote cannot exceed 800 characters"],
    },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
