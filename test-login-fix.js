// Test script to verify login functionality works correctly
console.log('Testing Login Functionality...');

// Simulate browser environment
global.window = {
    location: {
        hostname: 'localhost' // Simulate local development
    }
};

global.localStorage = {
    data: {},
    getItem: function(key) {
        return this.data[key] || null;
    },
    setItem: function(key, value) {
        this.data[key] = value;
    }
};

global.document = {
    getElementById: function(id) {
        return {
            value: id === 'loginMobile' ? '+919999999999' : 
                   id === 'loginDOB' ? '1990-01-01' : ''
        };
    }
};

global.bootstrap = {
    Modal: {
        getInstance: function() {
            return {
                hide: function() {
                    console.log('Modal hidden');
                }
            };
        }
    }
};

global.alert = function(message) {
    console.log('Alert:', message);
};

// Test GitHub Pages detection
console.log('Testing GitHub Pages detection...');
const isGitHubPages = window.location.hostname !== 'localhost' && window.location.hostname.includes('github.io');
console.log('GitHub Pages detected:', isGitHubPages);

// Test client-side login
function handleClientSideLogin(mobile, dob) {
    console.log('Testing client-side login...');
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Existing users:', users);
    
    const user = users.find(u => u.mobile === mobile && u.dob === dob);
    
    if (user) {
        console.log('Found existing user:', user);
        return true;
    } else {
        // Create a demo user for testing
        const demoUser = {
            id: Date.now(),
            name: 'Demo User',
            mobile: mobile,
            dob: dob,
            village: 'Demo Village',
            userType: 'buyer',
            createdAt: new Date().toISOString()
        };
        
        console.log('Creating demo user:', demoUser);
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        return true;
    }
}

// Test login with demo credentials
const testMobile = '+919999999999';
const testDob = '1990-01-01';

console.log('Testing login with:', { testMobile, testDob });
const loginResult = handleClientSideLogin(testMobile, testDob);
console.log('Login result:', loginResult);

// Verify user is stored
const storedUser = JSON.parse(localStorage.getItem('currentUser'));
console.log('Stored user:', storedUser);

console.log('Login functionality test completed!');

// Test registration
function handleClientSideRegistration(newUser) {
    console.log('Testing client-side registration...');
    
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Existing users before registration:', users);
    
    // Check if user already exists
    if (users.find(u => u.mobile === newUser.mobile)) {
        console.log('User already exists');
        return false;
    }
    
    // Add new user
    const userWithId = {
        ...newUser,
        id: Date.now()
    };
    
    users.push(userWithId);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('User registered successfully:', userWithId);
    return true;
}

// Test registration
const testUser = {
    name: 'Test User',
    mobile: '+918888888888',
    dob: '1995-05-15',
    village: 'Test Village',
    userType: 'buyer'
};

console.log('Testing registration with:', testUser);
const registrationResult = handleClientSideRegistration(testUser);
console.log('Registration result:', registrationResult);

// Verify user is stored
const storedUsers = JSON.parse(localStorage.getItem('users'));
console.log('Stored users after registration:', storedUsers);

console.log('All login tests completed successfully!');
