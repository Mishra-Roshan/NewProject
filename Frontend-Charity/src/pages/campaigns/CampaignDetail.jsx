import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CampaignDetail = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const tokens = localStorage.getItem('accessToken');
      const res = await axios.get(`http://localhost:8000/org/auth/camp/campaigns/`, {
        headers: {
          Authorization: `Bearer ${tokens}`,
        },
      });
      setCampaigns(res.data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    }
  };

  const handleUpdate = (campaign) => {
    navigate('/create-campaign', { state: { campaign } });
  };

  const handleDelete = async (campaignId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this campaign?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:8000/org/auth/camp/campaigns/${campaignId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Campaign deleted successfully!');
      fetchCampaigns();  // Refresh the list after deletion
    } catch (err) {
      console.error('Error deleting campaign:', err);
      alert('Failed to delete campaign.');
    }
  };

  if (!campaigns) {
    return <p className="p-6 text-center text-gray-600">Loading campaigns...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top Section: Heading + Create Campaign Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          {campaigns.length === 0 ? (
            "No campaign is created by you."
          ) : campaigns.length === 1 ? (
            "Your campaign"
          ) : (
            "Your campaigns"
          )}
        </h2>

        {/* Create Campaign Button */}
        <button
          onClick={() => navigate('/create-campaign')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          Start a Campaign
        </button>
      </div>

      {/* Show all campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.map((campaign) => {
          const { id, title, description, goal_amount, status, amount_gathered, category, deadline, image_url } = campaign;
          const raised_amount = campaign.amount_gathered || 0;
          const progress = Math.min((raised_amount / parseFloat(goal_amount)) * 100, 100);

          return (
            <div key={id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl">
              {/* Image Section (Optional, if you have an image URL for the campaign) */}
              {image_url && (
                <div className="relative">
                  <img src={image_url} alt={title} className="w-full h-40 object-cover rounded-t-lg" />
                  <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-lg text-sm font-semibold">{category || "Uncategorized"}</div>
                </div>
              )}

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 hover:text-green-600 transition-colors">{title}</h3>
                <p className="text-gray-600 mb-2">{status}</p>
                <p className="text-gray-500 mb-2">Deadline: {new Date(deadline).toLocaleDateString()}</p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="font-semibold text-lg mb-4">{raised_amount} raised of {goal_amount}</p>

                {/* Description */}
                <p className="text-base text-gray-700 mb-6">{description}</p>

                {/* Update and Delete buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleUpdate(campaign)}
                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-yellow-600 hover:scale-105 transition-all"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 hover:scale-105 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignDetail;
