import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getReceivedPayments } from "../store/slices/paymentSlice";
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

const ReceivedPayments = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { receivedPayments, loading } = useSelector((state) => state.payment);

  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (user?._id) {
      dispatch(getReceivedPayments(user._id));
    }
  }, [dispatch, user]);

  const handleDownloadInvoice = (payment) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Payment Invoice", 14, 22);
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${payment._id}`, 14, 35);
    doc.text(`Payment Date: ${new Date(payment.paidAt).toLocaleString()}`, 14, 43);
    doc.text(`Paid By: ${payment.paidBy?.name || ""} ${payment.paidBy?.lastName || ""}`, 14, 51);
    doc.text(`Project: ${payment.jobId?.title || "N/A"}`, 14, 59);
    doc.text(`Amount: ₹${payment.amount}`, 14, 67);
    doc.save(`invoice_${payment._id}.pdf`);
  };

  const filteredPayments = useMemo(() => {
    return [...receivedPayments]
      .filter((p) =>
        p.jobId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((p) => {
        const paidAt = new Date(p.paidAt).setHours(0, 0, 0, 0);
        const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
        const to = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;
        return (!from || paidAt >= from) && (!to || paidAt <= to);
      })
      .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));
  }, [receivedPayments, searchTerm, fromDate, toDate]);

  // 📊 Group by month and calculate totals
  const earningsByMonth = useMemo(() => {
    const map = {};

    filteredPayments.forEach((p) => {
      const date = new Date(p.paidAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + p.amount;
    });

    return Object.entries(map).map(([month, total]) => ({
      month,
      total,
    }));
  }, [filteredPayments]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">💰 Received Payments</h2>

      {/* 🔍 Search + Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by project title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1 border rounded w-full sm:w-60"
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="px-3 py-1 border rounded w-full sm:w-40"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="px-3 py-1 border rounded w-full sm:w-40"
        />
      </div>

      {/* 📊 Earnings Chart */}
      {earningsByMonth.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">📈 Monthly Earnings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Bar dataKey="total" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 📋 Payment Table */}
      {loading ? (
        <p>Loading...</p>
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
                <th className="p-3">Paid By</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => (
                <tr key={payment._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-mono text-xs text-blue-600">
                    {payment.razorpayPaymentId || "Manual"}
                  </td>
                  <td className="p-3">
                    {new Date(payment.paidAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-semibold text-green-700">
                    ₹{payment.amount}
                  </td>
                  <td className="p-3">{payment.jobId?.title || "N/A"}</td>
                  <td className="p-3">
                    {payment.paidBy?.name || ""} {payment.paidBy?.lastName || ""}
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
              <tr className="bg-gray-100 font-semibold">
                <td className="p-3" colSpan="3">
                  Total
                </td>
                <td className="p-3 text-green-700">
                  ₹
                  {filteredPayments.reduce((sum, p) => sum + p.amount, 0)}
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

export default ReceivedPayments;
