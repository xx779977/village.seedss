// Sample product data
const products = [
    {
        id: 1,
        name: "भाज्या",
        category: "vegetables",
        farmer: "राम शेतकरी",
        village: "पुणे",
        price: "₹40 किलो",
        quantity: "100 किलो उपलब्ध",
        badge: "श्रेष्ठ",
        image: "https://picsum.photos/seed/vegetables/300/200"
    },
    {
        id: 2,
        name: "कांदा",
        category: "fruits",
        farmer: "सीता शेतकरी",
        village: "नाशिक",
        price: "₹60 किलो",
        quantity: "50 किलो उपलब्ध",
        badge: "ताजी",
        image: "https://picsum.photos/seed/fruits/300/200"
    },
    {
        id: 3,
        name: "गहू",
        category: "grains",
        farmer: "गणेश शेतकरी",
        village: "अहमदनगर",
        price: "₹30 किलो",
        quantity: "200 किलो उपलब्ध",
        badge: "श्रेष्ठ",
        image: "https://picsum.photos/seed/grains/300/200"
    },
    {
        id: 4,
        name: "मिरची",
        category: "spices",
        farmer: "लक्ष्मण शेतकरी",
        village: "सातारा",
        price: "₹150 किलो",
        quantity: "20 किलो उपलब्ध",
        badge: "ताजी",
        image: "https://picsum.photos/seed/spices/300/200"
    },
    {
        id: 5,
        name: "टोमॅटो",
        category: "vegetables",
        farmer: "शंकर शेतकरी",
        village: "सांगली",
        price: "₹35 किलो",
        quantity: "80 किलो उपलब्ध",
        badge: "ताजी",
        image: "https://picsum.photos/seed/tomato/300/200"
    },
    {
        id: 6,
        name: "सफरचंदा",
        category: "fruits",
        farmer: "राहुल शेतकरी",
        village: "नागपूर",
        price: "₹80 किलो",
        quantity: "40 किलो उपलब्ध",
        badge: "श्रेष्ठ",
        image: "https://picsum.photos/seed/orange/300/200"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts('all');
    setupCategoryFilters();
});

// Render products
function renderProducts(category = 'all') {
    const productsGrid = document.getElementById('products-grid');
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = generateProductCard(product);
        productsGrid.innerHTML += productCard;
    });
}

// Generate product card HTML
function generateProductCard(product) {
    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <span class="product-badge">${product.badge}</span>
                </div>
                <div class="product-details">
                    <h5 class="product-name">${product.name}</h5>
                    <p class="product-farmer">
                        <i class="fas fa-user"></i> ${product.farmer}, ${product.village}
                    </p>
                    <p class="product-price">${product.price}</p>
                    <p class="product-quantity">${product.quantity}</p>
                    <div class="product-actions">
                        <button class="btn btn-success" onclick="viewDetails(${product.id})">
                            <i class="fas fa-eye me-1"></i>तपशील
                        </button>
                        <button class="btn btn-outline-success" onclick="contactFarmer(${product.id})">
                            <i class="fas fa-phone me-1"></i>संपर्क
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Setup category filters
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.category-filters .btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Render products for selected category
            const category = this.getAttribute('data-category');
            renderProducts(category);
        });
    });
}

// User type selection
function selectUserType(type) {
    if (type === 'farmer') {
        alert('शेतकरी म्हणून नोंदणी करण्यासाठी येथे क्लिक करा');
        // Open registration modal for farmers
        const modal = new bootstrap.Modal(document.getElementById('registerModal'));
        modal.show();
    } else if (type === 'buyer') {
        alert('खरेदीदार म्हणून लॉगिन करण्यासाठी येथे क्लिक करा');
        // Open login modal for buyers
        const modal = new bootstrap.Modal(document.getElementById('loginModal'));
        modal.show();
    }
}

// View product details
function viewDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`उत्पादन: ${product.name}\nशेतकरी: ${product.farmer}\nगाव: ${product.village}\nकिंमत: ${product.price}\nउपलब्धता: ${product.quantity}`);
    }
}

// Contact farmer
function contactFarmer(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`${product.farmer} यांच्याशी संपर्क साधण्यासाठी:\n\nफोन: +91 98765 43210\nईमेल: farmer@krushisampark.in`);
    }
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});
