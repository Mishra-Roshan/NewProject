import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const OrgDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Replace navigation history to avoid back to login/register
    navigate('/org-dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h1>

      <button
        onClick={() => navigate('/create-campaign')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Start a Campaign
      </button>
    </div>
  );
};

export default OrgDashboard;
