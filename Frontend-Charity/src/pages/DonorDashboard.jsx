import React, { useState, useEffect } from 'react';
import ReceiptModal from './organization/ReceiptModal';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const DonorDashboard = () => {
  const [amount, setAmount] = useState(500);
  const [receiptData, setReceiptData] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleAmountChange = (e) => setAmount(e.target.value);

  const handlePayment = async () => {
    const campaignID = localStorage.getItem('selectedCampaignId');
    if (!campaignID) return alert("No campaign selected.");
    if (amount <= 0 || isNaN(amount)) return alert("Enter valid amount.");

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/donate/donations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('access')
        },
        body: JSON.stringify({ amount, campaign: campaignID })
      });

      const data = await res.json();
      if (!data.razorpay_key) {
        alert("Razorpay key missing.");
        setLoading(false);
        return;
      }

      const options = {
        key: data.razorpay_key,
        amount: data.amount,
        currency: data.currency,
        name: 'Charity Crowdfunding Platform',
        description: 'Thank you for your donation!',
        order_id: data.order_id,
        handler: async (response) => {
          try {
            const verifyRes = await fetch('http://localhost:8000/donate/verify/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: data.order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donation_id: data.donation_id
              })
            });

            const verifyData = await verifyRes.json();
            console.log("Response data", verifyData);

            if (verifyRes.ok && verifyData.receipt) {
              setReceiptData(verifyData.receipt);
              setShowReceipt(true);
            } else {
              alert('Payment verified but receipt missing or verification failed.');
            }
          } catch (err) {
            console.error("Verification error", err);
            alert("Verification error");
          } finally {
            setLoading(false);
          }
        },
        theme: { color: "#38a169" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Error while initiating payment.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-green-800 drop-shadow">
        Welcome to the Donor Dashboard
      </h1>

      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
          Make a Donation
        </h2>

        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-medium">
            Donation Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            min="1"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Enter Donation Amount"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handlePayment}
            disabled={loading}
            className={`px-6 py-3 text-white font-semibold rounded-xl shadow-md transition-all duration-200 
              ${loading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? 'Processing...' : `Donate ₹${amount}`}
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Secure payments powered by Razorpay
        </div>
      </div>

      {showReceipt && receiptData && (
        <ReceiptModal
          receipt={receiptData}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default DonorDashboard;
