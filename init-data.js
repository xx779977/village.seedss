const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

async function initializeData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

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

        // Create sample products
        const products = [
            {
                name: 'bhajya',
                category: 'vegetables',
                farmer: 'abhinav ashok lawande',
                village: 'pune',
                price: 'Rs.40 per kg',
                quantity: '100 kg available',
                badge: 'shreshth',
                image: 'https://www.istockphoto.com/search/2/image-film?phrase=vegetables',
                description: 'Fresh and quality vegetables directly from farm. No harmful chemicals used, completely natural farming.',
                totalQuantity: '100 kg',
                minOrder: '5 kg',
                deliveryTime: '2-3 days',
                farmerDetails: {
                    fullName: 'abhinav ashok lawande',
                    mobile: '+918329966445',
                    village: 'pune',
                    district: 'pune'
                },
                farmerId: createdUsers[0]._id
            },
            {
                name: 'kanda',
                category: 'fruits',
                farmer: 'sitaa shetkari',
                village: 'nashik',
                price: 'Rs.60 per kg',
                quantity: '50 kg available',
                badge: 'lokpriya',
                image: 'https://picsum.photos/seed/orange/300/200',
                description: 'Sweet and quality onions. Sweet and yellow.',
                totalQuantity: '50 kg',
                minOrder: '2 kg',
                deliveryTime: '1-2 days',
                farmerDetails: {
                    fullName: 'sitaa shetkari',
                    mobile: '+918329966446',
                    village: 'nashik',
                    district: 'nashik'
                },
                farmerId: createdUsers[1]._id
            },
            {
                name: 'gahu',
                category: 'grains',
                farmer: 'ganesh shetkari',
                village: 'ahmednagar',
                price: 'Rs.28 per kg',
                quantity: '200 kg available',
                badge: 'lokpriya',
                image: 'https://picsum.photos/seed/wheat/300/200',
                description: 'Quality production. Wheat in India Maharashtra.',
                totalQuantity: '200 kg',
                minOrder: '10 kg',
                deliveryTime: '3-5 days',
                farmerDetails: {
                    fullName: 'ganesh shetkari',
                    mobile: '+918329966447',
                    village: 'ahmednagar',
                    district: 'ahmednagar'
                },
                farmerId: createdUsers[2]._id
            }
        ];

        const createdProducts = await Product.insertMany(products);
        console.log('Created products:', createdProducts.length);

        console.log('\n=== Login Credentials ===');
        console.log('Farmers:');
        console.log('1. Mobile: +918329966445, DOB: 1990-01-01');
        console.log('2. Mobile: +918329966446, DOB: 1985-05-15');
        console.log('3. Mobile: +918329966447, DOB: 1978-08-20');
        console.log('\nBuyer:');
        console.log('1. Mobile: +918329966448, DOB: 1992-12-10');

        console.log('\nData initialization completed successfully!');
        
    } catch (error) {
        console.error('Error initializing data:', error);
    } finally {
        await mongoose.disconnect();
    }
}

initializeData();
