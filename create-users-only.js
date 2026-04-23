const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createUsersOnly() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create sample users
        const users = [
            {
                name: 'abhinav ashok lawande',
                mobile: '+918329966445',
                dob: '1990-01-01',
                village: 'pune',
                userType: 'farmer',
                district: 'pune'
            },
            {
                name: 'sitaa shetkari',
                mobile: '+918329966446',
                dob: '1985-05-15',
                village: 'nashik',
                userType: 'farmer',
                district: 'nashik'
            },
            {
                name: 'ganesh shetkari',
                mobile: '+918329966447',
                dob: '1978-08-20',
                village: 'ahmednagar',
                userType: 'farmer',
                district: 'ahmednagar'
            },
            {
                name: 'rahul kharididar',
                mobile: '+918329966448',
                dob: '1992-12-10',
                village: 'mumbai',
                userType: 'buyer',
                district: 'mumbai'
            }
        ];

        const createdUsers = await User.insertMany(users);
        console.log('Created users:', createdUsers.length);

        console.log('\n=== Login Credentials ===');
        console.log('Farmers:');
        console.log('1. Mobile: +918329966445, DOB: 1990-01-01');
        console.log('2. Mobile: +918329966446, DOB: 1985-05-15');
        console.log('3. Mobile: +918329966447, DOB: 1978-08-20');
        console.log('\nBuyer:');
        console.log('1. Mobile: +918329966448, DOB: 1992-12-10');

        console.log('\nUsers created successfully!');
        console.log('Now refresh MongoDB Compass to see the users.');
        
    } catch (error) {
        console.error('Error creating users:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createUsersOnly();
