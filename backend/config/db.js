const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Optional: Connection se pehle DNS set karo (agar pehle se nahi kiya)
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '1.1.1.1']);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 5 se 10 seconds karo
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error:`);
    console.error(`   Message: ${error.message}`);
    
    // Extra debugging info
    if (error.code === 'ENOTFOUND' || error.code === 'ENODATA') {
      console.error(`   🔍 DNS Error - Check your internet/DNS settings`);
      console.error(`   💡 Try: ping ${new URL(process.env.MONGO_URI).hostname}`);
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;