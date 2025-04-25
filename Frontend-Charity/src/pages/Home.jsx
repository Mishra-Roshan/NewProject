import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';
import donateImage from '../assets/donate.jpg';
import campaignImage from '../assets/campaign.jpg';
import DemoCampaign from '../components/campaigns/demo/DemoCampaign.jsx';

const Home = () => {
  const navigate = useNavigate();

  const handleViewCampaigns = () => {
    navigate('/campaigns/demo'); // Redirects to DemoCampaign
  };

  const handleStartCampaign = () => {
    navigate('/login'); // Redirects to org login
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <img src={heroImage} alt="Crowdfunding" className="w-full h-full object-cover brightness-75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Empowering Change Through Crowdfunding</h1>
          <p className="text-lg mb-6">Support causes you care about or start a campaign for your organization.</p>
          <div className="flex gap-4">
            <button
              onClick={handleViewCampaigns}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-medium transition"
            >
              View Campaigns
            </button>
            <button
              onClick={handleStartCampaign}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white font-medium transition"
            >
              Start a Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-12 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-transform hover:-translate-y-1">
          <img src={donateImage} alt="Donate" className="rounded-lg h-40 w-full object-cover mb-4" />
          <h3 className="text-xl font-semibold mb-2">Make a Difference</h3>
          <p>Support campaigns that matter to you. Every donation counts and brings hope to someone in need.</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-transform hover:-translate-y-1">
          <img src={campaignImage} alt="Campaign" className="rounded-lg h-40 w-full object-cover mb-4" />
          <h3 className="text-xl font-semibold mb-2">Create Campaigns</h3>
          <p>Organizations can easily launch campaigns and raise funds directly from our platform.</p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-transform hover:-translate-y-1">
          <div className="h-40 bg-blue-50 rounded-lg flex items-center justify-center text-5xl text-blue-600 font-bold mb-4">
            0%
          </div>
          <h3 className="text-xl font-semibold mb-2">Zero Platform Fees</h3>
          <p>Our crowdfunding platform charges <strong>NO fees</strong> so more money goes to the actual cause.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
