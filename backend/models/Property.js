const mongoose = require("mongoose");
const slugify = require("slugify");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },

    // Type & Status
    type: {
      type: String,
      required: true,
      enum: ["Residential", "Commercial", "Plot"],
    },
    subType: {
      type: String,
      enum: [
        "Apartment", "Villa", "Independent House", "Studio",
        "1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK",
        "Office", "Shop", "Showroom", "Warehouse",
        "Residential Plot", "Commercial Plot", "Agricultural Plot",
      ],
    },
    status: {
      type: String,
      enum: ["For Sale", "For Rent", "Sold", "Rented"],
      default: "For Sale",
    },
    label: {
      type: String,
      enum: ["New Launch", "Featured", "Hot Deal", "Reduced Price", ""],
      default: "",
    },

    // Pricing
    price: {
      amount: { type: Number, required: [true, "Price is required"] },
      unit: { type: String, enum: ["total", "per_sqft", "per_month"], default: "total" },
      negotiable: { type: Boolean, default: false },
      displayPrice: { type: String }, // e.g. "₹85L - ₹1.2Cr"
    },

    // Location
    location: {
      address: { type: String, required: true },
      locality: { type: String },
      city: {
        type: String,
        required: true,
        enum: ["Indore", "Ujjain", "Dewas", "Bhopal"],
      },
      state: { type: String, default: "Madhya Pradesh" },
      pincode: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
      mapEmbedUrl: { type: String },
    },

    // Size & Details
    size: {
      area: { type: Number }, // in sq ft
      areaUnit: { type: String, enum: ["sq ft", "sq mt", "bigha", "acre"], default: "sq ft" },
      displaySize: { type: String }, // e.g. "1279–1865 sq. ft."
      length: { type: Number },
      width: { type: Number },
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    balconies: { type: Number, default: 0 },
    parking: { type: Number, default: 0 },
    floors: { type: Number },
    totalFloors: { type: Number },
    facing: {
      type: String,
      enum: ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West", ""],
      default: "",
    },
    furnishing: {
      type: String,
      enum: ["Unfurnished", "Semi-Furnished", "Fully Furnished", ""],
      default: "",
    },
    possessionStatus: {
      type: String,
      enum: ["Ready to Move", "Under Construction", "New Launch", ""],
      default: "",
    },
    possessionDate: { type: Date },
    yearBuilt: { type: Number },
    reraNumber: { type: String },

    // Amenities
    amenities: [
      {
        type: String,
        enum: [
          "Swimming Pool", "Gym", "Club House", "Garden", "Children Play Area",
          "Jogging Track", "24/7 Security", "CCTV", "Power Backup", "Lift",
          "Parking", "Visitor Parking", "Rainwater Harvesting", "Solar Power",
          "Intercom", "Fire Safety", "Gated Community", "Vaastu Compliant",
          "Bank Loan Available", "Near Metro", "Near School", "Near Hospital",
          "Near Market", "Near Highway", "Water Supply", "Electricity",
        ],
      },
    ],

    // Media
    images: [
      {
        public_id: { type: String },
        url: { type: String, required: true },
        caption: { type: String, default: "" },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    videoUrl: { type: String },
    virtualTourUrl: { type: String },
    floorPlanUrl: { type: String },

    // Relations
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },

    // Stats
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate slug from title
propertySchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();
  const base = slugify(this.title, { lower: true, strict: true });
  let slug = base;
  let count = 1;
  while (await mongoose.model("Property").findOne({ slug, _id: { $ne: this._id } })) {
    slug = `${base}-${count++}`;
  }
  this.slug = slug;
  next();
});

// Index for fast search
propertySchema.index({ "location.city": 1, type: 1, status: 1 });
propertySchema.index({ isFeatured: 1, isActive: 1 });
propertySchema.index({ "price.amount": 1 });
propertySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Property", propertySchema);
