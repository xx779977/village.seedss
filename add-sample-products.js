const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

async function addSampleProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get users to link products to
        const users = await User.find({});
        if (users.length === 0) {
            console.log('No users found. Please run create-users-only.js first.');
            return;
        }

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Create sample products
        const products = [
            {
                name: 'bhajya',
                category: 'vegetables',
                farmer: 'abhinav ashok lawande',
                village: 'pune',
                price: 'Rs.40 per kg',
                quantity: '100 kg available',
                badge: '',
                image: 'https://picsum.photos/seed/vegetables/300/200',
                description: 'Fresh and quality vegetables directly from farm.',
                totalQuantity: '100 kg',
                minOrder: '5 kg',
                deliveryTime: '2-3 days',
                farmerDetails: {
                    fullName: 'abhinav ashok lawande',
                    mobile: '+918329966445',
                    village: 'pune',
                    district: 'pune'
                },
                farmerId: users[0]._id
            },
            {
                name: 'kanda',
                category: 'fruits',
                farmer: 'sitaa shetkari',
                village: 'nashik',
                price: 'Rs.60 per kg',
                quantity: '50 kg available',
                badge: '',
                image: 'https://picsum.photos/seed/onions/300/200',
                description: 'Sweet and quality onions.',
                totalQuantity: '50 kg',
                minOrder: '2 kg',
                deliveryTime: '1-2 days',
                farmerDetails: {
                    fullName: 'sitaa shetkari',
                    mobile: '+918329966446',
                    village: 'nashik',
                    district: 'nashik'
                },
                farmerId: users[1]._id
            },
            {
                name: 'gahu',
                category: 'grains',
                farmer: 'ganesh shetkari',
                village: 'ahmednagar',
                price: 'Rs.28 per kg',
                quantity: '200 kg available',
                badge: '',
                image: 'https://picsum.photos/seed/wheat/300/200',
                description: 'Quality wheat production.',
                totalQuantity: '200 kg',
                minOrder: '10 kg',
                deliveryTime: '3-5 days',
                farmerDetails: {
                    fullName: 'ganesh shetkari',
                    mobile: '+918329966447',
                    village: 'ahmednagar',
                    district: 'ahmednagar'
                },
                farmerId: users[2]._id
            }
        ];

        const createdProducts = await Product.insertMany(products);
        console.log('Created products:', createdProducts.length);

        console.log('\nSample products added successfully!');
        console.log('The website should now work properly.');
        
    } catch (error) {
        console.error('Error adding sample products:', error);
    } finally {
        await mongoose.disconnect();
    }
}

addSampleProducts();
