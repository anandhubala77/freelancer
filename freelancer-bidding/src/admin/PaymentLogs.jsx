import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminPayments, deletePayment, selectAdminPayments, selectAdminPaymentsPagination } from "../store/slices/adminPaymentSlice";
import { fetchPaymentById, clearSinglePayment } from "../store/slices/adminSinglePaymentSlice";
import { FaTrash, FaEye, FaSortUp, FaSortDown } from "react-icons/fa";
import { toast } from "react-toastify";
import PaymentDetailsModal from "../components/PaymentDetailsModal";
import Pagination from "../components/Pagination";

const PaymentLogs = () => {
  const dispatch = useDispatch();
  const payments = useSelector(selectAdminPayments);
  const { loading, error } = useSelector((state) => state.adminPayments);
  const { currentPage, totalPages, limit } = useSelector(selectAdminPaymentsPagination);
  const [page, setPage] = useState(currentPage || 1);
  const { payment, loading: detailLoading } = useSelector((state) => state.adminSinglePayment);

  const [showModal, setShowModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = newest first

  useEffect(() => {
    dispatch(fetchAdminPayments({ page, limit }));
  }, [dispatch, page, limit]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await dispatch(deletePayment(id)).unwrap();
        toast.success("Payment deleted successfully");
      } catch (err) {
        toast.error(err || "Failed to delete payment");
      }
    }
  };

  const handleView = async (id) => {
    await dispatch(fetchPaymentById(id));
    setShowModal(true);
  };

  // Sort payments by date
  const sortedPayments = [...(payments || [])].sort((a, b) => {
    const dateA = new Date(a.paidAt);
    const dateB = new Date(b.paidAt);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="w-full px-2 py-4 sm:px-4 md:px-6 lg:px-8 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Payment Logs</h1>

      {/* Sort Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
          Sort by Date {sortOrder === "asc" ? "↑" : "↓"}
        </button>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>

      {loading && <p className="text-blue-500">Loading payments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && sortedPayments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6 overflow-x-auto">
          <table className="min-w-[900px] w-full text-xs sm:text-sm text-left">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Amount</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Sender</th>
                <th className="py-2 px-2">Receiver</th>
                <th className="py-2 px-2">Project</th>
                <th className="py-2 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.map((payment) => (
                <tr key={payment._id} className="border-b hover:bg-blue-50 transition">
                  <td className="py-2 px-2">{new Date(payment.paidAt).toLocaleDateString()}</td>
                  <td className="py-2 px-2 text-blue-700 font-semibold">₹{payment.amount}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <span className="block">{payment.paidBy?.name}</span>
                    <span className="text-xs text-gray-500">{payment.paidBy?.email}</span>
                  </td>
                  <td className="py-2 px-2">
                    <span className="block">{payment.paidTo?.name}</span>
                    <span className="text-xs text-gray-500">{payment.paidTo?.email}</span>
                  </td>
                  <td className="py-2 px-2">{payment.jobId?.title || "N/A"}</td>
                  <td className="py-2 px-2 flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleView(payment._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs sm:text-sm"
                    >
                      <FaEye /> View
                    </button>
                    <button
                      onClick={() => handleDelete(payment._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs sm:text-sm"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && payments.length === 0 && (
        <p className="text-gray-500 mt-4">No payments found.</p>
      )}

      {/* Modal */}
      {showModal && payment && (
        <PaymentDetailsModal
          payment={payment}
          loading={detailLoading}
          onClose={() => {
            setShowModal(false);
            dispatch(clearSinglePayment());
          }}
        />
      )}
    </div>
  );
};

export default PaymentLogs;