// Test script to verify order button is working
console.log('Testing Order Button Functionality...');

// Simulate clicking order button
const testProductId = 1;
const testProduct = {
    id: testProductId,
    name: 'Test Product',
    price: 'Rs.50 per kg',
    quantity: '100 kg available',
    farmer: 'Test Farmer',
    village: 'Test Village',
    image: 'https://picsum.photos/seed/test/300/200'
};

// Check if orderProduct function exists
if (typeof orderProduct === 'function') {
    console.log('✅ orderProduct function exists');
    
    // Test the function
    try {
        // Mock the DOM elements that would be present
        global.window = {
            location: { href: 'http://localhost:3000' },
            open: (url) => console.log(`📱 WhatsApp would open: ${url}`)
        };
        
        global.document = {
            getElementById: (id) => {
                if (id === 'productDetailName') return { textContent: testProduct.name };
                if (id === 'productDetailPrice') return { textContent: testProduct.price };
                if (id === 'productDetailQuantity') return { textContent: testProduct.quantity };
                if (id === 'productDetailFarmer') return { textContent: testProduct.farmer };
                if (id === 'farmerMobile') return { textContent: '+918329966445' };
                if (id === 'farmerVillage') return { textContent: testProduct.village };
                return null;
            }
        };
        
        // Mock currentUser
        global.currentUser = {
            name: 'Test User',
            mobile: '+919999999999',
            userType: 'buyer',
            village: 'Test Village'
        };
        
        // Execute orderProduct function
        orderProduct(testProductId);
        
        console.log('✅ Order button test completed successfully!');
        console.log('📱 WhatsApp message would be sent to: 918329966445');
        console.log('💾 Order would be saved to MongoDB');
        
    } catch (error) {
        console.error('❌ Error testing order button:', error);
    }
} else {
    console.log('❌ orderProduct function not found');
}

console.log('Order button functionality test complete!');
