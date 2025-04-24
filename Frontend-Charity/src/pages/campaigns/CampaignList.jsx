import { useEffect, useState } from 'react';
import { fetchCampaigns } from '../../api/campaigns';
import CampaignCard from '../../components/campaigns/CampaignCard';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchCampaigns();
        setCampaigns(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Campaigns</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {campaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
      </div>
    </div>
  );
};

export default CampaignList;
