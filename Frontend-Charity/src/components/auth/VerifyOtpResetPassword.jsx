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

  // Password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

    if (!passwordRegex.test(password)) {
      setMessage('Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.');
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
        navigate(user === 'donor' ? '/user-login' : '/login');
      }, 2000);
    } catch (error) {
      console.error('OTP verification failed:', error);
      setMessage('Invalid OTP or error occurred. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 py-10">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Verify OTP & Reset Password</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Reset Password
        </button>

        {message && (
          <p className="text-center text-sm text-red-600 mt-6">{message}</p>
        )}
      </form>
    </div>
  );
};

export default VerifyOtpResetPassword;
