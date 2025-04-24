import { Link } from 'react-router-dom';

const CampaignCard = ({ campaign }) => {
  const { id, title, category, goal_amount, raised_amount, image_url } = campaign;
  const progress = Math.min((raised_amount / goal_amount) * 100, 100);

  return (
    <Link to={`/campaigns/${id}`} className="border rounded-lg shadow hover:shadow-md transition p-4 block">
      <img src={image_url} alt={title} className="w-full h-40 object-cover rounded mb-2" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{category}</p>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="text-sm mt-1">{raised_amount} raised of {goal_amount}</p>
    </Link>
  );
};

export default CampaignCard;
