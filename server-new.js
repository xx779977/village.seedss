const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Import database connection
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Helper function to handle errors
const handleError = (res, error, statusCode = 500) => {
    console.error(error);
    res.status(statusCode).json({ 
        success: false, 
        error: error.message || 'Internal server error' 
    });
};

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;
        let query = { isActive: true, isAvailable: true };
        
        if (category && category !== 'all') {
            query.category = category;
        }
        
        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: products });
    } catch (error) {
        handleError(res, error);
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        
        // Increment view count
        await product.incrementViews();
        
        res.json({ success: true, data: product });
    } catch (error) {
        handleError(res, error);
    }
});

// Add new product
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        handleError(res, error, 400);
    }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        
        res.json({ success: true, data: product });
    } catch (error) {
        handleError(res, error, 400);
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            { isActive: false }, 
            { new: true }
        );
        
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        handleError(res, error);
    }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const { userId, status } = req.query;
        let query = {};
        
        if (userId) {
            query.$or = [{ buyerId: userId }, { farmerId: userId }];
        }
        
        if (status) {
            query.status = status;
        }
        
        const orders = await Order.find(query)
            .populate('buyerId', 'name mobile village')
            .populate('farmerId', 'name mobile village')
            .populate('productId', 'name image')
            .sort({ createdAt: -1 });
            
        res.json({ success: true, data: orders });
    } catch (error) {
        handleError(res, error);
    }
});

// Create new order
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        
        // Calculate expected delivery date
        newOrder.calculateExpectedDelivery();
        
        await newOrder.save();
        
        // Populate order details
        await newOrder.populate('buyerId', 'name mobile village');
        await newOrder.populate('farmerId', 'name mobile village');
        await newOrder.populate('productId', 'name image');
        
        res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        handleError(res, error, 400);
    }
});

// Update order status
app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        
        await order.updateStatus(status);
        
        res.json({ success: true, data: order });
    } catch (error) {
        handleError(res, error, 400);
    }
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const { userType } = req.query;
        let query = {};
        
        if (userType) {
            query.userType = userType;
        }
        
        const users = await User.find(query).select('-__v');
        res.json({ success: true, data: users });
    } catch (error) {
        handleError(res, error);
    }
});

// Register new user
app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        
        res.status(201).json({ success: true, data: newUser.publicProfile });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Mobile number already exists' });
        }
        handleError(res, error, 400);
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { mobile, dob } = req.body;
        
        const user = await User.findOne({ mobile, dob, isActive: true });
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }
        
        res.json({ 
            success: true, 
            data: {
                user: user.publicProfile,
                userType: user.userType
            }
        });
    } catch (error) {
        handleError(res, error);
    }
});

// Get farmer statistics
app.get('/api/stats/farmer/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const farmerProducts = await Product.find({ farmerId: userId, isActive: true });
        const farmerOrders = await Order.find({ farmerId: userId });
        
        const stats = {
            totalProducts: farmerProducts.length,
            totalOrders: farmerOrders.length,
            completedOrders: farmerOrders.filter(o => o.status === 'delivered').length,
            pendingOrders: farmerOrders.filter(o => o.status === 'pending').length,
            totalRevenue: farmerOrders
                .filter(o => o.status === 'delivered')
                .reduce((sum, o) => sum + (o.total || 0), 0),
            totalViews: farmerProducts.reduce((sum, p) => sum + (p.views || 0), 0)
        };
        
        res.json({ success: true, data: stats });
    } catch (error) {
        handleError(res, error);
    }
});

// Get buyer statistics
app.get('/api/stats/buyer/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const buyerOrders = await Order.find({ buyerId: userId });
        
        const stats = {
            totalOrders: buyerOrders.length,
            completedOrders: buyerOrders.filter(o => o.status === 'delivered').length,
            pendingOrders: buyerOrders.filter(o => o.status === 'pending').length,
            totalSpent: buyerOrders
                .filter(o => o.status === 'delivered')
                .reduce((sum, o) => sum + (o.total || 0), 0)
        };
        
        res.json({ success: true, data: stats });
    } catch (error) {
        handleError(res, error);
    }
});

// Get products by farmer
app.get('/api/products/farmer/:farmerId', async (req, res) => {
    try {
        const products = await Product.find({ 
            farmerId: req.params.farmerId, 
            isActive: true 
        }).sort({ createdAt: -1 });
        
        res.json({ success: true, data: products });
    } catch (error) {
        handleError(res, error);
    }
});

// Search products
app.get('/api/search/products', async (req, res) => {
    try {
        const { q, category } = req.query;
        let query = { isActive: true, isAvailable: true };
        
        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { village: { $regex: q, $options: 'i' } }
            ];
        }
        
        if (category && category !== 'all') {
            query.category = category;
        }
        
        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: products });
    } catch (error) {
        handleError(res, error);
    }
});

// Orders API endpoints
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        
        // Create new order
        const newOrder = new Order({
            customerName: orderData.customerName,
            customerMobile: orderData.customerMobile,
            customerVillage: orderData.customerVillage,
            customerType: orderData.customerType,
            productName: orderData.productName,
            productPrice: orderData.productPrice,
            productQuantity: orderData.productQuantity,
            farmerName: orderData.farmerName,
            farmerMobile: orderData.farmerMobile,
            farmerVillage: orderData.farmerVillage,
            orderStatus: orderData.orderStatus || 'PENDING',
            orderTime: orderData.orderTime || new Date().toISOString(),
            whatsappSent: orderData.whatsappSent || false,
            whatsappNumber: orderData.whatsappNumber,
            total: 0, // Will be calculated based on product price
            status: 'pending'
        });
        
        // Save order to database
        const savedOrder = await newOrder.save();
        
        console.log('Order saved to MongoDB:', savedOrder);
        console.log('WhatsApp notification sent to:', orderData.whatsappNumber);
        
        res.status(201).json({ 
            success: true, 
            data: savedOrder,
            message: 'Order placed successfully and WhatsApp notification sent'
        });
    } catch (error) {
        console.error('Order creation error:', error);
        handleError(res, error);
    }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        handleError(res, error);
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Village Seeds API is running',
        timestamp: new Date().toISOString()
    });
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve add-product.html
app.get('/add-product.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'add-product.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    handleError(res, err);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Village Seeds API server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
