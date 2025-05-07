import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CampaignView = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [existingReview, setExistingReview] = useState([]);
  const navigate = useNavigate();

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
      setCampaigns(res.data);
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

  // Submit the review (only create if not exists)
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          {campaigns.length === 0
            ? 'No campaign is created by you.'
            : campaigns.length === 1
            ? 'Your campaign'
            : 'Your campaigns'}
        </h2>
        <button
          onClick={() => navigate('/create-campaign')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
        >
          Start a Campaign
        </button>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.map((campaign) => {
          const {
            id,
            title,
            description,
            goal_amount,
            status,
            amount_gathered,
            category,
            deadline,
            image_url,
          } = campaign;
          const raised_amount = amount_gathered || 0;
          const progress = Math.min((raised_amount / parseFloat(goal_amount)) * 100, 100);

          return (
            <div
              key={id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-2xl"
            >
              {/* Image Section */}
              {image_url && (
                <div className="relative">
                  <img src={image_url} alt={title} className="w-full h-40 object-cover rounded-t-lg" />
                  <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-lg text-sm font-semibold">
                    {category || 'Uncategorized'}
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 hover:text-green-600 transition-colors">
                  {title}
                </h3>
                <p className="text-gray-600 mb-2">{status}</p>
                <p className="text-gray-500 mb-2">Deadline: {new Date(deadline).toLocaleDateString()}</p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="font-semibold text-lg mb-4">
                  {raised_amount} raised of {goal_amount}
                </p>

                <p className="text-base text-gray-700 mb-6">{description}</p>

                {/* Buttons */}
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

      {/* Review Section */}
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

export default CampaignView;
