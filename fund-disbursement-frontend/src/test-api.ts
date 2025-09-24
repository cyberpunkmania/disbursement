// Test script to verify API endpoints

interface TestResult {
  endpoint: string;
  status: 'pass' | 'fail' | 'error';
  message: string;
  data?: any;
}

const testEndpoints = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  // Test 1: Health check or basic endpoint
  try {
    console.log('Testing API connection...');
    // This will fail if CORS is not properly configured
    const response = await fetch('https://fund-disbursement-production.up.railway.app/api/v1/auth/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      results.push({
        endpoint: '/auth/health',
        status: 'pass',
        message: 'API is reachable',
        data: await response.text()
      });
    } else {
      results.push({
        endpoint: '/auth/health',
        status: 'fail',
        message: `HTTP ${response.status}: ${response.statusText}`
      });
    }
  } catch (error) {
    results.push({
      endpoint: '/auth/health',
      status: 'error',
      message: `Connection error: ${error}`
    });
  }

  // Test 2: Login endpoint structure (without actual login)
  try {
    console.log('Testing login endpoint structure...');
    const response = await fetch('https://fund-disbursement-production.up.railway.app/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})  // Empty body to test validation
    });
    
    // We expect this to fail with validation error, not connection error
    if (response.status === 400 || response.status === 422) {
      const errorData = await response.json();
      results.push({
        endpoint: '/auth/login',
        status: 'pass',
        message: 'Login endpoint is accessible and returns validation errors as expected',
        data: errorData
      });
    } else {
      results.push({
        endpoint: '/auth/login',
        status: 'fail',
        message: `Unexpected response: HTTP ${response.status}`
      });
    }
  } catch (error) {
    results.push({
      endpoint: '/auth/login',
      status: 'error',
      message: `Connection error: ${error}`
    });
  }

  return results;
};

// Export for use in development
export { testEndpoints };

// If running directly in browser console:
if (typeof window !== 'undefined') {
  (window as any).testAPI = testEndpoints;
  console.log('API test function available as window.testAPI()');
}