import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CampaignView = () => {
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [existingReview, setExistingReview] = useState([]);
  const navigate = useNavigate();

  // Get organization details from localStorage
  const organizationName = localStorage.getItem('organization_name');
  const organizationLogo = localStorage.getItem('organization_logo');

  useEffect(() => {
    fetchCampaigns();
    fetchReview();
  }, []);

  // Fetch the list of campaigns
  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://localhost:8000/org/auth/camp/campaigns/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allCampaigns = res.data;
      
      // Separate active and completed campaigns
      const completed = allCampaigns.filter(
        (campaign) => campaign.status === 'completed' || campaign.amount_gathered >= parseFloat(campaign.goal_amount)
      );
      const active = allCampaigns.filter(
        (campaign) => campaign.status !== 'completed' && campaign.amount_gathered < parseFloat(campaign.goal_amount)
      );
      setActiveCampaigns(active);
      setCompletedCampaigns(completed);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    }
  };

  // Fetch the existing review for the organization (if any)
  const fetchReview = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://localhost:8000/org/auth/camp/review/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExistingReview(res.data);
    } catch (err) {
      console.error('Error fetching review:', err);
    }
  };

  #to handle review submit
  const handleReviewSubmit = async () => {
    if (!reviewText.trim() || rating === 0) {
      alert('Please provide a review and a rating.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(
        'http://localhost:8000/org/auth/camp/review/',
        { review_text: reviewText, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Review submitted successfully!');
      fetchReview(); // Refresh to show the submitted review
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review.');
    }
  };

  // Navigate to update the campaign
  const handleUpdate = (campaign) => {
    navigate('/create-campaign', { state: { campaign } });
  };

  // Delete the campaign
  const handleDelete = async (campaignId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this campaign?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:8000/org/auth/camp/campaigns/${campaignId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Campaign deleted successfully!');
      fetchCampaigns();
    } catch (err) {
      console.error('Error deleting campaign:', err);
      alert('Failed to delete campaign.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Organization Info */}
      <div className="flex items-center mb-8">
        {organizationLogo && (
          <img src={organizationLogo} alt="Organization Logo" className="w-20 h-20 rounded-full mr-4" />
        )}
        <h2 className="text-3xl font-semibold text-gray-800">{organizationName}</h2>
      </div>

      {/* Active Campaigns */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          {activeCampaigns.length === 0 ? 'No active campaigns.' : 'Your Active Campaigns'}
        </h2>
        <button
          onClick={() => navigate('/create-campaign')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          Start a Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Completed Campaigns */}
      <div className="mt-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Completed Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {completedCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      #review code
      <div className="mt-12 p-6 bg-gray-100 rounded-lg shadow-md">
      {existingReview && existingReview.length > 0 ? (
        <div>
          <p className="text-2xl font-semibold mb-4">Your Review:</p>
          <p>{existingReview[0].review_text}</p>
          <p>Rating: {existingReview[0].rating} / 5</p>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Leave a Review About the Platform</h2>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="w-full p-3 border rounded-md mb-4"
          />
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
          <button
            onClick={handleReviewSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-md"
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  </div>
  );
};

const CampaignCard = ({ campaign, onUpdate, onDelete }) => {
  const { id, title, description, goal_amount, amount_gathered, deadline, image_url } = campaign;
  const progress = goal_amount ? Math.min((amount_gathered / parseFloat(goal_amount)) * 100, 100) : 0;
  
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl">
      {image_url && <img src={image_url} alt={title} className="w-full h-40 object-cover rounded-t-lg" />}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3 hover:text-green-600 transition-colors">{title}</h3>
        <p className="text-gray-500 mb-2">Deadline: {new Date(deadline).toLocaleDateString()}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="font-semibold text-lg mb-4">
          {amount_gathered} raised of {goal_amount}
        </p>
        <p className="text-base text-gray-700 mb-6">{description}</p>

        <div className="flex space-x-4">
          <button
            onClick={() => onUpdate(campaign)}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-yellow-600 hover:scale-105 transition-all"
          >
            Update
          </button>
          <button
            onClick={() => onDelete(id)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 hover:scale-105 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )};

   


export default CampaignView;
