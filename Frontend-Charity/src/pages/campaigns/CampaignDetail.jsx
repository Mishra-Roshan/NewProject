import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CampaignDetail = () => {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`http://localhost:8000/org/auth/camp/campaigns/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCampaigns(res.data);  // saving the list
      } catch (err) {
        console.error('Error fetching campaigns:', err);
      }
    };
    fetchCampaigns();
  }, []);

  if (!campaigns) {
    return <p className="p-6">Loading campaigns...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top Section: Heading + Create Campaign Button */}
      <div className="flex justify-between items-center mb-6">
        {campaigns.length === 0 ? (
          <h2 className="text-2xl font-semibold">No campaign is created by you.</h2>
        ) : campaigns.length === 1 ? (
          <h2 className="text-2xl font-semibold">Your campaign</h2>
        ) : (
          <h2 className="text-2xl font-semibold">Your campaigns</h2>
        )}

        {/* Create Campaign Button */}
        <button
          onClick={() => navigate('/create-campaign')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Start a Campaign
        </button>
      </div>

      {/* Show all campaigns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((campaign) => {
          const { title, description, goal_amount, status, deadline, category } = campaign;
          const raised_amount = campaign.raised_amount || 0;
          const progress = Math.min((raised_amount / parseFloat(goal_amount)) * 100, 100);

          return (
            <div key={campaign.created_at} className="bg-white shadow-md rounded-lg p-4">
              {/* No image_url available, so skip image */}

              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-gray-600 mb-1 capitalize">{category || "Uncategorized"}</p>
              <p className="text-gray-500 mb-1">Status: {status}</p>
              <p className="text-gray-500 mb-1">Deadline: {new Date(deadline).toLocaleDateString()}</p>

              <div className="w-full bg-gray-200 rounded-full h-2 my-3">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="mb-4 font-semibold">{raised_amount} raised of {goal_amount}</p>
              <p className="text-base">{description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignDetail;
