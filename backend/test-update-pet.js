// Quick test script to verify pet update functionality
// Run this after logging in and getting a pet ID

const axios = require('axios');

async function testPetUpdate() {
  try {
    // You'll need to replace these with actual values from your app
    const AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE'; // Get from browser localStorage after login
    const PET_ID = 'YOUR_PET_ID_HERE'; // Get from the pets list
    
    console.log('Testing pet update endpoint...\n');
    
    // Test data to update
    const updateData = {
      name: 'Broovi Updated',
      age: 2,
      weight: 1.5,
      color: 'Black and White'
    };
    
    console.log('Sending PUT request to /api/pets/' + PET_ID);
    console.log('Update data:', JSON.stringify(updateData, null, 2));
    
    const response = await axios.put(
      `http://localhost:5000/api/pets/${PET_ID}`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('\n✅ Success! Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('\n❌ Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

// Instructions
console.log('='.repeat(60));
console.log('Pet Update Test Script');
console.log('='.repeat(60));
console.log('\nTo use this script:');
console.log('1. Log in to http://localhost:8080');
console.log('2. Open browser DevTools > Application > Local Storage');
console.log('3. Copy the auth token from localStorage');
console.log('4. Get a pet ID from the Pet Records page');
console.log('5. Edit this file and replace AUTH_TOKEN and PET_ID');
console.log('6. Run: node test-update-pet.js\n');
console.log('='.repeat(60));

// Uncomment to run the test
// testPetUpdate();
