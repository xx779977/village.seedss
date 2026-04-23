<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once 'config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path_parts = explode('/', trim($path, '/'));

// API Routing
switch (true) {
    // Get all products
    case $method == 'GET' && $path_parts[0] == 'api' && $path_parts[1] == 'products':
        if (isset($path_parts[2])) {
            // Get single product
            getProduct($conn, $path_parts[2]);
        } else {
            // Get all products
            getProducts($conn);
        }
        break;
        
    // Create product
    case $method == 'POST' && $path_parts[0] == 'api' && $path_parts[1] == 'products':
        createProduct($conn);
        break;
        
    // Update product
    case $method == 'PUT' && $path_parts[0] == 'api' && $path_parts[1] == 'products':
        updateProduct($conn, $path_parts[2]);
        break;
        
    // Delete product
    case $method == 'DELETE' && $path_parts[0] == 'api' && $path_parts[1] == 'products':
        deleteProduct($conn, $path_parts[2]);
        break;
        
    // User registration
    case $method == 'POST' && $path_parts[0] == 'api' && $path_parts[1] == 'users':
        registerUser($conn);
        break;
        
    // User login
    case $method == 'POST' && $path_parts[0] == 'api' && $path_parts[1] == 'auth' && $path_parts[2] == 'login':
        loginUser($conn);
        break;
        
    // Get orders
    case $method == 'GET' && $path_parts[0] == 'api' && $path_parts[1] == 'orders':
        getOrders($conn);
        break;
        
    // Create order
    case $method == 'POST' && $path_parts[0] == 'api' && $path_parts[1] == 'orders':
        createOrder($conn);
        break;
        
    // Health check
    case $method == 'GET' && $path_parts[0] == 'api' && $path_parts[1] == 'health':
        healthCheck();
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Endpoint not found']);
        break;
}

// Functions
function getProducts($conn) {
    $category = $_GET['category'] ?? 'all';
    $sql = "SELECT * FROM products WHERE is_active = 1 AND is_available = 1";
    
    if ($category !== 'all') {
        $sql .= " AND category = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $category);
    } else {
        $stmt = $conn->prepare($sql);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $products = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $products]);
}

function getProduct($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ? AND is_active = 1");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $product = $result->fetch_assoc();
    
    if ($product) {
        // Increment view count
        $update_stmt = $conn->prepare("UPDATE products SET views = views + 1 WHERE id = ?");
        $update_stmt->bind_param("i", $id);
        $update_stmt->execute();
        
        echo json_encode(['success' => true, 'data' => $product]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Product not found']);
    }
}

function createProduct($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $conn->prepare("INSERT INTO products (name, category, farmer, village, price, quantity, badge, image, description, total_quantity, min_order, delivery_time, farmer_details, farmer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $farmer_details_json = json_encode($data['farmerDetails']);
    
    $stmt->bind_param("ssssssssssssi", 
        $data['name'], 
        $data['category'], 
        $data['farmer'], 
        $data['village'], 
        $data['price'], 
        $data['quantity'], 
        $data['badge'], 
        $data['image'], 
        $data['description'], 
        $data['totalQuantity'], 
        $data['minOrder'], 
        $data['deliveryTime'], 
        $farmer_details_json, 
        $data['farmerId']
    );
    
    if ($stmt->execute()) {
        $data['id'] = $conn->insert_id;
        echo json_encode(['success' => true, 'data' => $data]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Failed to create product']);
    }
}

function registerUser($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $conn->prepare("INSERT INTO users (name, mobile, dob, village, user_type) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", 
        $data['name'], 
        $data['mobile'], 
        $data['dob'], 
        $data['village'], 
        $data['userType']
    );
    
    if ($stmt->execute()) {
        $response = [
            'id' => $conn->insert_id,
            'name' => $data['name'],
            'mobile' => $data['mobile'],
            'village' => $data['village'],
            'userType' => $data['userType']
        ];
        echo json_encode(['success' => true, 'data' => $response]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Mobile number already exists']);
    }
}

function loginUser($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE mobile = ? AND dob = ? AND is_active = 1");
    $stmt->bind_param("ss", $data['mobile'], $data['dob']);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if ($user) {
        $response = [
            'id' => $user['id'],
            'name' => $user['name'],
            'mobile' => $user['mobile'],
            'village' => $user['village'],
            'userType' => $user['user_type']
        ];
        echo json_encode(['success' => true, 'data' => ['user' => $response, 'userType' => $user['user_type']]]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
    }
}

function createOrder($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $tracking_id = 'VS' . time() . strtoupper(substr(md5(uniqid()), 0, 5));
    
    $stmt = $conn->prepare("INSERT INTO orders (buyer_id, farmer_id, product_id, product_name, product_price, product_image, quantity, unit_price, total, delivery_address, delivery_time, status, payment_status, payment_method, notes, buyer_contact, farmer_contact, tracking_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("iiissiidisssssssss", 
        $data['buyerId'], 
        $data['farmerId'], 
        $data['productId'], 
        $data['product']['name'], 
        $data['product']['price'], 
        $data['product']['image'], 
        $data['quantity'], 
        $data['unitPrice'], 
        $data['total'], 
        $data['deliveryAddress'], 
        $data['deliveryTime'], 
        $data['status'], 
        $data['paymentStatus'], 
        $data['paymentMethod'], 
        $data['notes'], 
        $data['buyerContact'], 
        $data['farmerContact'], 
        $tracking_id
    );
    
    if ($stmt->execute()) {
        $data['id'] = $conn->insert_id;
        $data['trackingId'] = $tracking_id;
        echo json_encode(['success' => true, 'data' => $data]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Failed to create order']);
    }
}

function getOrders($conn) {
    $user_id = $_GET['userId'] ?? null;
    $status = $_GET['status'] ?? null;
    
    $sql = "SELECT * FROM orders WHERE 1=1";
    $params = [];
    $types = "";
    
    if ($user_id) {
        $sql .= " AND (buyer_id = ? OR farmer_id = ?)";
        $params[] = $user_id;
        $params[] = $user_id;
        $types .= "ii";
    }
    
    if ($status) {
        $sql .= " AND status = ?";
        $params[] = $status;
        $types .= "s";
    }
    
    $sql .= " ORDER BY created_at DESC";
    
    if (!empty($params)) {
        $stmt = $conn->prepare($sql);
        $stmt->bind_param($types, ...$params);
    } else {
        $stmt = $conn->prepare($sql);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    $orders = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $orders]);
}

function healthCheck() {
    echo json_encode([
        'success' => true, 
        'message' => 'Village Seeds API is running',
        'timestamp' => date('c')
    ]);
}
?>
