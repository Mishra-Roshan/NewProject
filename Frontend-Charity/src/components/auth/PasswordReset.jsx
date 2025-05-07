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
    console.log("Current path:", location.pathname);
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
      navigate('/verify-otp', { state: { email, user } });
    } catch (error) {
      console.error('Reset failed:', error);
      setMessage('Error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 py-10">
      <form onSubmit={handleReset} className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Reset Your Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Send OTP
        </button>

        {message && (
          <p className="text-center text-sm text-blue-700 mt-6 animate-pulse">{message}</p>
        )}
      </form>
    </div>
  );
};

export default PasswordReset;
