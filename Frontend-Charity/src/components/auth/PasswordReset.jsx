import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

  // Determine if this is donor or organization
  useEffect(() => {
    if (location.pathname === '/login') {
      setUser('organization');
    } else if (location.pathname === '/user-login') {
      setUser('donor');
    }
  }, [location.pathname]);

  const handleReset = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:8000/user/request-otp/', {
        email,
        user,
      });

      setMessage('OTP sent to your email. Please check and proceed.');
      // Navigate to OTP verification + password reset form with state
      navigate('/verify-otp', { state: { email, user } });
    } catch (error) {
      console.error('Reset failed:', error);
      setMessage('Error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleReset} className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">Reset Your Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send OTP
        </button>

        {message && (
          <p className="text-center text-sm text-gray-700 mt-4">{message}</p>
        )}
      </form>
    </div>
  );
};

export default PasswordReset;
