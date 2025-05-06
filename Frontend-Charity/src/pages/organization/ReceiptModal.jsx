import React from 'react';

const ReceiptModal = ({ receipt, onClose }) => {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-2xl font-semibold text-green-600 mb-4 text-center">🎉 Payment Successful!</h2>
        
        <div className="text-sm space-y-2">
          <p><strong>Donor:</strong> {receipt.donor_name}</p>
          <p><strong>Campaign:</strong> {receipt.campaign_name}</p>
          <p><strong>Amount:</strong> ₹{receipt.amount}</p>
          <p><strong>Order ID:</strong> {receipt.order_id}</p>
          <p><strong>Payment ID:</strong> {receipt.payment_id}</p>
          <p><strong>Status:</strong> <span className="text-green-500 font-medium">{receipt.status}</span></p>
          <p><strong>Date:</strong> {receipt.date}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ReceiptModal;
