const Property = require("../models/Property");
const { uploadToCloudinary, deleteFromCloudinary } = require("../middleware/upload");

// @desc    Get all properties (with filter, search, pagination)
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  try {
    const {
      city, type, status, subType, minPrice, maxPrice,
      bedrooms, furnishing, possessionStatus, label,
      search, sort, page = 1, limit = 12, featured,
    } = req.query;

    const query = { isActive: true };

    if (city) query["location.city"] = city;
    if (type) query.type = type;
    if (status) query.status = status;
    if (subType) query.subType = subType;
    if (furnishing) query.furnishing = furnishing;
    if (possessionStatus) query.possessionStatus = possessionStatus;
    if (label) query.label = label;
    if (featured === "true") query.isFeatured = true;
    if (bedrooms) query.bedrooms = parseInt(bedrooms);

    if (minPrice || maxPrice) {
      query["price.amount"] = {};
      if (minPrice) query["price.amount"].$gte = parseInt(minPrice);
      if (maxPrice) query["price.amount"].$lte = parseInt(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
        { "location.locality": { $regex: search, $options: "i" } },
      ];
    }

    // Sort options
    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_low: { "price.amount": 1 },
      price_high: { "price.amount": -1 },
      popular: { views: -1 },
    };
    const sortBy = sortMap[sort] || { createdAt: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Property.countDocuments(query);

    const properties = await Property.find(query)
      .select("title slug type subType status label price location size bedrooms bathrooms images amenities isFeatured views createdAt")
      .populate("agent", "name phone avatar")
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      count: properties.length,
      properties,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single property by slug
// @route   GET /api/properties/:slug
// @access  Public
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug, isActive: true })
      .populate("agent", "name phone email avatar role")
      .populate("project", "name");

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Increment views
    await Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } });

    // Get related properties (same city + type)
    const related = await Property.find({
      _id: { $ne: property._id },
      "location.city": property.location.city,
      type: property.type,
      isActive: true,
    })
      .select("title slug type price location size images")
      .limit(4);

    res.status(200).json({ success: true, property, related });
  } catch (err) {
    next(err);
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Private (admin, agent)
exports.createProperty = async (req, res, next) => {
  try {
    req.body.agent = req.user.id;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file, i) =>
        uploadToCloudinary(file.buffer, "theipm/properties").then((result) => ({
          public_id: result.public_id,
          url: result.secure_url,
          isPrimary: i === 0,
        }))
      );
      req.body.images = await Promise.all(uploadPromises);
    }

    const property = await Property.create(req.body);
    res.status(201).json({ success: true, property });
  } catch (err) {
    next(err);
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (admin, agent - own property)
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Agent can only update own properties
    if (req.user.role === "agent" && property.agent.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to update this property" });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, "theipm/properties").then((result) => ({
          public_id: result.public_id,
          url: result.secure_url,
          isPrimary: false,
        }))
      );
      const newImages = await Promise.all(uploadPromises);
      req.body.images = [...(property.images || []), ...newImages];
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, property });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (admin only)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Delete images from Cloudinary
    for (const img of property.images) {
      await deleteFromCloudinary(img.public_id);
    }

    await property.deleteOne();
    res.status(200).json({ success: true, message: "Property deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a single image from property
// @route   DELETE /api/properties/:id/images/:public_id
// @access  Private (admin, agent)
exports.deletePropertyImage = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const publicId = decodeURIComponent(req.params.public_id);
    await deleteFromCloudinary(publicId);

    property.images = property.images.filter((img) => img.public_id !== publicId);
    await property.save();

    res.status(200).json({ success: true, images: property.images });
  } catch (err) {
    next(err);
  }
};

// @desc    Get property stats (admin dashboard)
// @route   GET /api/properties/stats
// @access  Private (admin)
exports.getPropertyStats = async (req, res, next) => {
  try {
    const [total, byCity, byType, byStatus, featured, recentViews] = await Promise.all([
      Property.countDocuments({ isActive: true }),
      Property.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$location.city", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Property.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]),
      Property.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Property.countDocuments({ isFeatured: true, isActive: true }),
      Property.find({ isActive: true })
        .select("title slug views")
        .sort({ views: -1 })
        .limit(5),
    ]);

    res.status(200).json({
      success: true,
      stats: { total, byCity, byType, byStatus, featured, recentViews },
    });
  } catch (err) {
    next(err);
  }
};
