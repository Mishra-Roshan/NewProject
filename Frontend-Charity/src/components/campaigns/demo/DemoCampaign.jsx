import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const DemoCampaign = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/org/auth/view-campaigns/');
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleDonateClick = (campaignId) => {
    // You can also store this ID in localStorage or context if needed
    navigate('/user-login'); // or `/donate/${campaignId}` if you implement detailed donation flow
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Explore Active Campaigns</h1>

      {loading ? (
        <p className="text-center">Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-center text-gray-500">No campaigns available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white shadow-md rounded-lg p-6">
              <img
                src={`https://source.unsplash.com/random/800x400?sig=${campaign.id}&${campaign.category}`}
                alt={campaign.title}
                className="rounded-md w-full h-48 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold mb-2 capitalize">{campaign.title}</h2>
              <p className="text-gray-700 mb-2">{campaign.description}</p>
              <p className="text-sm text-gray-500 mb-1">Category: {campaign.category}</p>
              <p className="text-sm text-gray-500 mb-1">Organization: {campaign.organization_name}</p>
              <p className="text-sm text-gray-500 mb-1">
                Goal: ₹{parseFloat(campaign.goal_amount).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Deadline: {new Date(campaign.deadline).toLocaleDateString()}
              </p>

              <button
                onClick={() => handleDonateClick(campaign.id)}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              >
                Donate Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DemoCampaign;
