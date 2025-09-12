const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Lead = require('../models/Lead');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('Cleared existing data');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });
    console.log('Created test user');

    // Sample data for leads
    const sources = ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'];
    const statuses = ['new', 'contacted', 'qualified', 'lost', 'won'];
    const firstNames = [
      'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica',
      'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Jennifer', 'Daniel',
      'Lisa', 'Matthew', 'Nancy', 'Anthony', 'Karen', 'Mark', 'Betty', 'Donald',
      'Helen', 'Steven', 'Sandra', 'Paul', 'Donna', 'Andrew', 'Carol', 'Joshua',
      'Ruth', 'Kenneth', 'Sharon', 'Kevin', 'Michelle', 'Brian', 'Laura', 'George',
      'Sarah', 'Timothy', 'Kimberly', 'Ronald', 'Deborah', 'Jason', 'Dorothy'
    ];
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
      'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
      'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
      'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
      'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell'
    ];
    const companies = [
      'TechCorp', 'InnovateLabs', 'Digital Solutions', 'Future Systems', 'CloudTech',
      'DataDriven Inc', 'SmartWorks', 'NextGen Technologies', 'CyberSoft', 'AI Dynamics',
      'Quantum Computing', 'Blockchain Solutions', 'Machine Learning Co', 'Robotics Inc',
      'Virtual Reality Labs', 'Augmented Systems', 'IoT Innovations', 'Big Data Corp',
      'Analytics Pro', 'Insight Technologies', 'Predictive Systems', 'Automation Co',
      'Efficiency Labs', 'Productivity Solutions', 'Workflow Technologies', 'Process Inc',
      'Optimization Corp', 'Performance Systems', 'Scalable Solutions', 'Enterprise Tech'
    ];
    const cities = [
      'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
      'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
      'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis',
      'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville',
      'Detroit', 'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville',
      'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento'
    ];
    const states = [
      'NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA', 'TX', 'FL',
      'TX', 'OH', 'NC', 'CA', 'IN', 'WA', 'CO', 'DC', 'MA', 'TX', 'TN', 'MI',
      'OK', 'OR', 'NV', 'TN', 'KY', 'MD', 'WI', 'NM', 'AZ', 'CA', 'CA'
    ];

    // Generate 100+ leads
    const leads = [];
    for (let i = 0; i < 120; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const state = states[Math.floor(Math.random() * states.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const score = Math.floor(Math.random() * 101);
      const leadValue = Math.floor(Math.random() * 50000) + 1000;
      const isQualified = Math.random() > 0.5;
      
      // Random last activity date (within last 30 days or null)
      const lastActivityAt = Math.random() > 0.3 
        ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        : null;

      leads.push({
        first_name: firstName,
        last_name: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        company: company,
        city: city,
        state: state,
        source: source,
        status: status,
        score: score,
        lead_value: leadValue,
        last_activity_at: lastActivityAt,
        is_qualified: isQualified,
        created_by: testUser._id
      });
    }

    await Lead.insertMany(leads);
    console.log(`Created ${leads.length} leads`);

    console.log('Database seeded successfully!');
    console.log('Test credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(() => {
  seedDatabase();
});
