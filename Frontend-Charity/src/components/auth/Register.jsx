import { useState } from 'react';
import { registerOrg } from '../../api/auth';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    contact_email: '',
    password: '',
    password2: '',
    org_description: '',
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm({
      ...form,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      alert('Passwords do not match!');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('contact_email', form.contact_email);
    formData.append('password', form.password);
    formData.append('org_description', form.org_description);
    if (form.logo) formData.append('logo', form.logo);

    try {
      await registerOrg(formData);
      alert('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      alert('Registration failed: ' + (error.response?.data?.message || 'Try again.'));
    }
  };

  return (
    <div
  className="flex items-center justify-center min-h-screen bg-cover bg-center p-4"
  style={{
    backgroundImage: "url('https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
  }}
>

<div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow bg-white bg-opacity-20 backdrop-blur-md">


        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6">
          Register Your Organization
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Organization Name</label>
            <input
              name="name"
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              placeholder="e.g., Helping Hands"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Contact Email</label>
            <input
              type="email"
              name="contact_email"
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              placeholder="example@ngo.org"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="password2"
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Organization Description</label>
            <textarea
              name="org_description"
              rows={3}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              placeholder="Tell us about your mission"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Upload Logo (.jpg)</label>
            <input
              type="file"
              name="logo"
              accept=".jpg"
              onChange={handleChange}
              className="mt-1 w-full text-sm border border-gray-300 rounded-lg p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-700 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
