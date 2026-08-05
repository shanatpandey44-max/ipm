require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Property = require("../models/Property");
const City = require("../models/City");
const Testimonial = require("../models/Testimonial");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/theipm";

const cities = [
  {
    name: "Indore",
    slug: "indore",
    shortDescription: "Commercial Hub of Madhya Pradesh",
    description: "Indore is the largest city in Madhya Pradesh and a major commercial and financial hub. Known for its cleanliness, food culture, and rapid real estate growth.",
    highlights: ["Fastest growing city in MP", "Best infrastructure", "High ROI on property", "Smart City project"],
    image: { url: "/Indore.jpg" },
    order: 1,
  },
  {
    name: "Ujjain",
    slug: "ujjain",
    shortDescription: "Spiritual & Cultural Capital",
    description: "Ujjain is one of the seven sacred cities of India, home to the famous Mahakaleshwar Jyotirlinga. Growing rapidly with religious tourism and infrastructure development.",
    highlights: ["Religious tourism hub", "Mahakal Corridor development", "Affordable property rates", "Growing infrastructure"],
    image: { url: "/ujjain.jpg" },
    order: 2,
  },
  {
    name: "Dewas",
    slug: "dewas",
    shortDescription: "Industrial Growth Center",
    description: "Dewas is a major industrial city in Madhya Pradesh, known for its pharmaceutical and manufacturing industries. Excellent investment opportunity with growing infrastructure.",
    highlights: ["Major industrial hub", "Affordable land rates", "Near Indore", "Growing connectivity"],
    image: { url: "/Dewas.png" },
    order: 3,
  },
  {
    name: "Bhopal",
    slug: "bhopal",
    shortDescription: "Capital City of Madhya Pradesh",
    description: "Bhopal, the capital of Madhya Pradesh, is known for its lakes, greenery, and growing IT sector. A well-planned city with excellent government infrastructure.",
    highlights: ["State capital", "IT sector growth", "Beautiful lakes", "Excellent connectivity"],
    image: { url: "/Bhopal.png" },
    order: 4,
  },
];

const testimonials = [
  {
    name: "Rohit Mehra",
    role: "Sales Executive",
    location: "Delhi",
    avatar: { url: "https://theipm.in/wp-content/uploads/2025/04/team-james-150x150.jpg" },
    quote: "I had a great experience with I Property. They were very responsive and provided me with a lot of useful information about the properties I was interested in. The team was very patient and understanding of my needs.",
    rating: 5,
    order: 1,
  },
  {
    name: "Anand Dhakad",
    role: "Sales Officer",
    location: "Indore",
    avatar: { url: "https://theipm.in/wp-content/uploads/2025/04/avatar_4-150x150.jpg" },
    quote: "I Property helped me find my dream home. The team was patient, attentive, and understanding of my needs. They provided me with a wide range of options and worked with me every step of the way.",
    rating: 5,
    order: 2,
  },
  {
    name: "Ankit Agrawal",
    role: "Sales Director",
    location: "Indore",
    avatar: { url: "https://theipm.in/wp-content/uploads/2025/04/avatar_3-150x150.jpg" },
    quote: "I had a wonderful experience working with I Property. The team was professional, knowledgeable, and went above and beyond to help me sell my property. Highly recommended!",
    rating: 5,
    order: 3,
  },
];

const properties = [
  {
    title: "The Sky Empire",
    description: "Looking for property in Indore? Visit The Sky Empire Sukama City near MR5 Square. Explore 2, 3 & 4 BHK luxury flats with modern amenities and exclusive booking offers.",
    type: "Residential",
    subType: "3 BHK",
    status: "For Sale",
    label: "New Launch",
    price: { amount: 8500000, unit: "total", displayPrice: "₹85L - ₹1.2Cr" },
    location: { address: "Near MR 5 Square, Super Corridor", locality: "Super Corridor", city: "Indore" },
    size: { area: 1279, displaySize: "1279–1865 sq. ft." },
    bedrooms: 3, bathrooms: 2, parking: 1,
    amenities: ["Swimming Pool", "Gym", "Club House", "24/7 Security", "Power Backup", "Lift"],
    images: [{ url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", isPrimary: true }],
    isFeatured: true,
  },
  {
    title: "Laabham Kunj Vihar",
    description: "Premium residential plots near Ujjain Highway, Indore. Gated community with all modern amenities. RERA approved.",
    type: "Plot",
    subType: "Residential Plot",
    status: "For Sale",
    label: "Featured",
    price: { amount: 2500000, unit: "total", displayPrice: "₹25L - ₹60L" },
    location: { address: "Near Ujjain Highway", locality: "Ujjain Highway", city: "Indore" },
    size: { area: 600, displaySize: "600–1500 sq. ft." },
    amenities: ["Gated Community", "Water Supply", "Electricity", "Bank Loan Available"],
    images: [{ url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", isPrimary: true }],
    isFeatured: true,
  },
  {
    title: "Adarsh Residency",
    description: "Affordable 1 RK, 1 BHK, and 2 BHK flats in Vijay Nagar, Indore. Ready to move. Near all amenities.",
    type: "Residential",
    subType: "2 BHK",
    status: "For Sale",
    label: "",
    price: { amount: 3500000, unit: "total", displayPrice: "₹35L - ₹75L" },
    location: { address: "Vijay Nagar", locality: "Vijay Nagar", city: "Indore" },
    size: { area: 478, displaySize: "478–1232 sq. ft." },
    bedrooms: 2, bathrooms: 2,
    possessionStatus: "Ready to Move",
    amenities: ["Parking", "Lift", "Power Backup", "Garden", "Vaastu Compliant"],
    images: [{ url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", isPrimary: true }],
  },
  {
    title: "MGR Princess HillTop",
    description: "Premium plots on Ujjain-Indore Highway with hill view. Gated society with wide roads and all legal clearances.",
    type: "Plot",
    subType: "Residential Plot",
    status: "For Sale",
    label: "Hot Deal",
    price: { amount: 4000000, unit: "total", displayPrice: "₹40L - ₹2.2Cr" },
    location: { address: "Ujjain–Indore Highway", locality: "Ujjain Highway", city: "Indore" },
    size: { area: 1130, displaySize: "1130–6450 sq. ft." },
    amenities: ["Gated Community", "Bank Loan Available", "Water Supply", "Electricity"],
    images: [{ url: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1200&q=80", isPrimary: true }],
    isFeatured: true,
  },
  {
    title: "Shiv Dham",
    description: "Affordable 1-2 BHK flats near Dewas Naka, Indore. Vaastu compliant, near market and schools.",
    type: "Residential",
    subType: "2 BHK",
    status: "For Sale",
    price: { amount: 2800000, unit: "total", displayPrice: "₹28L - ₹50L" },
    location: { address: "Near Dewas Naka", locality: "Dewas Naka", city: "Indore" },
    size: { area: 650, displaySize: "650–1155 sq. ft." },
    bedrooms: 2, bathrooms: 1,
    possessionStatus: "Ready to Move",
    amenities: ["Vaastu Compliant", "Near Market", "Near School", "Parking"],
    images: [{ url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80", isPrimary: true }],
  },
  {
    title: "Coral Reefs",
    description: "Modern residential apartments on AB Road Highway Touch, Rau, Indore. Green area, CCTV, rainwater harvesting.",
    type: "Residential",
    subType: "2 BHK",
    status: "For Sale",
    price: { amount: 3200000, unit: "total", displayPrice: "₹32L - ₹85L" },
    location: { address: "AB Road Highway Touch, Rau", locality: "Rau", city: "Indore" },
    size: { area: 400, displaySize: "400–1095 sq. ft." },
    bedrooms: 2, bathrooms: 2,
    amenities: ["Garden", "CCTV", "Rainwater Harvesting", "Power Backup"],
    images: [{ url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", isPrimary: true }],
  },
  {
    title: "Tattvam Heights",
    description: "Premium 2, 3 & 4 BHK apartments near MR 10, Vijay Nagar. Concierge service, jogging track, kids play area.",
    type: "Residential",
    subType: "3 BHK",
    status: "For Sale",
    label: "Featured",
    price: { amount: 9000000, unit: "total", displayPrice: "₹90L - ₹1.3Cr" },
    location: { address: "Near MR 10, Vijay Nagar", locality: "Vijay Nagar", city: "Indore" },
    size: { area: 1279, displaySize: "1279–1865 sq. ft." },
    bedrooms: 3, bathrooms: 3, parking: 2,
    amenities: ["Swimming Pool", "Gym", "Club House", "Jogging Track", "Children Play Area", "24/7 Security"],
    images: [{ url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80", isPrimary: true }],
    isFeatured: true,
  },
  {
    title: "Shree Ram Enclave 2",
    description: "Large residential plots near Vijay Nagar, Indore. Corner plots available. Wide roads, drainage, street lights.",
    type: "Plot",
    subType: "Residential Plot",
    status: "For Sale",
    price: { amount: 5500000, unit: "total", displayPrice: "₹55L - ₹1.8Cr" },
    location: { address: "Near Vijay Nagar", locality: "Vijay Nagar", city: "Indore" },
    size: { area: 1453, displaySize: "1453–4519 sq. ft." },
    amenities: ["Gated Community", "Water Supply", "Electricity", "Bank Loan Available"],
    images: [{ url: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80", isPrimary: true }],
  },
  {
    title: "Treasure Park",
    description: "Affordable 20x55 plots on Indore-Ujjain Highway. High ROI potential. All legal papers clear.",
    type: "Plot",
    subType: "Residential Plot",
    status: "For Sale",
    price: { amount: 3000000, unit: "total", displayPrice: "₹30L - ₹35L" },
    location: { address: "Indore–Ujjain Highway", locality: "Ujjain Highway", city: "Indore" },
    size: { area: 1000, displaySize: "1000–1100 sq. ft. (20×55)" },
    amenities: ["Bank Loan Available", "Water Supply", "Electricity"],
    images: [{ url: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80", isPrimary: true }],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      City.deleteMany({}),
      Testimonial.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    // Create admin user
    const admin = await User.create({
      name: "IPM Admin",
      email: process.env.ADMIN_EMAIL || "admin@theipm.in",
      phone: "9009444491",
      password: process.env.ADMIN_PASSWORD || "Admin@IPM2024",
      role: "admin",
    });
    console.log(`👤 Admin created: ${admin.email}`);

    // Create agent
    const agent = await User.create({
      name: "Santosh Prasad Pal",
      email: "santosh@theipm.in",
      phone: "9667600611",
      password: "Agent@IPM2024",
      role: "agent",
    });
    console.log(`👤 Agent created: ${agent.email}`);

    // Seed cities
    await City.insertMany(cities);
    console.log(`🏙️  ${cities.length} cities seeded`);

    // Seed testimonials
    await Testimonial.insertMany(testimonials);
    console.log(`💬 ${testimonials.length} testimonials seeded`);

    // Seed properties one by one so pre-save slug hook fires
    const slugify = require("slugify");
    const propsWithAgent = properties.map((p) => ({
      ...p,
      agent: agent._id,
      slug: slugify(p.title, { lower: true, strict: true }),
    }));
    await Property.insertMany(propsWithAgent);
    console.log(`🏠 ${properties.length} properties seeded`);

    console.log("\n✅ Database seeded successfully!");
    console.log("─────────────────────────────────");
    console.log(`Admin Email:    ${admin.email}`);
    console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || "Admin@IPM2024"}`);
    console.log(`Agent Email:    ${agent.email}`);
    console.log(`Agent Password: Agent@IPM2024`);
    console.log("─────────────────────────────────");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
}

seed();
