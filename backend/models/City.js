const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["Indore", "Ujjain", "Dewas", "Bhopal"],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: { type: String },
    shortDescription: { type: String },
    image: {
      public_id: { type: String },
      url: { type: String },
    },
    coverImage: {
      public_id: { type: String },
      url: { type: String },
    },
    highlights: [{ type: String }],
    metaTitle: { type: String },
    metaDescription: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

citySchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase();
  next();
});

module.exports = mongoose.model("City", citySchema);
