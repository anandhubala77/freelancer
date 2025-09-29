import React from "react";

const PaymentDetailsModal = ({ payment, onClose }) => {
  if (!payment) return null;

  // Close modal when clicking outside the modal box
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex justify-center items-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Payment Details</h2>
        <div className="text-sm space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Amount:</span>
            <span className="text-blue-600 font-semibold">₹{payment.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold
              ${payment.status === "completed"
                ? "bg-green-100 text-green-700"
                : payment.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
              }`}>
              {payment.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span>{new Date(payment.paidAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Razorpay Payment ID:</span>
            <span className="break-all">{payment.razorpayPaymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Sender:</span>
            <span>{payment.paidBy?.name} <span className="text-gray-500">({payment.paidBy?.email})</span></span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Receiver:</span>
            <span>{payment.paidTo?.name} <span className="text-gray-500">({payment.paidTo?.email})</span></span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Project:</span>
            <span>{payment.jobId?.title || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Quotation ID:</span>
            <span>{payment.quotationId || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;