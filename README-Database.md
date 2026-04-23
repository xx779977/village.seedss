# Village Seeds Database Setup

## Overview
This project has been upgraded from JSON file storage to MongoDB database for better scalability and performance.

## Database Connection Setup

### 1. Install Dependencies
```bash
npm install mongoose dotenv
```

### 2. MongoDB Installation
Make sure you have MongoDB installed and running on your system:

**Windows:**
- Download MongoDB Community Server from https://www.mongodb.com/try/download/community
- Install with default settings
- Start MongoDB service

**Mac:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 3. Environment Configuration
The `.env` file contains database configuration:
```
MONGODB_URI=mongodb://localhost:27017/village_seeds
PORT=3000
NODE_ENV=development
```

### 4. Database Models

#### User Model
- Stores farmer and buyer information
- Fields: name, mobile, dob, village, userType, etc.
- Unique mobile number constraint

#### Product Model
- Stores agricultural product information
- Fields: name, category, farmer details, price, quantity, etc.
- Links to farmer via farmerId

#### Order Model
- Stores order information
- Fields: buyerId, farmerId, productId, quantity, status, etc.
- Automatic tracking ID generation

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with category filter)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product (soft delete)
- `GET /api/products/farmer/:farmerId` - Get products by farmer
- `GET /api/search/products` - Search products

### Orders
- `GET /api/orders` - Get all orders (with filters)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status

### Statistics
- `GET /api/stats/farmer/:userId` - Get farmer statistics
- `GET /api/stats/buyer/:userId` - Get buyer statistics

### Health
- `GET /api/health` - Health check endpoint

## Migration from JSON to MongoDB

### Data Migration Script
```javascript
// Run this once to migrate existing data
const fs = require('fs');
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function migrateData() {
    try {
        // Read existing JSON data
        const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
        
        // Migrate users
        for (const userData of data.users || []) {
            const user = new User(userData);
            await user.save();
        }
        
        // Migrate products
        for (const productData of data.products || []) {
            const product = new Product(productData);
            await product.save();
        }
        
        // Migrate orders
        for (const orderData of data.orders || []) {
            const order = new Order(orderData);
            await order.save();
        }
        
        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration error:', error);
    }
}
```

## Database Features

### Indexes
- Unique index on user mobile numbers
- Indexes on product categories and farmer details
- Indexes on order buyer/farmer IDs and status

### Security
- Password hashing (add bcrypt for production)
- Input validation
- Error handling
- Rate limiting (add express-rate-limit)

### Performance
- Database connection pooling
- Query optimization
- Pagination for large datasets

## Starting the Application

1. Make sure MongoDB is running
2. Install dependencies: `npm install`
3. Start the server: `npm start` or `npm run dev`

The server will connect to MongoDB and start on port 3000.

## Cloud Database Options

For production, consider using:
- MongoDB Atlas (free tier available)
- AWS DocumentDB
- Azure Cosmos DB

Update the MONGODB_URI in `.env` file to connect to cloud database.

## Backup and Recovery

### Local MongoDB Backup
```bash
mongodump --db village_seeds --out ./backup
```

### Restore Backup
```bash
mongorestore --db village_seeds ./backup/village_seeds
```

## Monitoring

Add monitoring tools like:
- MongoDB Compass for GUI management
- Application logging with Winston
- Performance monitoring with New Relic or DataDog
