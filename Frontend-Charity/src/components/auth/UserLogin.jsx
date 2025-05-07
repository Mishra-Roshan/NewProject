import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/auth'; // adjust path if needed

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(''); // New state for error message

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const response = await loginUser({ username, password });
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      navigate('/donor-dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhcml0eXxlbnwwfHwwfHx8MA%3D%3D')",
      }}
    >
      <div className="bg-white bg-opacity-80 backdrop-blur-md p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-4xl font-bold mb-6 text-center text-blue-700">Welcome Back!</h2>

        <form onSubmit={handleLogin}>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <span className="absolute left-3 top-3.5 text-gray-500 text-lg">👤</span>
          </div>

          <div className="relative mb-8">
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="absolute left-3 top-3.5 text-gray-500 text-lg">🔒</span>
          </div>

          {loginError && (
            <div className="mb-4 text-center text-red-600 font-medium bg-red-100 border border-red-300 p-2 rounded">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-sm mt-6 text-center text-gray-700">
            Not a user?{' '}
            <Link to="/user-register" className="text-blue-600 hover:underline font-semibold">
              Register now!
            </Link>
          </p>

          <p className="text-sm mt-4 text-center text-gray-600">
            <Link to="/user-forgot-password" className="text-red-500 hover:underline">
              Forgot Password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
