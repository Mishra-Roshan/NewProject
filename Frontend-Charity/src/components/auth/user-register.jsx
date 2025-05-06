import { useState } from 'react';
import { registerUser } from '../../api/auth';
import { useNavigate, Link } from 'react-router-dom';

const UserRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(''); // clear error when user changes input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password2) {
      setError('Passwords do not match!');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(form.password)) {
      setError('Password must include at least one uppercase letter, one number, and one special character.');
      return;
    }

    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
    };

    try {
      setIsLoading(true);
      await registerUser(payload);
      navigate('/user-login');
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhcml0eXxlbnwwfHwwfHx8MA%3D%3D')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 p-10 rounded-xl shadow-lg w-full max-w-md backdrop-blur-md relative"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Create Your Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError('')}
              className="absolute top-2 right-3 text-red-700 font-bold"
            >
              ×
            </button>
          </div>
        )}

        <div className="relative mb-4">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-0 top-3 text-gray-500">👤</span>
        </div>

        <div className="relative mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-0 top-3 text-gray-500">📧</span>
        </div>

        <div className="relative mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-0 top-3 text-gray-500">🔒</span>
        </div>

        <div className="relative mb-6">
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-0 top-3 text-gray-500">🔁</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-sm mt-4 text-center text-gray-700">
          Already have an account?{' '}
          <Link to="/user-login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default UserRegister;
