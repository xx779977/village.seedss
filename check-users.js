const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get all users
        const users = await User.find({});
        console.log('\n=== All Users in Database ===');
        
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. ${user.name}`);
            console.log(`   Mobile: ${user.mobile}`);
            console.log(`   DOB: ${user.dob}`);
            console.log(`   Village: ${user.village}`);
            console.log(`   User Type: ${user.userType}`);
            console.log(`   Active: ${user.isActive}`);
        });

        console.log('\n=== Login Credentials ===');
        console.log('Use any of these combinations to login:');
        
        users.forEach((user, index) => {
            console.log(`\nUser ${index + 1}:`);
            console.log(`   Mobile: ${user.mobile}`);
            console.log(`   DOB: ${user.dob}`);
        });
        
    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkUsers();
