# Village Seeds Python/SQLite Setup Guide

## Overview
This setup allows you to run Village Seeds platform using Python and SQLite without any external database installation.

## Requirements

### Python Installation
Python usually comes pre-installed on most systems. Check if you have Python:

```bash
python --version
# or
python3 --version
```

If not installed, download from: https://www.python.org/downloads/

## Setup Instructions

### Step 1: Install Python Dependencies
Open command prompt/terminal and run:

```bash
cd "c:\Users\abhi\OneDrive\Desktop\REAL ESTATE"
pip install -r requirements.txt
```

Or install manually:
```bash
pip install Flask Flask-CORS
```

### Step 2: Run the Application
```bash
python app.py
```

### Step 3: Access the Application
Open your browser and go to:
```
http://localhost:5000
```

## Database

### Automatic Setup
The application automatically creates a SQLite database file (`village_seeds.db`) with:
- Users table
- Products table  
- Orders table
- Sample data

### Database Location
- File: `village_seeds.db` (in your project folder)
- No external database server required
- Portable - can be copied to any system

## API Endpoints

### Products
- `GET http://localhost:5000/api/products` - Get all products
- `GET http://localhost:5000/api/products/{id}` - Get single product
- `POST http://localhost:5000/api/products` - Create product

### Users
- `POST http://localhost:5000/api/users` - Register user
- `POST http://localhost:5000/api/auth/login` - User login

### Orders
- `GET http://localhost:5000/api/orders` - Get orders
- `POST http://localhost:5000/api/orders` - Create order

### Health Check
- `GET http://localhost:5000/api/health` - API health status

## Frontend Integration

Update your frontend JavaScript to use Python API:

```javascript
// Update API base URL
const API_BASE = 'http://localhost:5000/api';

// Example API calls
async function getProducts() {
    const response = await fetch(`${API_BASE}/products`);
    return response.json();
}

async function loginUser(mobile, dob) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, dob })
    });
    return response.json();
}
```

## File Structure
```
village-seeds/
├── app.py                  # Python Flask application
├── requirements.txt         # Python dependencies
├── village_seeds.db       # SQLite database (auto-created)
├── index.html             # Main frontend file
├── styles.css             # CSS styles
├── script.js             # Frontend JavaScript
└── README-Python-Setup.md # This file
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    mobile TEXT UNIQUE NOT NULL,
    dob TEXT NOT NULL,
    village TEXT NOT NULL,
    user_type TEXT CHECK(user_type IN ('farmer', 'buyer')),
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT CHECK(category IN ('vegetables', 'fruits', 'grains', 'spices', 'other')),
    farmer TEXT NOT NULL,
    village TEXT NOT NULL,
    price TEXT NOT NULL,
    quantity TEXT NOT NULL,
    badge TEXT DEFAULT '',
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    total_quantity TEXT NOT NULL,
    min_order TEXT NOT NULL,
    delivery_time TEXT NOT NULL,
    farmer_details TEXT,
    farmer_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    is_available BOOLEAN DEFAULT 1,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users (id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    buyer_id INTEGER NOT NULL,
    farmer_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    product_price TEXT NOT NULL,
    product_image TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    total REAL NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_time TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'cod',
    notes TEXT DEFAULT '',
    buyer_contact TEXT NOT NULL,
    farmer_contact TEXT NOT NULL,
    tracking_id TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users (id),
    FOREIGN KEY (farmer_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);
```

## Benefits of Python/SQLite Setup

### Advantages
- **No Database Installation**: SQLite is built into Python
- **Portable**: Single database file
- **Fast**: In-process database, no network overhead
- **Reliable**: ACID compliant
- **Simple**: Easy to backup and migrate
- **Free**: No licensing costs

### Performance
- Handles thousands of records efficiently
- Low memory usage
- Fast read operations
- Concurrent access support

## Troubleshooting

### Common Issues

1. **Python not found**: Install Python from python.org
2. **Port already in use**: Change port in app.py (line 247)
3. **Permission errors**: Run as administrator
4. **Module not found**: Install with `pip install Flask Flask-CORS`

### Testing the Setup
1. Run `python app.py`
2. Open browser to `http://localhost:5000/api/health`
3. Should see: `{"success": true, "message": "Village Seeds API is running"}`

### Database Management
You can view the SQLite database using:
- **DB Browser for SQLite** (free GUI tool)
- **sqlite3 command line** (built into Python)
- **VS Code SQLite extension**

## Production Deployment

For production deployment:

### Options
1. **PythonAnywhere**: Easy Python hosting
2. **Heroku**: Free tier available
3. **DigitalOcean**: Affordable cloud hosting
4. **Self-hosted**: VPS with Python

### Production Considerations
- Use PostgreSQL instead of SQLite for large scale
- Implement proper authentication
- Add rate limiting
- Set up SSL certificates
- Regular backups

## Sample Data

The application automatically creates sample data:
- 4 users (3 farmers, 1 buyer)
- 2 sample products
- Ready to test immediately

## API Examples

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Register User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","mobile":"+911234567890","dob":"1990-01-01","village":"Test Village","userType":"farmer"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"mobile":"+918329966445","dob":"1990-01-01"}'
```

This setup provides a complete, working Village Seeds platform without requiring Node.js or external database installation!
