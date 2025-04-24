import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal_amount: '',
    deadline: '',
    category: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (image) formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/campaigns/create/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Campaign submitted for review!');
      navigate('/orgdashboard');
    } catch (err) {
      console.error('Error creating campaign:', err.response?.data);
      alert('Failed to create campaign');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Start a New Campaign</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          type="text"
          placeholder="Campaign Title"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Campaign Description"
          className="w-full border p-2 rounded"
          rows={5}
          onChange={handleChange}
          required
        />
        <input
          name="goal_amount"
          type="number"
          placeholder="Goal Amount (INR)"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <input
          name="deadline"
          type="date"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        />
        <select
          name="category"
          className="w-full border p-2 rounded"
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="education">Education</option>
          <option value="health">Health</option>
          <option value="disaster">Disaster Relief</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Campaign
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
