import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.jpg';
import donateImage from '../assets/donate.jpg';
import campaignImage from '../assets/campaign.jpg';
import Marquee from 'react-fast-marquee';
import Slider from 'react-slick';

const testimonials = [
  {
    text: 'Thanks to this platform, we raised ₹2 lakh in just 10 days. It was a game changer for our animal rescue drive.',
    author: 'Priya M., NGO Volunteer',
  },
  {
    text: 'The platform was easy to use and our school renovation campaign reached donors across the country.',
    author: 'Arjun R., Campaign Organizer',
  },
  {
    text: 'I was skeptical at first, but the zero platform fee and fast withdrawals made it totally worth it!',
    author: 'Fatima K., Community Leader',
  },
  {
    text: 'We used this to fund our medical treatment and received support from people we didn’t even know. Forever grateful!',
    author: 'Rahul D., Beneficiary',
  },
  {
    text: 'Raising funds for our village library was never this easy. We’re now fully stocked with new books!',
    author: 'Neha S., Rural Educator',
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleViewCampaigns = () => {
    navigate('/campaigns/demo');
  };

  const handleStartCampaign = () => {
    navigate('/login');
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Scrolling Info Banner */}
      <div className="bg-blue-800 text-white py-2">
        <Marquee gradient={false} speed={50} pauseOnHover>
          🌟 New Campaigns Launching Daily &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          🤝 Zero Platform Fees &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          💡 Start Your Own Fundraiser Today &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          🎯 100% of Donations Go to the Cause!
        </Marquee>
      </div>

      {/* Hero Section */}
      <div className="relative h-[450px]">
        <img src={heroImage} alt="Crowdfunding" className="w-full h-full object-cover brightness-75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
            Empowering Change Through Crowdfunding
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl drop-shadow-sm">
            Support causes you care about or launch a campaign for your organization. Every action counts.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleViewCampaigns}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition duration-300"
            >
              View Campaigns
            </button>
            <button
              onClick={handleStartCampaign}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition duration-300"
            >
              Start a Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-14 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-transform hover:-translate-y-1">
          <img src={donateImage} alt="Donate" className="rounded-lg h-44 w-full object-cover mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-blue-700">Make a Difference</h3>
          <p className="text-gray-700">
            Support campaigns that matter to you. Every donation brings hope and creates real impact.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-transform hover:-translate-y-1">
          <img src={campaignImage} alt="Campaign" className="rounded-lg h-44 w-full object-cover mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-green-700">Create Campaigns</h3>
          <p className="text-gray-700">
            Organizations can quickly launch fundraising campaigns and gather support from a wide audience.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-transform hover:-translate-y-1">
          <div className="h-44 bg-blue-100 rounded-lg flex items-center justify-center text-5xl text-blue-600 font-bold mb-4">
            0%
          </div>
          <h3 className="text-xl font-semibold mb-2 text-indigo-700">Zero Platform Fees</h3>
          <p className="text-gray-700">
            We charge <strong>no platform fees</strong> — more of your donation goes directly to the cause.
          </p>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">What Our Campaigners Say</h2>
          <Slider {...sliderSettings}>
            {testimonials.map((item, index) => (
              <div key={index} className="p-6">
                <div className="bg-gray-50 shadow-md rounded-lg px-6 py-8">
                  <p className="text-gray-700 italic mb-4">“{item.text}”</p>
                  <p className="font-semibold text-blue-600">{item.author}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Home;
