#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import json
import os
from datetime import datetime
import hashlib

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Database configuration
DB_NAME = 'village_seeds.db'

def init_database():
    """Initialize SQLite database with tables"""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            mobile TEXT UNIQUE NOT NULL,
            dob TEXT NOT NULL,
            village TEXT NOT NULL,
            user_type TEXT NOT NULL CHECK(user_type IN ('farmer', 'buyer')),
            is_active BOOLEAN DEFAULT 1,
            profile_image TEXT DEFAULT '',
            address TEXT DEFAULT '',
            district TEXT DEFAULT '',
            state TEXT DEFAULT 'महाराष्ट्र',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Products table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL CHECK(category IN ('vegetables', 'fruits', 'grains', 'spices', 'other')),
            farmer TEXT NOT NULL,
            village TEXT NOT NULL,
            price TEXT NOT NULL,
            quantity TEXT NOT NULL,
            badge TEXT DEFAULT '' CHECK(badge IN ('श्रेष्ठ', 'लोकप्रिय', 'नवीन', '')),
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
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (farmer_id) REFERENCES users (id)
        )
    ''')
    
    # Orders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
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
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
            payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed', 'refunded')),
            payment_method TEXT DEFAULT 'cod' CHECK(payment_method IN ('cod', 'online', 'upi')),
            notes TEXT DEFAULT '',
            buyer_contact TEXT NOT NULL,
            farmer_contact TEXT NOT NULL,
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expected_delivery_date DATE,
            actual_delivery_date DATE,
            tracking_id TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (buyer_id) REFERENCES users (id),
            FOREIGN KEY (farmer_id) REFERENCES users (id),
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')
    
    # Create indexes
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_products_farmer ON products(farmer_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_orders_farmer ON orders(farmer_id)')
    
    # Insert sample data if empty
    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] == 0:
        sample_data = [
            ('अभिनव अशोक लवांडे', '+918329966445', '1990-01-01', 'पुणे', 'farmer'),
            ('सीता शेतकरी', '+918329966446', '1985-05-15', 'नाशिक', 'farmer'),
            ('गणेश शेतकरी', '+918329966447', '1978-08-20', 'अहमदनगर', 'farmer'),
            ('राहुल खरेदीदार', '+918329966448', '1992-12-10', 'मुंबई', 'buyer')
        ]
        cursor.executemany('INSERT INTO users (name, mobile, dob, village, user_type) VALUES (?, ?, ?, ?, ?)', sample_data)
        
        # Sample products
        sample_products = [
            ('भाज्या', 'vegetables', 'अभिनव अशोक लवांडे', 'पुणे', '₹40 किलो', '100 किलो उपलब्ध', 'श्रेष्ठ', 
             'https://www.istockphoto.com/search/2/image-film?phrase=vegetables', 
             'ताज्या आणि गुणवत्तापूर्ण भाज्या थेट शेतातून', '100 किलो', '5 किलो', '2-3 दिवस',
             '{"fullName": "अभिनव अशोक लवांडे", "mobile": "+918329966445", "village": "पुणे", "district": "पुणे"}', 1),
            ('कांदा', 'fruits', 'सीता शेतकरी', 'नाशिक', '₹60 किलो', '50 किलो उपलब्ध', 'लोकप्रिय',
             'https://picsum.photos/seed/orange/300/200',
             'मीठ आणि गुणवत्तापूर्ण कांदे', '50 किलो', '2 किलो', '1-2 दिवस',
             '{"fullName": "सीता शेतकरी", "mobile": "+918329966446", "village": "नाशिक", "district": "नाशिक"}', 2)
        ]
        cursor.executemany('''
            INSERT INTO products (name, category, farmer, village, price, quantity, badge, image, description, 
                                total_quantity, min_order, delivery_time, farmer_details, farmer_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', sample_products)
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

# API Routes
@app.route('/')
def index():
    """Serve main page"""
    return send_from_directory('.', 'index.html')

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Village Seeds API is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/products', methods=['GET'])
def get_products():
    """Get all products"""
    conn = get_db_connection()
    category = request.args.get('category', 'all')
    
    query = 'SELECT * FROM products WHERE is_active = 1 AND is_available = 1'
    params = []
    
    if category != 'all':
        query += ' AND category = ?'
        params.append(category)
    
    query += ' ORDER BY created_at DESC'
    
    products = conn.execute(query, params).fetchall()
    conn.close()
    
    return jsonify({
        'success': True,
        'data': [dict(product) for product in products]
    })

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product"""
    conn = get_db_connection()
    
    # Get product
    product = conn.execute('SELECT * FROM products WHERE id = ? AND is_active = 1', (product_id,)).fetchone()
    
    if product:
        # Increment view count
        conn.execute('UPDATE products SET views = views + 1 WHERE id = ?', (product_id,))
        conn.commit()
        
        result = dict(product)
        conn.close()
        return jsonify({
            'success': True,
            'data': result
        })
    else:
        conn.close()
        return jsonify({
            'success': False,
            'error': 'Product not found'
        }), 404

@app.route('/api/products', methods=['POST'])
def create_product():
    """Create new product"""
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO products (name, category, farmer, village, price, quantity, badge, image, 
                                description, total_quantity, min_order, delivery_time, farmer_details, farmer_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['name'], data['category'], data['farmer'], data['village'], 
            data['price'], data['quantity'], data['badge'], data['image'], 
            data['description'], data['totalQuantity'], data['minOrder'], 
            data['deliveryTime'], json.dumps(data['farmerDetails']), data['farmerId']
        ))
        
        product_id = cursor.lastrowid
        conn.commit()
        
        # Return created product
        product = conn.execute('SELECT * FROM products WHERE id = ?', (product_id,)).fetchone()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': dict(product)
        }), 201
        
    except Exception as e:
        conn.close()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/users', methods=['POST'])
def register_user():
    """Register new user"""
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO users (name, mobile, dob, village, user_type) 
            VALUES (?, ?, ?, ?, ?)
        ''', (data['name'], data['mobile'], data['dob'], data['village'], data['userType']))
        
        user_id = cursor.lastrowid
        conn.commit()
        
        # Return user data
        user = conn.execute('SELECT id, name, mobile, village, user_type FROM users WHERE id = ?', (user_id,)).fetchone()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': dict(user)
        }), 201
        
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({
            'success': False,
            'error': 'Mobile number already exists'
        }), 400
    except Exception as e:
        conn.close()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/auth/login', methods=['POST'])
def login_user():
    """User login"""
    data = request.get_json()
    
    conn = get_db_connection()
    
    user = conn.execute('''
        SELECT id, name, mobile, village, user_type 
        FROM users 
        WHERE mobile = ? AND dob = ? AND is_active = 1
    ''', (data['mobile'], data['dob'])).fetchone()
    
    conn.close()
    
    if user:
        return jsonify({
            'success': True,
            'data': {
                'user': dict(user),
                'userType': user['user_type']
            }
        })
    else:
        return jsonify({
            'success': False,
            'error': 'Invalid credentials'
        }), 401

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Create new order"""
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Generate tracking ID
        tracking_id = f"VS{int(datetime.now().timestamp())}{hash(str(data)) % 10000:04d}"
        
        cursor.execute('''
            INSERT INTO orders (buyer_id, farmer_id, product_id, product_name, product_price, 
                               product_image, quantity, unit_price, total, delivery_address, 
                               delivery_time, status, payment_status, payment_method, notes, 
                               buyer_contact, farmer_contact, tracking_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['buyerId'], data['farmerId'], data['productId'], 
            data['product']['name'], data['product']['price'], data['product']['image'],
            data['quantity'], data['unitPrice'], data['total'], data['deliveryAddress'],
            data['deliveryTime'], data['status'], data['paymentStatus'], 
            data['paymentMethod'], data['notes'], data['buyerContact'], 
            data['farmerContact'], tracking_id
        ))
        
        order_id = cursor.lastrowid
        conn.commit()
        
        # Return created order
        order = conn.execute('SELECT * FROM orders WHERE id = ?', (order_id,)).fetchone()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': dict(order)
        }), 201
        
    except Exception as e:
        conn.close()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/orders', methods=['GET'])
def get_orders():
    """Get orders"""
    conn = get_db_connection()
    user_id = request.args.get('userId')
    status = request.args.get('status')
    
    query = 'SELECT * FROM orders WHERE 1=1'
    params = []
    
    if user_id:
        query += ' AND (buyer_id = ? OR farmer_id = ?)'
        params.extend([user_id, user_id])
    
    if status:
        query += ' AND status = ?'
        params.append(status)
    
    query += ' ORDER BY created_at DESC'
    
    orders = conn.execute(query, params).fetchall()
    conn.close()
    
    return jsonify({
        'success': True,
        'data': [dict(order) for order in orders]
    })

if __name__ == '__main__':
    # Initialize database
    init_database()
    
    # Start server
    print("Village Seeds API starting on http://localhost:5000")
    print("Database: SQLite (village_seeds.db)")
    app.run(host='0.0.0.0', port=5000, debug=True)
