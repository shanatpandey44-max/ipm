export type Property = {
  id: string;
  title: string;
  location: string;
  size: string;
  type: "Plot" | "Residential" | "Commercial";
  image: string;
  price?: string;
  features?: string[];
};

export const properties: Property[] = [
  {
    id: "sky-empire",
    title: "The Sky Empire",
    location: "Near MR 5 Square, Super Corridor, Indore",
    size: "1279–1865 sq. ft.",
    type: "Residential",
    price: "₹85L - ₹1.2Cr",
    features: ["Swimming Pool", "Club House", "Gym", "24/7 Security"],
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "laabham-kunj-vihar",
    title: "Laabham Kunj Vihar",
    location: "Plots in Indore Near Ujjain Highway",
    size: "600–1500 sq. ft.",
    type: "Plot",
    price: "₹25L - ₹60L",
    features: ["Gated Community", "Water Supply", "Electricity", "Road Access"],
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "adarsh-residency",
    title: "Adarsh Residency",
    location: "1 RK, 1 BHK, and 2 BHK flats in Vijay Nagar, Indore",
    size: "478–1232 sq. ft.",
    type: "Residential",
    price: "₹35L - ₹75L",
    features: ["Parking", "Lift", "Power Backup", "Garden"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mgr-princess",
    title: "MGR Princess HillTop",
    location: "Plots on Ujjain–Indore Highway, Indore",
    size: "1130–6450 sq. ft.",
    type: "Plot",
    price: "₹40L - ₹2.2Cr",
    features: ["Hill View", "Gated Society", "Legal Clearance", "Bank Loan"],
    image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "shiv-dham",
    title: "Shiv Dham",
    location: "1–2 BHK Flats Near Dewas Naka, Indore",
    size: "650–1155 sq. ft.",
    type: "Residential",
    price: "₹28L - ₹50L",
    features: ["Ready to Move", "Vaastu Compliant", "Near Market", "School Nearby"],
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "coral-reefs",
    title: "Coral Reefs",
    location: "AB Road Highway Touch, Rau, Indore",
    size: "400–1095 sq. ft.",
    type: "Residential",
    price: "₹32L - ₹85L",
    features: ["Modern Design", "Green Area", "CCTV", "Rainwater Harvesting"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "tattvam-heights",
    title: "Tattvam Heights",
    location: "Near MR 10, Vijay Nagar, Indore",
    size: "1279–1865 sq. ft.",
    type: "Residential",
    price: "₹90L - ₹1.3Cr",
    features: ["Premium Finish", "Concierge", "Kids Play Area", "Jogging Track"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "shree-ram-enclave",
    title: "Shree Ram Enclave 2",
    location: "Plots Near Vijay Nagar, Indore",
    size: "1453–4519 sq. ft.",
    type: "Plot",
    price: "₹55L - ₹1.8Cr",
    features: ["Corner Plots", "Wide Roads", "Drainage", "Street Lights"],
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "treasure-park",
    title: "Treasure Park",
    location: "Plots in Indore–Ujjain Highway, Indore",
    size: "1000–1100 sq. ft. (20×55)",
    type: "Plot",
    price: "₹30L - ₹35L",
    features: ["Affordable", "Legal Papers", "Development Potential", "High ROI"],
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80",
  },
];

export const cities = [
  {
    name: "Indore",
    count: 4,
    image: "/Indore.jpg",
    description: "Commercial Hub of MP",
  },
  {
    name: "Ujjain",
    count: 0,
    image: "/ujjain.jpg",
    description: "Spiritual & Cultural City",
  },
  {
    name: "Dewas",
    count: 0,
    image: "/Dewas.png",
    description: "Industrial Growth Center",
  },
  {
    name: "Bhopal",
    count: 0,
    image: "/Bhopal.png",
    description: "Capital City of MP",
  },
];

export const testimonials = [
  {
    name: "Rohit Mehra",
    role: "Sales Executive",
    location: "Delhi",
    avatar: "https://theipm.in/wp-content/uploads/2025/04/team-james-150x150.jpg",
    rating: 5,
    quote:
      "I had a great experience with I Property. They were very responsive and provided me with a lot of useful information about the properties I was interested in. The team was very patient and understanding of my needs, and helped me find the perfect property that met all my requirements.",
  },
  {
    name: "Anand Dhakad",
    role: "Sales Officer",
    location: "Indore",
    avatar: "https://theipm.in/wp-content/uploads/2025/04/avatar_4-150x150.jpg",
    rating: 5,
    quote:
      "I Property helped me find my dream home. The team was patient, attentive, and understanding of my needs. They provided me with a wide range of options and worked with me every step of the way to ensure that I found the perfect property.",
  },
  {
    name: "Ankit Agrawal",
    role: "Sales Director",
    location: "Indore",
    avatar: "https://theipm.in/wp-content/uploads/2025/04/avatar_3-150x150.jpg",
    rating: 5,
    quote:
      "I had a wonderful experience working with I Property. The team was professional, knowledgeable, and went above and beyond to help me sell my property. They provided regular updates and worked tirelessly to ensure my property received maximum exposure in the market.",
  },
];

export const partners = [
  "https://theipm.in/wp-content/uploads/2016/03/partner-01-e1582734705113.jpg",
  "https://theipm.in/wp-content/uploads/2016/03/partner-02-e1582734691936.jpg",
  "https://theipm.in/wp-content/uploads/2016/03/partner-04-e1582734649458.jpg",
  "https://theipm.in/wp-content/uploads/2016/03/partner-03-e1582734671602.jpg",
  "https://theipm.in/wp-content/uploads/2016/03/partner-05-e1582734603812.jpg",
];

export const pillars = [
  {
    n: "01",
    title: "Local Expertise You Can Trust",
    body: "With deep roots in Indore, we understand every corner of the city's property landscape.",
    icon: "Award",
  },
  {
    n: "02",
    title: "Complete Plot & Property Solutions",
    body: "From buying and selling to plot management and maintenance, we handle it all under one roof.",
    icon: "Users",
  },
  {
    n: "03",
    title: "Client-First Approach",
    body: "We prioritize transparency, timely updates, and personalized service to protect your investment and peace of mind.",
    icon: "TrendingUp",
  },
];

export const cityOptions = ["Indore", "Ujjain", "Dewas", "Bhopal"];
export const propertyTypeOptions = [
  "Commercial – Office",
  "Commercial – Shop",
  "Residential – Apartment",
  "Residential – Condo",
  "Residential – Multi Family Home",
  "Residential – Single Family Home",
  "Residential – Studio",
  "Residential – Villa",
];
export const inquiryTypes = ["Purchase", "Rent", "Sell", "Evaluation", "Mortgage"];

// Premium features
export const premiumFeatures = [
  "100% Legal Verification",
  "RERA Registered Projects",
  "Best ROI Guarantee",
  "24/7 Customer Support",
  "Free Site Visits",
  "Documentation Assistance",
  "Bank Loan Support",
  "Post-Sale Services",
];

// Stats for hero
export const heroStats = [
  { value: "10+", label: "Premium Projects", sub: "Across 4 cities" },
  { value: "₹3L+", label: "Client Investment", sub: "Trusted & secured" },
  { value: "100%", label: "Legally Verified", sub: "RERA compliant" },
];
