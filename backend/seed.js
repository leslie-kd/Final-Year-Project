const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Admin = require('./src/models/Admin');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing
    await User.deleteMany();
    await Admin.deleteMany();

    // Create a test client
    await User.create({
      firstName: 'Test',
      lastName: 'Client',
      email: 'client@test.com',
      phoneNumber: '1234567890',
      passwordHash: 'password123', // Will be hashed by pre-save hook
      roles: ['client']
    });

    // Create a test provider
    await User.create({
      firstName: 'Test',
      lastName: 'Provider',
      email: 'provider@test.com',
      phoneNumber: '0987654321',
      passwordHash: 'password123',
      roles: ['provider'],
      providerDetails: {
        jobTitle: 'Plumber',
        isAvailable: true
      }
    });

    // Create a test admin
    await Admin.create({
      name: 'Super Admin',
      email: 'admin@servipro.com',
      passwordHash: 'admin123',
      role: 'superadmin'
    });

    console.log('Database Seeded Successfully!');
    console.log('\n--- Test Credentials ---');
    console.log('Mobile App - Client:');
    console.log('Email: client@test.com | Password: password123\n');
    console.log('Mobile App - Provider:');
    console.log('Email: provider@test.com | Password: password123\n');
    console.log('Admin Dashboard:');
    console.log('Email: admin@servipro.com | Password: admin123');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
