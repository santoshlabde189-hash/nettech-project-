const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const User = require('../models/User');

const seedAdmin = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('Error: MONGO_URI is missing in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected for admin seed.');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nettech.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    let admin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (admin) {
      console.log(`Admin account already exists with email: ${adminEmail}`);
      admin.role = 'admin';
      admin.name = adminName;
      admin.password = adminPassword; // Will be hashed via pre-save hook
      await admin.save();
      console.log(`Admin credentials updated successfully.`);
    } else {
      admin = await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'admin'
      });
      console.log(`Admin user created successfully with email: ${adminEmail}`);
    }

    console.log('Seed completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
};

seedAdmin();
