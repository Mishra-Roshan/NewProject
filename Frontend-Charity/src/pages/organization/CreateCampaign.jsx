import { useState, useEffect } from 'react';
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
    image: editingCampaign?.images || null,  // Use images for initial image
  });

  // Update form state if editingCampaign changes
  useEffect(() => {
    if (editingCampaign) {
      setForm({
        title: editingCampaign?.title || '',
        description: editingCampaign?.description || '',
        goal_amount: editingCampaign?.goal_amount || '',
        deadline: editingCampaign?.deadline ? editingCampaign.deadline.split('T')[0] : '',
        category: editingCampaign?.category || 'Education',
        status: editingCampaign?.status || 'active',
        images: editingCampaign?.images || null,
      });
    }
  }, [editingCampaign]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, images: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    const formData = new FormData();
    // Append all form values to FormData
    
    for (let key in form) {
      if (key === 'image' && form[key] === editingCampaign?.images) {
        // Skip appending the image if it's not changed
        continue;
      }
      formData.append(key, form[key]);
    }

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
     
    try {
      if (editingCampaign) {
        await axios.patch(`http://localhost:8000/org/auth/camp/campaigns/${editingCampaign.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Campaign updated successfully!');
      } else {
        await axios.post('http://localhost:8000/org/auth/camp/campaigns/', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Campaign created successfully!');
      }

      navigate('/campaigns');
    } catch (error) {
      console.error('Error saving campaign:', error.response?.data);
      alert('Failed to save campaign. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center py-20 px-4"
      style={{
        backgroundImage:
          'url("https://media.istockphoto.com/id/870402320/photo/a-social-worker-meeting-with-a-group-of-villagers.jpg?s=612x612&w=0&k=20&c=2JlS1vqg4pU5lCp8oiFXjVgMPlHbhrmH4wmtRJdq384=")',
      }}
    >
      <div className="max-w-2xl w-full bg-white/70  p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-black drop-shadow">
          {editingCampaign ? 'Update Campaign' : 'Start a New Campaign'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <input
            type="text"
            name="title"
            placeholder="Campaign Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-white/30  placeholder-black"
          />
          <textarea
            name="description"
            placeholder="Campaign Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded h-32 bg-white/30  placeholder-black"
          />
          <input
            type="number"
            name="goal_amount"
            placeholder="Goal Amount (in RS)"
            value={form.goal_amount}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-white/30  placeholder-black"
          />
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            required
            placeholder="Deadline"
            className="w-full p-3 border rounded bg-white/30  placeholder-black"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-white/30  text-black"
          >
            <option value="Education">Education</option>
            <option value="Disaster">Disaster Relief</option>
            <option value="Health">Health & Medical</option>
            <option value="Other">Other</option>
          </select>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-white/30  text-black"
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Image Input */}
          <input
            type="file"
            name="images"
            onChange={handleImageChange}
            className="w-full p-3 border rounded bg-white/30"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-black w-full py-3 px-4 rounded-lg transition"
          >
            {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
