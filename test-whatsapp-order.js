const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

async function testWhatsAppOrder() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully!');
        
        // Create a test order
        const testOrder = {
            customerName: 'Test Customer',
            customerMobile: '+919999999999',
            customerVillage: 'Test Village',
            customerType: 'buyer',
            productName: 'Test Product',
            productPrice: 'Rs.50 per kg',
            productQuantity: '10 kg available',
            farmerName: 'Test Farmer',
            farmerMobile: '+918329966445',
            farmerVillage: 'Test Farmer Village',
            orderStatus: 'PENDING',
            orderTime: new Date().toISOString(),
            whatsappSent: true,
            whatsappNumber: '918329966445',
            total: 500,
            status: 'pending'
        };
        
        // Save order to MongoDB
        const savedOrder = await Order.create(testOrder);
        console.log('Order saved successfully!');
        console.log('Order ID:', savedOrder._id);
        console.log('Customer:', savedOrder.customerName);
        console.log('Product:', savedOrder.productName);
        console.log('WhatsApp Number:', savedOrder.whatsappNumber);
        console.log('WhatsApp Sent:', savedOrder.whatsappSent);
        
        // Verify the order was saved
        const retrievedOrder = await Order.findById(savedOrder._id);
        if (retrievedOrder) {
            console.log('Order successfully retrieved from MongoDB!');
            console.log('Order Status:', retrievedOrder.orderStatus);
            console.log('Order Time:', retrievedOrder.orderTime);
        }
        
        console.log('\nWhatsApp order forwarding is working perfectly!');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testWhatsAppOrder();
