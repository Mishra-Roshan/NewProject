import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/auth'; // adjust path if needed

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);  // Show loading spinner

    try {
      const response = await loginUser({ username, password });
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      alert('Login successful!');
      navigate('/campaigns'); // redirect after login
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);  // Hide loading spinner
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <form onSubmit={handleLogin} className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">Welcome Back!</h2>

        <div className="relative mb-5">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <span className="absolute left-3 top-3 text-gray-500">👤</span>
        </div>

        <div className="relative mb-6">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="absolute left-3 top-3 text-gray-500">🔒</span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={isLoading}  // Disable button while loading
        >
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            'Login'
          )}
        </button>

        <p className="text-sm mt-4 text-center text-gray-600">
          Not a user?{' '}
          <Link to="/user-register" className="text-blue-500 hover:underline">
            Register now!
          </Link>
        </p>
      </form>
    </div>
  );
};

export default UserLogin;
