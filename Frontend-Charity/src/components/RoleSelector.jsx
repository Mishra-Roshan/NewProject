import { useNavigate } from 'react-router-dom';

const RoleSelector = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    localStorage.setItem('selectedRole', role);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Continue As</h1>
      <div className="flex gap-6">
        <button
          onClick={() => handleSelect('donor')}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Donor
        </button>
        <button
          onClick={() => handleSelect('organization')}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          Organization
        </button>
      </div>
    </div>
  );
};

export default RoleSelector;
