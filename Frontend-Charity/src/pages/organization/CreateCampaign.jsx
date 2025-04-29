import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingCampaign = location.state?.campaign || null;

  const [form, setForm] = useState({
    title: editingCampaign?.title || '',
    description: editingCampaign?.description || '',
    goal_amount: editingCampaign?.goal_amount || '',
    deadline: editingCampaign?.deadline ? editingCampaign.deadline.split('T')[0] : '',
    category: editingCampaign?.category || 'Education',
    status: editingCampaign?.status || 'active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    try {
      if (editingCampaign) {
        // Update existing campaign
        await axios.patch(`http://localhost:8000/org/auth/camp/campaigns/${editingCampaign.id}/`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Campaign updated successfully!');
      } else {
        // Create new campaign
        await axios.post('http://localhost:8000/org/auth/camp/campaigns/', form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Campaign created successfully!');
      }

      navigate('/orgdashboard');
    } catch (error) {
      console.error('Error saving campaign:', error.response?.data);
      alert('Failed to save campaign. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 border rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {editingCampaign ? 'Update Campaign' : 'Start a New Campaign'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Campaign Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Campaign Description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded h-32"
        />
        <input
          type="number"
          name="goal_amount"
          placeholder="Goal Amount (in USD)"
          value={form.goal_amount}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        
        {/* Deadline Calendar Input */}
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="Education">Education</option>
          <option value="Disaster">Disaster Relief</option>
          <option value="Health">Health & Medical</option>
          <option value="Other">Other</option>
        </select>

        {/* Status Dropdown */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="draft">Draft</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 px-4 rounded hover:bg-blue-700"
        >
          {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
