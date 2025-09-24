import React, { useState } from 'react';
import { usePositions } from '@/hooks/useAdmin';
import { AuthService } from '@/api/services/auth.service';
import { adminService } from '@/api/services/admin.service';
import { testTokenManually, setTestToken } from '@/utils/tokenTest';

const ApiTestComponent: React.FC = () => {
  const { data: positions, isLoading, error } = usePositions();
  const user = AuthService.getCurrentUser();
  const token = AuthService.getAccessToken();
  const [testResult, setTestResult] = useState<string>('');
  const [isTestingDirect, setIsTestingDirect] = useState(false);
  const [manualToken, setManualToken] = useState<string>('');
  const [manualTestResult, setManualTestResult] = useState<string>('');
  const [isTestingManual, setIsTestingManual] = useState(false);

  const testDirectApiCall = async () => {
    setIsTestingDirect(true);
    setTestResult('');
    
    try {
      console.log('Testing direct API call...');
      console.log('Token being used:', token);
      console.log('User:', user);
      
  const result = await adminService.getPositions();
      console.log('Direct API call result:', result);
      
      setTestResult(`Success: Got ${result.data?.length || 0} positions`);
    } catch (error: any) {
      console.error('Direct API call error:', error);
      setTestResult(`Error: ${error.message}`);
    } finally {
      setIsTestingDirect(false);
    }
  };

  const copyTokenToClipboard = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      alert('Token copied to clipboard!');
    }
  };

  const testManualToken = async () => {
    if (!manualToken.trim()) {
      setManualTestResult('Please enter a token');
      return;
    }

    setIsTestingManual(true);
    setManualTestResult('');
    
    try {
      const result = await testTokenManually(manualToken.trim());
      if (result.success) {
        setManualTestResult(`Success: ${JSON.stringify(result.data)}`);
      } else {
        setManualTestResult(`Error: ${result.error || `Status ${result.status}`}`);
      }
    } catch (error: any) {
      setManualTestResult(`Error: ${error.message}`);
    } finally {
      setIsTestingManual(false);
    }
  };

  const useManualToken = () => {
    if (!manualToken.trim()) {
      alert('Please enter a token first');
      return;
    }
    setTestToken(manualToken.trim());
    alert('Token set in sessionStorage! Refresh the page to use it.');
  };

  return (
    <div className="p-6 bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        API Debug Component
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Authentication Status:</h4>
          <div className="bg-gray-50 dark:bg-dark-700 p-3 rounded-lg text-xs font-mono">
            <p>User: {user?.sub || 'Not logged in'}</p>
            <p>Role: {user?.role || 'N/A'}</p>
            <p>User ID: {user?.id || 'N/A'}</p>
            <p>Token Expires: {user?.exp ? new Date(user.exp * 1000).toLocaleString() : 'N/A'}</p>
            <p>Token Present: {token ? 'Yes' : 'No'}</p>
            <p>Token Length: {token?.length || 0}</p>
            <p>Is Authenticated: {AuthService.isAuthenticated() ? 'Yes' : 'No'}</p>
          </div>
          {token && (
            <div className="mt-2">
              <button
                onClick={copyTokenToClipboard}
                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Copy Token
              </button>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">API Request Details:</h4>
          <div className="bg-gray-50 dark:bg-dark-700 p-3 rounded-lg text-xs font-mono">
            <p>Base URL: {import.meta.env.VITE_API_URL}</p>
            <p>Endpoint: /admin/positions</p>
            <p>Full URL: {import.meta.env.VITE_API_URL}/admin/positions</p>
            <p>Method: GET</p>
            <p>Headers: Authorization: Bearer {token ? '[TOKEN_PRESENT]' : '[NO_TOKEN]'}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Hook-based API Test:</h4>
          {isLoading && (
            <p className="text-sm text-blue-600">Loading positions...</p>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <p className="text-sm text-red-600 font-semibold">Error: {error.message}</p>
            </div>
          )}
          {positions && (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p className="text-sm text-green-600 font-semibold">
                Successfully loaded {positions.length} positions
              </p>
              <ul className="mt-2 space-y-1">
                {positions.map((position) => (
                  <li key={position.uuid} className="text-xs text-gray-500 dark:text-gray-400">
                    {position.name} - {position.active ? 'Active' : 'Inactive'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Direct API Test:</h4>
          <button
            onClick={testDirectApiCall}
            disabled={isTestingDirect}
            className="px-4 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {isTestingDirect ? 'Testing...' : 'Test Direct API Call'}
          </button>
          {testResult && (
            <div className={`mt-2 p-3 rounded-lg ${
              testResult.startsWith('Success') 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-600'
            }`}>
              <p className="text-sm font-semibold">{testResult}</p>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Manual Token Test (from Postman):</h4>
          <div className="space-y-2">
            <textarea
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Paste your token from Postman here..."
              className="w-full h-20 p-2 text-xs font-mono border border-gray-300 dark:border-dark-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
            />
            <div className="flex space-x-2">
              <button
                onClick={testManualToken}
                disabled={isTestingManual}
                className="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 disabled:opacity-50"
              >
                {isTestingManual ? 'Testing...' : 'Test Token'}
              </button>
              <button
                onClick={useManualToken}
                className="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Use This Token
              </button>
            </div>
            {manualTestResult && (
              <div className={`p-3 rounded-lg text-xs font-mono ${
                manualTestResult.startsWith('Success') 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-600'
              }`}>
                <p className="font-semibold">{manualTestResult}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Session Storage Contents:</h4>
          <div className="bg-gray-50 dark:bg-dark-700 p-3 rounded-lg text-xs font-mono">
            <p>accessToken: {sessionStorage.getItem('accessToken') ? 'Present' : 'Missing'}</p>
            <p>refreshToken: {sessionStorage.getItem('refreshToken') ? 'Present' : 'Missing'}</p>
            <p>user: {sessionStorage.getItem('user') ? 'Present' : 'Missing'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestComponent;