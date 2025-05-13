import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Marquee from 'react-fast-marquee';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/org/auth/camp/review/');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleViewCampaigns = () => {
    navigate('/campaigns');
  };

  const handleStartCampaign = () => {
    navigate('/login');
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
        {halfStars > 0 && <span className="text-yellow-400">☆</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">★</span>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Scrolling Banner */}
      <div style={{ backgroundColor: '#A86523' }} className="text-white py-2">
        <Marquee gradient={false} speed={50} pauseOnHover>
          🌟 New Campaigns Launching Daily &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          🤝 Zero Platform Fees &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          💡 Start Your Own Fundraiser Today &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          🎯 100% of Donations Go to the Cause!
        </Marquee>
      </div>

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src="https://media.istockphoto.com/id/524903696/photo/poor-indian-children-asking-for-food-india.jpg?s=612x612&w=0&k=20&c=uAUDyZRdpReAW51hD29W7fOCTDzNrOdHkAdKXErbapU="
          alt="Crowdfunding"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Empowering Change Through Crowdfunding
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl drop-shadow-sm">
            Support causes you care about or launch a campaign for your organization. Every action counts.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleViewCampaigns}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              View Campaigns
            </button>
            <button
              onClick={handleStartCampaign}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-transform transform hover:scale-105"
            >
              Start a Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2">
              <h3 className="text-2xl font-semibold mb-4">Secure Transactions</h3>
              <p>All donations are securely processed through Razorpay, ensuring complete transparency and security.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2">
              <h3 className="text-2xl font-semibold mb-4">Zero Platform Fees</h3>
              <p>Every penny you raise goes directly to your cause, with zero platform fees for campaigns.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2">
              <h3 className="text-2xl font-semibold mb-4">Impactful Storytelling</h3>
              <p>Tell your story with image and real-time updates to engage supporters effectively.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">What Our Campaigners Say</h2>

          {reviews.length > 0 ? (
            <div className="flex flex-wrap gap-6 justify-center">
              {reviews.map((item, index) => (
                <div key={index} className="bg-blue-50 shadow-lg rounded-lg px-6 py-8 w-80">
                  <p className="text-gray-700 italic mb-4 text-lg">“{item.review_text}”</p>
                  <p className="font-semibold text-blue-700">{item.author}</p>
                  <p className="text-gray-600 mt-2">Organization: {item.organization_name}</p>
                  <div className="mt-2">{renderStars(item.rating)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-lg text-gray-500">No reviews available yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;