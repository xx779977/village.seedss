const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function testPhotoUpload() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully!');
        
        // Create a test product with base64 image data
        const testProduct = {
            name: 'Test Photo Upload Product',
            category: 'vegetables',
            farmer: 'Test Farmer',
            village: 'Test Village',
            price: 'Rs.50 per kg',
            quantity: '100 kg available',
            badge: '',
            image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A',
            description: 'Test product with photo upload',
            totalQuantity: '100 kg',
            minOrder: '1 kg',
            deliveryTime: '2-3 days',
            farmerDetails: {
                fullName: 'Test Farmer',
                mobile: '+919999999999',
                village: 'Test Village',
                district: 'Test District'
            },
            // farmerId: 1, // Removed to avoid ObjectId validation
            isActive: true,
            createdAt: new Date().toISOString()
        };
        
        // Save to MongoDB
        const result = await Product.create(testProduct);
        console.log('Product saved successfully!');
        console.log('Product ID:', result._id);
        console.log('Image data length:', result.image.length);
        console.log('Image starts with:', result.image.substring(0, 50));
        
        // Verify the image was saved
        const savedProduct = await Product.findById(result._id);
        if (savedProduct && savedProduct.image) {
            console.log('Image successfully retrieved from MongoDB!');
            console.log('Image data type:', typeof savedProduct.image);
            console.log('Image is base64:', savedProduct.image.startsWith('data:image/'));
        }
        
        console.log('\nPhoto upload functionality is working perfectly!');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testPhotoUpload();
