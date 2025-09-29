import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchApplicationsByHiringPerson,
  selectAllApplications,
  selectApplicationsStatus,
  selectApplicationsError,
  updateApplicationStatus,
  reportJobSeeker, // ✅ NEW
} from "../store/slices/applicationSlice";
import { toast, ToastContainer } from "react-toastify";
import Modal from "../components/Modal";

const ApplicationsTab = () => {
  const dispatch = useDispatch();
  const hiringPerson = useSelector((state) => state.auth.user);
  const hiringPersonId = hiringPerson?._id;

  const applications = useSelector(selectAllApplications);
  const status = useSelector(selectApplicationsStatus);
  const error = useSelector(selectApplicationsError);

  const [selectedUser, setSelectedUser] = useState(null);
  const [reportingUser, setReportingUser] = useState(null);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    if (hiringPersonId) {
      dispatch(fetchApplicationsByHiringPerson(hiringPersonId));
    }
  }, [dispatch, hiringPersonId]);

  const handleUpdateStatus = (id, newStatus) => {
    dispatch(updateApplicationStatus({ id, status: newStatus }))
      .unwrap()
      .then(() => toast.success(`Application ${newStatus}`))
      .catch((err) => toast.error(`Update failed: ${err}`))
      .finally(() => dispatch(fetchApplicationsByHiringPerson(hiringPersonId)));
  };

  const handleViewDetails = (user) => setSelectedUser(user);
  const closeModal = () => setSelectedUser(null);

  const handleReportSubmit = async () => {
    try {
      await dispatch(
        reportJobSeeker({
          userId: reportingUser._id,
          reason: reportReason,
          token: hiringPerson.token,
        })
      ).unwrap();
      toast.success("Reported user successfully");
      setReportingUser(null);
      setReportReason("");
    } catch (err) {
      toast.error(err || "Failed to report user");
    }
  };

  return (
    <div>
      {status === "loading" && <p>Loading applications...</p>}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      {status === "succeeded" && applications.length === 0 && (
        <p>No applications submitted yet.</p>
      )}

      {status === "succeeded" &&
        applications.map((app) => (
          <div
            key={app._id}
            className="bg-gray-100 p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="text-lg font-semibold">
              {app.jobId?.title || "No Title"}
            </h3>
            <p>
              Job Seeker: {app.userId?.name || "Unknown"} | Status:{" "}
              <span className="capitalize font-semibold">{app.status}</span>
            </p>
            <p className="mb-2">Proposal: {app.message}</p>
            {/* {app.submission?.link && (
              <div className="mt-2 bg-white p-3 border rounded">
                <p className="font-semibold text-gray-700">
                  🔗 Submitted Work:
                </p>
                <p>
                  Link:{" "}
                  <a
                    href={app.submission.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {app.submission.link}
                  </a>
                </p>
                <p className="text-sm mt-1 text-gray-800">
                  Message: {app.submission.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Submitted at:{" "}
                  {new Date(app.submission.submittedAt).toLocaleString()}
                </p>
              </div>
            )} */}

            {app.status === "pending" && (
              <div className="flex gap-2 mb-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => handleUpdateStatus(app._id, "accepted")}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleUpdateStatus(app._id, "rejected")}
                >
                  Reject
                </button>
              </div>
            )}

            <div className="flex gap-4 text-sm">
              <button
                onClick={() => handleViewDetails(app.userId)}
                className="text-blue-600 hover:underline"
              >
                More Details
              </button>
              <button
                onClick={() => setReportingUser(app.userId)}
                className="text-red-500 hover:underline"
              >
                Report Spam
              </button>
            </div>
          </div>
        ))}

      {/* Modal for User Details */}
      {selectedUser && (
        <Modal isOpen={true} onClose={closeModal}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Job Seeker Details</h2>
            <p>
              <strong>Name:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>Skills:</strong>{" "}
              {selectedUser.skills?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Experience:</strong>
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {Array.isArray(selectedUser.experience) &&
              selectedUser.experience.length > 0 ? (
                selectedUser.experience.map((exp, index) => (
                  <li key={index}>
                    <strong>{exp.title}</strong> at <em>{exp.company}</em>
                    <br />
                    {exp.startDate} - {exp.endDate}
                    <br />
                    {exp.description}
                  </li>
                ))
              ) : (
                <li>No experience data</li>
              )}
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Modal for Reporting */}
      {reportingUser && (
        <Modal isOpen={true} onClose={() => setReportingUser(null)}>
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Report Job Seeker</h2>
            <p className="mb-2">
              Reporting: <strong>{reportingUser.name}</strong>
            </p>
            <textarea
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter reason for reporting..."
              rows="4"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReportingUser(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Submit Report
              </button>
            </div>
          </div>
        </Modal>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ApplicationsTab;
