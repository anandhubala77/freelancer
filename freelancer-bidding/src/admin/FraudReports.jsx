import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaFilter, FaSortUp } from "react-icons/fa";
import {
  fetchFraudReports,
  sendReportResponse,
  clearResponseStatus,
  selectAdminFraudPagination,
} from "../store/slices/adminFraudSlice";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import { toast } from "react-toastify";

const FraudReports = () => {
  const dispatch = useDispatch();
  const { reports, loading, error, responseLoading } = useSelector(
    (state) => state.adminFraud
  );
  const { currentPage, totalPages, limit } = useSelector(selectAdminFraudPagination);
  const [page, setPage] = useState(currentPage || 1);
  const [respondedOnly, setRespondedOnly] = useState(false);
  const [from, setFrom] = useState(""); // yyyy-mm-dd
  const [to, setTo] = useState("");   // yyyy-mm-dd

  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    dispatch(fetchFraudReports({ page, limit, respondedOnly, from, to }));
  }, [dispatch, page, limit, respondedOnly, from, to]);

  // reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [respondedOnly, from, to]);

  const openResponseModal = (report) => {
    setSelectedReport(report);
    setResponseText(report.responseMessage || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReport(null);
    setResponseText("");
  };

  const handleSendResponse = async () => {
    if (responseText.trim().length < 10) {
      toast.error("Message must be at least 10 characters.");
      return;
    }

    try {
      await dispatch(
        sendReportResponse({
          reportType: selectedReport.type,
          reportId: selectedReport.reportId,
          responseMessage: responseText,
        })
      ).unwrap();

      toast.success("Response sent successfully.");
      dispatch(clearResponseStatus());
      closeModal();
    } catch (err) {
      toast.error("Failed to send response.");
    }
  };

  return (
    <div className="w-full px-2 py-4 sm:px-4 md:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        Fraud Reports
      </h1>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3 mb-6">
        <div className="flex items-center gap-2">
          <input
            id="respondedOnly"
            type="checkbox"
            checked={respondedOnly}
            onChange={(e) => setRespondedOnly(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="respondedOnly" className="text-sm text-gray-700">
            Show responded only
          </label>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-2 border rounded"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-2 border rounded"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[700px] w-full text-xs sm:text-sm text-left">
          <thead className="border-b bg-gray-100">
            <tr>
              <th className="p-4">Type</th>
              <th className="p-4">Context</th>
              <th className="p-4">IDs</th>
              <th className="p-4">Reported By</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4" colSpan="6">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td className="p-4 text-red-500" colSpan="6">
                  {error}
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-500" colSpan="6">
                  No reports found.
                </td>
              </tr>
            ) : (
              reports.map((report, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 text-xs font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        report.type === "project"
                          ? "bg-blue-500"
                          : "bg-orange-500"
                      }`}
                    >
                      {report.type}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-800">
                    {report.type === "project" ? (
                      <div className="space-y-1">
                        <div className="font-semibold">{report.projectTitle || "—"}</div>
                        <div className="text-gray-600">
                          Owner: {report.projectOwnerName || "—"}
                          {report.projectOwnerEmail && (
                            <span className="ml-1 text-gray-500">({report.projectOwnerEmail})</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="font-semibold">{report.reportedUserName || "—"}</div>
                        <div className="text-gray-600">
                          Email: {report.reportedUserEmail || "—"}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-4 break-all text-[10px] sm:text-xs text-gray-800">
                    <div className="space-y-1">
                      {report.type === "project" ? (
                        <>
                          <div>
                            <span className="font-semibold">Project:</span> {report.fraudProjectId}
                          </div>
                        </>
                      ) : (
                        <div>
                          <span className="font-semibold">User:</span> {report.reportedUserId}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold">Reported By:</span> {report.reportedByUserId}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 break-all text-xs text-gray-800">
                    <div>
                      {report.reportedByName || "—"}
                      {report.reportedByEmail && (
                        <span className="ml-1 text-gray-500">({report.reportedByEmail})</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 max-w-[200px] break-words text-xs">
                    {report.reason || "—"}
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                    {report.responseAt && (
                      <div className="text-xs text-green-700 mt-1">
                        Responded: {new Date(report.responseAt).toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="p-4 flex flex-col sm:flex-row gap-2">
                    {!!report.responseMessage ? (
                      <div className="flex flex-col text-xs text-green-700">
                        <span className="font-semibold text-green-800">
                          ✅ Response already sent
                        </span>
                        <span className="italic text-gray-800 mt-1">
                          {report.responseMessage}
                        </span>
                        {report.responseAt && (
                          <span className="text-gray-500 text-xs mt-1">
                            Responded on{" "}
                            {new Date(report.responseAt).toLocaleString()}
                          </span>
                        )}
                        <button
                          onClick={() => openResponseModal(report)}
                          className="mt-1 text-blue-600 hover:underline text-xs"
                        >
                          Edit Response
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openResponseModal(report)}
                        className="text-blue-600 text-xs hover:underline"
                      >
                        Respond
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />

      {/* Modal */}
      <Modal isOpen={showModal} onClose={closeModal}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Respond to Fraud Report
          </h2>
          <p className="text-sm text-gray-600">
            <strong>To:</strong> {selectedReport?.reportedBy} ({selectedReport?.type})
          </p>
          <textarea
            rows="4"
            className="w-full p-2 border rounded text-sm"
            placeholder="Type your response message here..."
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendResponse}
              disabled={responseLoading}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              {responseLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FraudReports;
