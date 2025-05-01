import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOtpResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { email, user } = location.state || {}; // coming from PasswordReset page
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || !password || !confirmPassword) {
      setMessage('Please fill all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/user/verify-otp-reset/', {
        email,
        user,
        otp,
        password
      });

      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate(user === 'organization' ? '/login' : '/user-login');
      }, 2000);
    } catch (error) {
      console.error('OTP verification failed:', error);
      setMessage('Invalid OTP or error occurred. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">Verify OTP & Reset Password</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full px-4 py-3 border rounded mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full px-4 py-3 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-3 border rounded mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Reset Password
        </button>

        {message && (
          <p className="text-center text-sm text-gray-700 mt-4">{message}</p>
        )}
      </form>
    </div>
  );
};

export default VerifyOtpResetPassword;
