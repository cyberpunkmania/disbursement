// Utility to test tokens manually
export const testTokenManually = async (token: string) => {
  const baseURL = 'https://fund-disbursement-production.up.railway.app/api/v1';
  const endpoint = '/admin/positions';
  
  try {
    console.log('Testing token manually...');
    console.log('Token:', token);
    console.log('URL:', `${baseURL}${endpoint}`);
    
    const response = await fetch(`${baseURL}${endpoint}?activeOnly=false`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', data);
    
    return {
      success: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error('Manual token test error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Function to set a token manually for testing
export const setTestToken = (token: string) => {
  sessionStorage.setItem('accessToken', token);
  console.log('Test token set in sessionStorage');
};