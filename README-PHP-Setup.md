# Village Seeds PHP/MySQL Setup Guide

## Overview
This setup allows you to run the Village Seeds platform using PHP and MySQL instead of Node.js.

## Requirements

### 1. Install XAMPP (Recommended)
XAMPP includes Apache, MySQL, and PHP in one package.

**Download XAMPP**: https://www.apachefriends.org/download.html

### 2. Alternative: Install Components Separately
- **Apache**: https://httpd.apache.org/download.cgi
- **PHP**: https://www.php.net/downloads.php
- **MySQL**: https://dev.mysql.com/downloads/mysql/

## Setup Instructions

### Step 1: Install XAMPP
1. Download and install XAMPP
2. Run XAMPP Control Panel
3. Start Apache and MySQL services

### Step 2: Setup Database
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Click "Import" tab
3. Select `setup_database.sql` file
4. Click "Go" to import

### Step 3: Place Files in Web Directory
1. Copy all project files to: `C:\xampp\htdocs\village-seeds\`
2. Or move files to your web server's document root

### Step 4: Configure Database Connection
Edit `config.php` if needed:
```php
$host = 'localhost';
$username = 'root';  // Default XAMPP username
$password = '';      // Default XAMPP password (empty)
$database = 'village_seeds';
```

### Step 5: Test the Application
Open your browser and go to:
```
http://localhost/village-seeds/
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Users
- `POST /api/users` - Register user
- `POST /api/auth/login` - User login

### Orders
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order

### Health Check
- `GET /api/health` - API health status

## Frontend Integration

Update your frontend JavaScript to use the PHP API:

```javascript
// Example API calls
const API_BASE = 'http://localhost/village-seeds/api.php';

// Get products
async function getProducts() {
    const response = await fetch(`${API_BASE}/products`);
    return response.json();
}

// Login user
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
├── index.html              # Main frontend file
├── api.php                 # PHP API endpoints
├── config.php              # Database configuration
├── setup_database.sql      # Database setup script
├── styles.css              # CSS styles
├── script.js              # Frontend JavaScript
└── README-PHP-Setup.md    # This file
```

## Database Tables

### Users Table
- Stores farmer and buyer information
- Unique mobile numbers
- User type (farmer/buyer)

### Products Table
- Agricultural product listings
- Links to farmers
- Categories and pricing

### Orders Table
- Order management
- Tracking information
- Status updates

## Security Notes

1. **Change Default Password**: Update MySQL root password
2. **Input Validation**: API includes basic validation
3. **CORS**: Enabled for development
4. **SQL Injection**: Uses prepared statements

## Troubleshooting

### Common Issues

1. **404 Errors**: Check file paths in web directory
2. **Database Connection**: Verify MySQL is running
3. **Permissions**: Ensure web server can read files
4. **PHP Errors**: Check XAMPP error logs

### Testing Database Connection
Create a test file `test.php`:
```php
<?php
require_once 'config.php';
echo "Database connected successfully!";
?>
```

## Production Deployment

For production deployment:
1. Use proper web hosting with PHP/MySQL
2. Set up SSL certificate
3. Configure proper database credentials
4. Implement additional security measures
5. Set up regular backups

## Benefits of PHP/MySQL Setup

- **No Node.js Required**: Uses standard web stack
- **Easy Deployment**: Most hosting supports PHP/MySQL
- **Cost Effective**: Many affordable hosting options
- **Reliable**: Mature, stable technology
- **Good Performance**: Fast for database operations
