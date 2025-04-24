import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const token = localStorage.getItem("access");
  const rawUser = localStorage.getItem("user");
  let userName = "User";

  let user = null;
  try {
    if (rawUser) {
      user = JSON.parse(rawUser);
      userName = user.name || "User";
    }
  } catch (error) {
    console.error("Invalid user JSON in localStorage:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleViewCampaign = () => {
    navigate(token ? "/campaigns" : "/login");
  };

  return (
    <div className="text-gray-800 relative">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-600">FundRaise</h1>
        {user && (
          <div className="relative">
            <button
              className="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300"
              onClick={() => setShowMenu(!showMenu)}
            >
              <span>{userName}</span>
              <span>🔽</span>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border">
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 transition duration-300">
        <div className="max-w-4xl mx-auto text-center px-6 hover:scale-105 transform transition">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Empower Causes. Change Lives.</h1>
          <p className="text-lg md:text-xl mb-6">Start or support fundraising campaigns that make a real difference.</p>
          <div className="flex justify-center gap-4">
          <Link
  to="/campaigns/demo"
  className="text-blue-600 font-semibold hover:underline"
>
  View Campaign
</Link>
            <Link to="/register" className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition">
              Start a Campaign
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-gray-50 transition duration-300">
        <div className="max-w-5xl mx-auto text-center hover:shadow-lg hover:scale-[1.01] bg-white p-8 rounded-lg transition">
          <h2 className="text-3xl font-bold mb-4">About Our Platform</h2>
          <p className="text-lg text-gray-700">
            We provide a simple and transparent way for individuals and organizations to raise funds for causes they care about—be it education, healthcare, emergency relief, or more.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { emoji: '🎯', title: 'Start a Campaign', desc: 'Create a fundraising page with your story, images, and a goal.' },
              { emoji: '🤝', title: 'Share with Supporters', desc: 'Promote your campaign across social media, email, or your network.' },
              { emoji: '💳', title: 'Receive Donations', desc: 'Track progress and collect funds securely with full transparency.' },
            ].map((step, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-sm hover:shadow-xl hover:scale-105 transition"
              >
                <div className="text-4xl mb-4">{step.emoji}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-50 px-6">
        <div className="max-w-3xl mx-auto text-center hover:scale-[1.01] transition hover:shadow-lg bg-white rounded-lg p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to make an impact?</h2>
          <p className="mb-6 text-gray-700">Start your fundraising journey today or explore powerful campaigns.</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleViewCampaign}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              View Campaigns
            </button>
            <Link to="/register" className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition">
              Start a Campaign
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
