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
    if (form.logo) {
      formData.append('logo', form.logo);
    }

    try {
      await registerOrg(formData); // this should be a POST request with headers set for multipart/form-data
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      alert('Registration failed: ' + (error.response?.data?.message || 'Try again.'));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Organization Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          name="name"
          placeholder="Organization Name"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="contact_email"
          placeholder="Contact Email"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="org_description"
          placeholder="Organization Description"
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          name="logo"
          accept=".jpg"
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700"
        >
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
