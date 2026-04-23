const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data storage
const dataFile = path.join(__dirname, 'data.json');
let products = [];
let orders = [];
let users = [];

// Initialize data
function initializeData() {
    try {
        if (fs.existsSync(dataFile)) {
            const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
            products = data.products || [];
            orders = data.orders || [];
            users = data.users || [];
        } else {
            // Initial data
            products = [
                {
                    id: 1,
                    name: "भाज्या",
                    category: "vegetables",
                    farmer: "राम शेतकरी",
                    village: "पुणे",
                    price: "₹40 किलो",
                    quantity: "100 किलो उपलब्ध",
                    badge: "श्रेष्ठ",
                    image: "https://www.istockphoto.com/search/2/image-film?phrase=vegetables&tracked_gsrp_landing=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fvegetables",
                    description: "ताज्या आणि गुणवत्तापूर्ण भाज्या थेट शेतातून. कोणतेही हानिक पदार्थ वापरलेले नाहीत, संपूर्ण नैसर्गिक शेती.",
                    totalQuantity: "100 किलो",
                    minOrder: "5 किलो",
                    deliveryTime: "2-3 दिवस",
                    farmerDetails: {
                        fullName: "abhinav ashok lawande",
                        mobile: "+918329966445",
                        village: "पुणे",
                        district: "पुणे"
                    }
                },
                {
                    id: 2,
                    name: "कांदा",
                    category: "fruits",
                    farmer: "सीता शेतकरी",
                    village: "नाशिक",
                    price: "₹60 किलो",
                    quantity: "50 किलो उपलब्ध",
                    badge: "लोकप्रिय",
                    image: "https://picsum.photos/seed/orange/300/200",
                    description: "मीठ आणि गुणवत्तापूर्ण कांदे. गोड आणि आणि पिवळ आहे.",
                    totalQuantity: "50 किलो",
                    minOrder: "2 किलो",
                    deliveryTime: "1-2 दिवस",
                    farmerDetails: {
                        fullName: "सीता शेतकरी",
                        mobile: "+918329966445",
                        village: "नाशिक",
                        district: "नाशिक"
                    }
                },
                {
                    id: 3,
                    name: "गहू",
                    category: "grains",
                    farmer: "गणेश शेतकरी",
                    village: "अहमदनगर",
                    price: "₹28 किलो",
                    quantity: "200 किलो उपलब्ध",
                    badge: "लोकप्रिय",
                    image: "https://picsum.photos/seed/wheat/300/200",
                    description: "गुणवत्तेचे उत्पादन. भारत महाराष्ट्रात गहू.",
                    totalQuantity: "200 किलो",
                    minOrder: "10 किलो",
                    deliveryTime: "3-5 दिवस",
                    farmerDetails: {
                        fullName: "गणेश शेतकरी",
                        mobile: "+918329966445",
                        village: "अहमदनगर",
                        district: "अहमदनगर"
                    }
                },
                {
                    id: 4,
                    name: "मिरची",
                    category: "vegetables",
                    farmer: "बाबूराव शेतकरी",
                    village: "कराड",
                    price: "₹35 किलो",
                    quantity: "80 किलो उपलब्ध",
                    badge: "लोकप्रिय",
                    image: "https://picsum.photos/seed/chili/300/200",
                    description: "तीखर आणि मसालेचे उत्पादन.",
                    totalQuantity: "80 किलो",
                    minOrder: "1 किलो",
                    deliveryTime: "1-2 दिवस",
                    farmerDetails: {
                        fullName: "बाबूराव शेतकरी",
                        mobile: "+918329966445",
                        village: "कराड",
                        district: "कराड"
                    }
                },
                {
                    id: 5,
                    name: "टोमॅटो",
                    category: "fruits",
                    farmer: "राहुल शेतकरी",
                    village: "नागपूर",
                    price: "₹80 किलो",
                    quantity: "40 किलो उपलब्ध",
                    badge: "श्रेष्ठ",
                    image: "https://picsum.photos/seed/tomato/300/200",
                    description: "टोमॅटो आणि गुणवत्तापूर्ण टोमॅटो.",
                    totalQuantity: "40 किलो",
                    minOrder: "2 किलो",
                    deliveryTime: "2-3 दिवस",
                    farmerDetails: {
                        fullName: "राहुल शेतकरी",
                        mobile: "+918329966445",
                        village: "नागपूर",
                        district: "नागपूर"
                    }
                },
                {
                    id: 6,
                    name: "सफरचंदा",
                    category: "spices",
                    farmer: "राहुल शेतकरी",
                    village: "नागपूर",
                    price: "₹120 किलो",
                    quantity: "20 किलो उपलब्ध",
                    badge: "श्रेष्ठ",
                    image: "https://picsum.photos/seed/turmeric/300/200",
                    description: "शुद्ध पिके आणि गुणवत्तापूर्ण सफरचंदा.",
                    totalQuantity: "20 किलो",
                    minOrder: "500 ग्रॅम",
                    deliveryTime: "3-5 दिवस",
                    farmerDetails: {
                        fullName: "राहुल शेतकरी",
                        mobile: "+918329966445",
                        village: "नागपूर",
                        district: "नागपूर"
                    }
                }
            ];
            
            saveData();
        }
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

// Save data to file
function saveData() {
    try {
        const data = {
            products: products,
            orders: orders,
            users: users
        };
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Add new product
app.post('/api/products', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    saveData();
    res.status(201).json(newProduct);
});

// Update product
app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body, updatedAt: new Date().toISOString() };
        saveData();
        res.json(products[index]);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
        products.splice(index, 1);
        saveData();
        res.json({ message: 'Product deleted successfully' });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// Get all orders
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// Create new order
app.post('/api/orders', (req, res) => {
    const newOrder = {
        id: orders.length + 1,
        ...req.body,
        createdAt: new Date().toISOString(),
        status: 'pending'
    };
    
    orders.push(newOrder);
    saveData();
    res.status(201).json(newOrder);
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const index = orders.findIndex(o => o.id === id);
    
    if (index !== -1) {
        orders[index].status = status;
        orders[index].updatedAt = new Date().toISOString();
        saveData();
        res.json(orders[index]);
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

// Get all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Register new user
app.post('/api/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveData();
    res.status(201).json(newUser);
});

// User login
app.post('/api/auth/login', (req, res) => {
    const { mobile, dob } = req.body;
    const user = users.find(u => u.mobile === mobile && u.dob === dob);
    
    if (user) {
        res.json({ 
            success: true, 
            user: { ...user, password: undefined } // Don't send password
        });
    } else {
        res.status(401).json({ 
            success: false, 
            error: 'Invalid credentials' 
        });
    }
});

// Get farmer statistics
app.get('/api/stats/farmer/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const farmerProducts = products.filter(p => p.farmerDetails && p.farmerDetails.mobile === users.find(u => u.id === userId)?.mobile);
    const farmerOrders = orders.filter(o => o.farmerId === userId);
    
    const stats = {
        totalProducts: farmerProducts.length,
        totalOrders: farmerOrders.length,
        completedOrders: farmerOrders.filter(o => o.status === 'completed').length,
        pendingOrders: farmerOrders.filter(o => o.status === 'pending').length,
        totalRevenue: farmerOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total || 0), 0)
    };
    
    res.json(stats);
});

// Get buyer statistics
app.get('/api/stats/buyer/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const buyerOrders = orders.filter(o => o.buyerId === userId);
    
    const stats = {
        totalOrders: buyerOrders.length,
        completedOrders: buyerOrders.filter(o => o.status === 'completed').length,
        pendingOrders: buyerOrders.filter(o => o.status === 'pending').length,
        totalSpent: buyerOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total || 0), 0)
    };
    
    res.json(stats);
});

// Start server
app.listen(PORT, () => {
    console.log(`Village Seeds API server running on port ${PORT}`);
    initializeData();
});

module.exports = app;
