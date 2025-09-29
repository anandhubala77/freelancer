import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getReceivedPayments,
  getSentPayments,
} from "../store/slices/paymentSlice";

const Payment = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { receivedPayments, sentPayments, loading } = useSelector(
    (state) => state.payment
  );
  const [tab, setTab] = useState("received");

  useEffect(() => {
    if (user?._id) {
      dispatch(getReceivedPayments(user._id));
      dispatch(getSentPayments(user._id));
    }
  }, [user, dispatch]);

  const currentPayments = tab === "received" ? receivedPayments : sentPayments;

  const total = currentPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            tab === "received" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("received")}
        >
          Received Payments
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "sent" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("sent")}
        >
          Sent Payments
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2">
        💰 {tab === "received" ? "Received" : "Sent"} Payments
      </h2>
      <p className="mb-4 text-gray-700 font-medium">
        Total: ₹{total.toLocaleString()}
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : currentPayments.length === 0 ? (
        <p>No {tab} payments available.</p>
      ) : (
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Payment ID</th>
              <th className="p-2">Date</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Project</th>
              <th className="p-2">{tab === "received" ? "Client" : "Freelancer"}</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{p.razorpayPaymentId}</td>
                <td className="p-2">{new Date(p.paidAt).toLocaleDateString()}</td>
                <td className="p-2">₹{p.amount}</td>
                <td className="p-2">{p.jobId?.title || "N/A"}</td>
                <td className="p-2">
                  {tab === "received"
                    ? p.paidBy?.name || "Client"
                    : p.paidTo?.name || "Freelancer"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Payment;




