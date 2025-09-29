import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendReportResponse,
  clearResponseStatus,
} from "../store/slices/adminFraudSlice";
import { toast } from "react-toastify";

const SendResponseForm = ({ report, onClose }) => {
  const dispatch = useDispatch();
  const { responseLoading } = useSelector((state) => state.adminFraud);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.trim().length < 10) {
      toast.error("Message must be at least 10 characters.");
      return;
    }

    try {
      await dispatch(
        sendReportResponse({
          reportType: report.type,
          reportId: report.reportId,
          responseMessage: message,
        })
      ).unwrap();

      toast.success("Response sent successfully.");
      dispatch(clearResponseStatus());
      onClose(); // Close modal
    } catch (err) {
      toast.error("Failed to send message.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Respond to Fraud Report</h2>
      <p className="text-sm text-gray-600">
        <strong>To:</strong> {report.reportedBy} ({report.type})
      </p>
      <textarea
        rows="4"
        className="w-full p-2 border rounded text-sm"
        placeholder="Type your response message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={responseLoading}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {responseLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
};

export default SendResponseForm;
