-- Village Seeds Database Setup for MySQL
-- Run this script in MySQL to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS village_seeds CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE village_seeds;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL UNIQUE,
    dob DATE NOT NULL,
    village VARCHAR(255) NOT NULL,
    user_type ENUM('farmer', 'buyer') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    profile_image TEXT DEFAULT '',
    address TEXT DEFAULT '',
    district VARCHAR(255) DEFAULT '',
    state VARCHAR(255) DEFAULT 'महाराष्ट्र',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category ENUM('vegetables', 'fruits', 'grains', 'spices', 'other') NOT NULL,
    farmer VARCHAR(255) NOT NULL,
    village VARCHAR(255) NOT NULL,
    price VARCHAR(100) NOT NULL,
    quantity VARCHAR(100) NOT NULL,
    badge ENUM('श्रेष्ठ', 'लोकप्रिय', 'नवीन', '') DEFAULT '',
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    total_quantity VARCHAR(100) NOT NULL,
    min_order VARCHAR(100) NOT NULL,
    delivery_time VARCHAR(100) NOT NULL,
    farmer_details JSON,
    farmer_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    farmer_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price VARCHAR(100) NOT NULL,
    product_image TEXT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_time VARCHAR(100) NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method ENUM('cod', 'online', 'upi') DEFAULT 'cod',
    notes TEXT DEFAULT '',
    buyer_contact VARCHAR(20) NOT NULL,
    farmer_contact VARCHAR(20) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    tracking_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_farmer ON products(farmer_id);
CREATE INDEX idx_products_active ON products(is_active, is_available);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_farmer ON orders(farmer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_tracking ON orders(tracking_id);

-- Insert sample data
INSERT INTO users (name, mobile, dob, village, user_type) VALUES
('अभिनव अशोक लवांडे', '+918329966445', '1990-01-01', 'पुणे', 'farmer'),
('सीता शेतकरी', '+918329966446', '1985-05-15', 'नाशिक', 'farmer'),
('गणेश शेतकरी', '+918329966447', '1978-08-20', 'अहमदनगर', 'farmer'),
('राहुल खरेदीदार', '+918329966448', '1992-12-10', 'मुंबई', 'buyer');

INSERT INTO products (name, category, farmer, village, price, quantity, badge, image, description, total_quantity, min_order, delivery_time, farmer_details, farmer_id) VALUES
('भाज्या', 'vegetables', 'अभिनव अशोक लवांडे', 'पुणे', '₹40 किलो', '100 किलो उपलब्ध', 'श्रेष्ठ', 'https://www.istockphoto.com/search/2/image-film?phrase=vegetables', 'ताज्या आणि गुणवत्तापूर्ण भाज्या थेट शेतातून. कोणतेही हानिक पदार्थ वापरलेले नाहीत, संपूर्ण नैसर्गिक शेती.', '100 किलो', '5 किलो', '2-3 दिवस', '{"fullName": "अभिनव अशोक लवांडे", "mobile": "+918329966445", "village": "पुणे", "district": "पुणे"}', 1),
('कांदा', 'fruits', 'सीता शेतकरी', 'नाशिक', '₹60 किलो', '50 किलो उपलब्ध', 'लोकप्रिय', 'https://picsum.photos/seed/orange/300/200', 'मीठ आणि गुणवत्तापूर्ण कांदे. गोड आणि आणि पिवळ आहे.', '50 किलो', '2 किलो', '1-2 दिवस', '{"fullName": "सीता शेतकरी", "mobile": "+918329966446", "village": "नाशिक", "district": "नाशिक"}', 2),
('गहू', 'grains', 'गणेश शेतकरी', 'अहमदनगर', '₹28 किलो', '200 किलो उपलब्ध', 'लोकप्रिय', 'https://picsum.photos/seed/wheat/300/200', 'गुणवत्तेचे उत्पादन. भारत महाराष्ट्रात गहू.', '200 किलो', '10 किलो', '3-5 दिवस', '{"fullName": "गणेश शेतकरी", "mobile": "+918329966447", "village": "अहमदनगर", "district": "अहमदनगर"}', 3);
