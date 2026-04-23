// Comprehensive login debugging script
console.log('=== LOGIN DEBUG SCRIPT ===');

// Test 1: Check if login function exists
console.log('1. Checking if handleLogin function exists...');
if (typeof handleLogin === 'function') {
    console.log('   handleLogin function exists');
} else {
    console.log('   handleLogin function NOT found - this is the problem!');
}

// Test 2: Check if DOM elements exist
console.log('2. Checking DOM elements...');
try {
    const loginMobile = document.getElementById('loginMobile');
    const loginDOB = document.getElementById('loginDOB');
    
    console.log('   loginMobile element:', loginMobile ? 'EXISTS' : 'NOT FOUND');
    console.log('   loginDOB element:', loginDOB ? 'EXISTS' : 'NOT FOUND');
} catch (error) {
    console.log('   DOM check error:', error.message);
}

// Test 3: Check environment detection
console.log('3. Checking environment detection...');
try {
    const hostname = window.location.hostname;
    const isGitHubPages = hostname !== 'localhost' && hostname.includes('github.io');
    
    console.log('   Current hostname:', hostname);
    console.log('   GitHub Pages detected:', isGitHubPages);
} catch (error) {
    console.log('   Environment detection error:', error.message);
}

// Test 4: Check localStorage
console.log('4. Checking localStorage...');
try {
    const testKey = 'test-key';
    localStorage.setItem(testKey, 'test-value');
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    console.log('   localStorage working:', retrieved === 'test-value');
} catch (error) {
    console.log('   localStorage error:', error.message);
}

// Test 5: Check if Bootstrap is loaded
console.log('5. Checking Bootstrap...');
try {
    if (typeof bootstrap !== 'undefined') {
        console.log('   Bootstrap loaded');
    } else {
        console.log('   Bootstrap NOT loaded');
    }
} catch (error) {
    console.log('   Bootstrap check error:', error.message);
}

// Test 6: Simulate login process
console.log('6. Testing login simulation...');
try {
    // Simulate form data
    const mobile = '+919999999999';
    const dob = '1990-01-01';
    
    console.log('   Simulating login with:', { mobile, dob });
    
    // Check if client-side login works
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('   Existing users in localStorage:', users.length);
    
    const user = users.find(u => u.mobile === mobile && u.dob === dob);
    console.log('   User found:', user ? 'YES' : 'NO');
    
    if (!user) {
        console.log('   Creating demo user...');
        const demoUser = {
            id: Date.now(),
            name: 'Demo User',
            mobile: mobile,
            dob: dob,
            village: 'Demo Village',
            userType: 'buyer',
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        console.log('   Demo user created and stored');
    }
    
} catch (error) {
    console.log('   Login simulation error:', error.message);
}

console.log('=== DEBUG COMPLETE ===');
console.log('If you see any errors above, those are the issues to fix.');
console.log('Common issues:');
console.log('- handleLogin function not found: Check if JS is loaded');
console.log('- DOM elements not found: Check if HTML is loaded');
console.log('- localStorage errors: Check browser settings');
console.log('- Bootstrap not loaded: Check if CSS/JS are loaded');
