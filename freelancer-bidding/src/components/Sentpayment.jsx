import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSentPayments } from "../store/slices/paymentSlice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const SentPayment = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sentPayments, loading } = useSelector((state) => state.payment);

  const [searchTitle, setSearchTitle] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchSentPayments(user._id));
    }
  }, [user, dispatch]);

  const handleDownloadInvoice = (payment) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Payment Invoice", 14, 22);

    doc.setFontSize(12);
    doc.text(`Invoice ID: ${payment._id}`, 14, 35);
    doc.text(`Payment Date: ${new Date(payment.paidAt).toLocaleString()}`, 14, 43);
    doc.text(`Paid To: ${payment.paidTo?.name || ""} ${payment.paidTo?.lastName || ""}`, 14, 51);
    doc.text(`Project: ${payment.jobId?.title || "N/A"}`, 14, 59);
    doc.text(`Amount: ₹${payment.amount}`, 14, 67);

    doc.save(`invoice_${payment._id}.pdf`);
  };

  // 🔍 Filter logic
  const filteredPayments = useMemo(() => {
    return [...sentPayments]
      .filter((payment) =>
        payment.jobId?.title?.toLowerCase().includes(searchTitle.toLowerCase())
      )
      .filter((payment) => {
        const paidAt = new Date(payment.paidAt).setHours(0, 0, 0, 0);
        const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
        const to = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;
        return (!from || paidAt >= from) && (!to || paidAt <= to);
      })
      .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));
  }, [sentPayments, searchTitle, fromDate, toDate]);

  // 📊 Prepare chart data grouped by month
  const chartData = useMemo(() => {
    const grouped = {};

    filteredPayments.forEach((payment) => {
      const date = new Date(payment.paidAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      grouped[key] = (grouped[key] || 0) + payment.amount;
    });

    return Object.entries(grouped).map(([month, total]) => ({
      month,
      total,
    }));
  }, [filteredPayments]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📤 Sent Payments</h2>

      {/* 🔍 Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search by project title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="border px-2 py-1 rounded w-full sm:w-60"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border px-2 py-1 rounded w-full sm:w-40"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border px-2 py-1 rounded w-full sm:w-40"
        />
        <button
          onClick={() => {
            setSearchTitle("");
            setFromDate("");
            setToDate("");
          }}
          className="text-sm text-blue-600 underline"
        >
          Reset Filters
        </button>
      </div>

      {/* 📊 Chart */}
      {chartData.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">📈 Monthly Sent Payments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Bar dataKey="total" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 📋 Payment Table */}
      {loading ? (
        <p>Loading payments...</p>
      ) : filteredPayments.length === 0 ? (
        <p>No matching payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Project</th>
                <th className="p-3">Paid To</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => (
                <tr key={payment._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-mono text-xs text-blue-600">
                    {payment.razorpayPaymentId || "Manual Entry"}
                  </td>
                  <td className="p-3">
                    {new Date(payment.paidAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-semibold text-green-700">
                    ₹{payment.amount/100}
                  </td>
                  <td className="p-3">{payment.jobId?.title || "N/A"}</td>
                  <td className="p-3">
                    {payment.paidTo?.name || ""} {payment.paidTo?.lastName || ""}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDownloadInvoice(payment)}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Download Invoice
                    </button>
                  </td>
                </tr>
              ))}

              {/* Total */}
              <tr className="font-semibold bg-gray-100">
                <td className="p-3" colSpan="3">
                  Total
                </td>
                <td className="p-3 text-green-700">
                  ₹
                  {filteredPayments.reduce((sum, p) => sum + p.amount/100, 0)}
                </td>
                <td colSpan="3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SentPayment;
