import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const DemoCampaign = () => {
  const navigate = useNavigate();
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/org/auth/view-campaigns/');
        const currentDate = new Date();

        const active = [];
        const completed = [];

        response.data.forEach((campaign) => {
          const raisedAmount = parseFloat(campaign.amount_gathered) || 0;
          const goalAmount = parseFloat(campaign.goal_amount) || 0;
          const deadlinePassed = new Date(campaign.deadline) <= currentDate;

          if (raisedAmount >= goalAmount || campaign.status === 'completed') {
            completed.push(campaign);
          } else if (campaign.status === 'active' && !deadlinePassed) {
            active.push(campaign);
          }
        });

        setActiveCampaigns(active);
        setCompletedCampaigns(completed);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleDonateClick = (campaign) => {
    localStorage.setItem('selectedCampaignId', campaign.id);
    localStorage.setItem('campaignGoalAmount', campaign.goal_amount);
    localStorage.setItem('campaignAmountGathered', campaign.amount_gathered || 0);
    navigate('/user-login');
  };

  const closeModal = () => setSelectedCampaign(null);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Explore Active Campaigns</h1>

      {/* Active Campaigns */}
      {loading ? (
        <p className="text-center">Loading campaigns...</p>
      ) : activeCampaigns.length === 0 ? (
        <p className="text-center text-gray-500">No active campaigns available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {activeCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => setSelectedCampaign(campaign)}
              className="cursor-pointer bg-white shadow-md rounded-lg p-6 transition-transform hover:scale-105"
            >
              <img
                src={campaign.image_url}
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
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering modal
                  handleDonateClick(campaign);
                }}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
              >
                Donate Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Completed Campaigns */}
      {completedCampaigns.length > 0 && (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center">Successfully Completed Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {completedCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-gray-100 shadow-md rounded-lg p-6 transition-transform hover:scale-105"
              >
                <img
                  src={campaign.image_url}
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
                <p className="text-sm text-gray-500 mb-1">
                  Raised: ₹{parseFloat(campaign.amount_gathered || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                </p>
                <p className="bg-green-600 text-white py-2 px-4 rounded text-center">
                  Successfully Funded
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal Banner */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <img
              src={selectedCampaign.image_url}
              alt={selectedCampaign.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{selectedCampaign.title}</h2>
            <p className="text-gray-700 mb-2">{selectedCampaign.description}</p>
            <p className="text-sm text-gray-500 mb-1">Category: {selectedCampaign.category}</p>
            <p className="text-sm text-gray-500 mb-1">Organization: {selectedCampaign.organization_name}</p>
            <p className="text-sm text-gray-500 mb-1">
              Goal: ₹{parseFloat(selectedCampaign.goal_amount).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Deadline: {new Date(selectedCampaign.deadline).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleDonateClick(selectedCampaign)}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition w-full"
            >
              Donate Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoCampaign;
