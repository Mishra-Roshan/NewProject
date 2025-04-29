import { useState } from 'react';
import axios from 'axios';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/password_reset/', { email }); // adjust endpoint
      setMessage('If this email is registered, you will receive password reset instructions.');
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
          Send Reset Link
        </button>

        {message && (
          <p className="text-center text-sm text-gray-700 mt-4">{message}</p>
        )}
      </form>
    </div>
  );
};

export default PasswordReset;
