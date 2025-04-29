import React from 'react';

const DonorDashboard = () => {
  const handlePayment = async () => {
    const amount = 500; // Donation amount in rupees

    // Call your backend to create an order
    const res = await fetch('http://localhost:8000/api/create-order/', {  // Adjust URL if needed
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    });

    const data = await res.json();

    const options = {
      key: data.razorpay_key, // Your Razorpay public key
      amount: data.amount * 100, // Amount in paise
      currency: data.currency,
      name: 'Charity Crowdfunding Platform',
      description: 'Thank you for your generous donation!',
      order_id: data.order_id,
      handler: function (response) {
        alert('Payment Successful!');
        console.log('Payment success response:', response);
      },
      prefill: {
        name: "Donor Name",
        email: "donor@example.com",
        contact: "9876543210"
      },
      theme: {
        color: "#38a169"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Donor Dashboard</h1>

      {/* Some other dashboard sections */}

      <div className="flex justify-center mt-8">
        <button
          onClick={handlePayment}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-lg"
        >
          Donate ₹500
        </button>
      </div>
    </div>
  );
};

export default DonorDashboard;
