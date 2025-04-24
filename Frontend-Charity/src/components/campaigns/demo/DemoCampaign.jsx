import { useNavigate } from 'react-router-dom';

const DemoCampaign = () => {
  const navigate = useNavigate();

  const handleDonateClick = () => {
    navigate('/user-login'); // or add check if already logged in
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-3xl font-bold mb-4">Save the Children: Education Campaign</h1>
      <img
        src="https://source.unsplash.com/featured/?children,education"
        alt="Campaign"
        className="rounded-lg w-full mb-4"
      />
      <p className="text-gray-700 mb-4">
        This campaign supports underprivileged children in rural areas with basic educational
        resources like books, uniforms, and access to learning materials.
      </p>
      <p className="text-lg font-semibold mb-2">Goal: ₹1,00,000</p>
      <p className="text-sm text-gray-600 mb-6">Ends: June 30, 2025</p>

      <button
        onClick={handleDonateClick}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
      >
        Donate Now
      </button>
    </div>
  );
};

export default DemoCampaign;
