// Simple test script to verify API connection
const testAPI = async () => {
  const baseURL = 'https://sisyriaback-production.up.railway.app';
  
  console.log('Testing API connection...');
  console.log('Base URL:', baseURL);
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${baseURL}/api/health`);
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health check response:', healthData);
    }
    
    // Test users endpoint (should return 401 if not authenticated)
    const usersResponse = await fetch(`${baseURL}/api/users/me`, {
      credentials: 'include'
    });
    console.log('Users endpoint status:', usersResponse.status);
    
    if (usersResponse.status === 401) {
      console.log('✅ Expected 401 for unauthenticated request');
    } else {
      console.log('❌ Unexpected status:', usersResponse.status);
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
};

// Run the test
testAPI(); 