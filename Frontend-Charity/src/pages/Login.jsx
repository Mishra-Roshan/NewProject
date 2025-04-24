import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState(''); // Change variable to 'username'
  const [password, setPassword] = useState('');
  const role = localStorage.getItem('selectedRole') || 'donor';
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/org/auth/login/', {
        email: email, // Sending username instead of email
        password: password,
      });

      const { access, refresh } = response.data;

      // Save tokens in localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('isLoggedIn', 'true');

      // Redirect based on role
      if (role === 'organization') {
        navigate('/org-dashboard');
      } else {
        navigate('/donor-dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMsg =
        error.response?.data?.detail || 'Invalid credentials or server error.';
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center capitalize">Login as Organization</h2>

        <input
          type="text" // This is now a username field
          placeholder="Email"
          className="w-full mb-3 px-4 py-2 border rounded"
          value={email} // Bind to 'username' state
          onChange={(e) => setEmail(e.target.value)} // Update state on change
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>

        <p className="text-sm mt-4 text-center">
          Not a user?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register now!
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
