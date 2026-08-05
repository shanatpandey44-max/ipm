const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const City = require("../models/City");
const Testimonial = require("../models/Testimonial");
const Property = require("../models/Property");

// ── Cities ──────────────────────────────────────────────

// GET all cities with property count
router.get("/cities", async (req, res, next) => {
  try {
    const cities = await City.find({ isActive: true }).sort({ order: 1 });

    // Attach live property count per city
    const citiesWithCount = await Promise.all(
      cities.map(async (city) => {
        const count = await Property.countDocuments({
          "location.city": city.name,
          isActive: true,
        });
        return { ...city.toObject(), propertyCount: count };
      })
    );

    res.status(200).json({ success: true, cities: citiesWithCount });
  } catch (err) {
    next(err);
  }
});

// GET single city by slug
router.get("/cities/:slug", async (req, res, next) => {
  try {
    const city = await City.findOne({ slug: req.params.slug, isActive: true });
    if (!city) {
      return res.status(404).json({ success: false, message: "City not found" });
    }

    const propertyCount = await Property.countDocuments({
      "location.city": city.name,
      isActive: true,
    });

    res.status(200).json({ success: true, city: { ...city.toObject(), propertyCount } });
  } catch (err) {
    next(err);
  }
});

// Admin: create/update city
router.post("/cities", protect, authorize("admin"), async (req, res, next) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json({ success: true, city });
  } catch (err) {
    next(err);
  }
});

router.put("/cities/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, city });
  } catch (err) {
    next(err);
  }
});

// ── Testimonials ─────────────────────────────────────────

// GET all active testimonials
router.get("/testimonials", async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .populate("property", "title slug");
    res.status(200).json({ success: true, testimonials });
  } catch (err) {
    next(err);
  }
});

// Admin: create testimonial
router.post("/testimonials", protect, authorize("admin"), async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, testimonial });
  } catch (err) {
    next(err);
  }
});

router.put("/testimonials/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, testimonial });
  } catch (err) {
    next(err);
  }
});

router.delete("/testimonials/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Testimonial deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
