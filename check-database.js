const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

async function checkDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully!');
        
        // Check database info
        const db = mongoose.connection.db;
        console.log(`Database: ${db.databaseName}`);
        
        // List collections
        const collections = await db.listCollections().toArray();
        console.log('\nCollections:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });
        
        // Count users
        const userCount = await User.countDocuments();
        console.log(`\nUsers in database: ${userCount}`);
        
        // Count products
        const productCount = await Product.countDocuments();
        console.log(`Products in database: ${productCount}`);
        
        // Show recent users
        const recentUsers = await User.find().limit(3);
        console.log('\nRecent users:');
        recentUsers.forEach(user => {
            console.log(`- ${user.name} (${user.mobile})`);
        });
        
        console.log('\nMongoDB is working perfectly!');
        
    } catch (error) {
        console.error('Database connection error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkDatabase();
