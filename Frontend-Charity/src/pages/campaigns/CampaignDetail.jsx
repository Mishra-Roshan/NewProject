import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/campaigns/${id}/`);
        setCampaign(res.data);
      } catch (err) {
        console.error('Error fetching campaign:', err);
      }
    };
    fetchCampaign();
  }, [id]);

  if (!campaign) return <p className="p-6">Loading campaign...</p>;

  const { title, description, goal_amount, raised_amount, category, image_url } = campaign;
  const progress = Math.min((raised_amount / goal_amount) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img src={image_url} alt={title} className="w-full h-64 object-cover rounded mb-4" />
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 mb-1">{category}</p>
      <div className="w-full bg-gray-200 rounded-full h-2 my-3">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="mb-4">{raised_amount} raised of {goal_amount}</p>
      <p className="text-lg">{description}</p>
    </div>
  );
};

export default CampaignDetail;
