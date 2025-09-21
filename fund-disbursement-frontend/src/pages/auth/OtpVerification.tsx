import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/api/services/auth.service';
import type { OtpVerificationRequest } from '@/types/auth.types';

export const OtpVerification: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [error, setError] = useState<string>('');
  
  const username = AuthService.getVerifyUsername();

  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [username, navigate]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to focus previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6 || !username) return;

    setLoading(true);
    setError('');
    try {
      const otpData: OtpVerificationRequest = {
        username,
        otp: otpCode
      };

      const response = await AuthService.verifyOtp(otpData);

      if (response?.user) {
        // Redirect based on role
        const userRole = response.user.role;
        navigate(userRole === 'ADMIN' ? '/admin/dashboard' : '/user/dashboard');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Verification failed');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResendOtp = async () => {
    if (!username) return;
    
    setLoading(true);
    setError('');
    try {
      // Re-send the authentication request to get a new OTP
      await AuthService.login({ username, password: '' }); // We don't store password, user will need to go back to login
      setCountdown(300);
      setOtp(['', '', '', '', '', '']);
    } catch (error) {
      setError('Please go back to login to get a new OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit code sent to {username}
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Code expires in: <span className="font-bold">{formatTime(countdown)}</span>
            </p>
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          {countdown === 0 && (
            <button
              onClick={handleResendOtp}
              disabled={loading}
              className="w-full py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Resending...' : 'Resend OTP'}
            </button>
          )}

          <div className="text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};