import React, { useState } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { reportProject } from "../store/slices/projectSlice";
import { toast } from "react-toastify";

const JobList = ({ jobs, onApplyClick, myQuotations = [] }) => {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [reason, setReason] = useState("");

  // 🔽 New state for description modal
  const [descModalOpen, setDescModalOpen] = useState(false);
  const [descJob, setDescJob] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleReportClick = (job) => {
    setSelectedJob(job);
    setReason("");
    setReportModalOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason before submitting.");
      return;
    }

    try {
      await dispatch(
        reportProject({
          projectId: selectedJob._id,
          reason,
          token: user.token,
        })
      ).unwrap();

      toast.success("Job reported successfully!");
      setReportModalOpen(false);
    } catch (err) {
      toast.error("Failed to report the job.");
    }
  };

  if (!jobs || jobs.length === 0) return <p>No jobs available</p>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => {
          const alreadyApplied = myQuotations?.some((quote) => {
            const jobId =
              typeof quote.jobId === "string" ? quote.jobId : quote.jobId?._id;
            return jobId === job._id;
          });

          return (
            <div
              key={job._id}
              className="bg-white rounded-lg shadow p-4 flex flex-col justify-between relative"
            >
              {alreadyApplied && (
                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  Applied
                </div>
              )}

              {job.image && (
                <img
                  src={job.image}
                  alt={job.title}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {job.title}
                </h3>

                {/* ✅ Shortened Description + More button */}
                <p className="text-gray-600 mb-2">
                  {job.description.length > 150
                    ? `${job.description.slice(0, 30)}...`
                    : job.description}
                  {job.description.length > 150 && (
                    <button
                      onClick={() => {
                        setDescJob(job);
                        setDescModalOpen(true);
                      }}
                      className="ml-2 text-blue-600 underline text-sm hover:text-blue-800"
                    >
                      More
                    </button>
                  )}
                </p>

                <p className="text-sm text-gray-700">
                  <strong>Budget:</strong> ₹{job.budget}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Timeline:</strong> {job.timeline || "Not specified"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Location:</strong> {job.location || "Remote"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Skills:</strong>{" "}
                  {Array.isArray(job.skillsRequired)
                    ? job.skillsRequired.join(", ")
                    : job.skillsRequired}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Posted on:{" "}
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => onApplyClick(job)}
                  disabled={alreadyApplied}
                  className={`w-full ${
                    alreadyApplied
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {alreadyApplied ? "Applied" : "Apply"}
                </Button>
                <Button
                  onClick={() => handleReportClick(job)}
                  className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  Report
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🟥 Report Modal */}
      <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)}>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">
            Report Job: {selectedJob?.title}
          </h2>
          <textarea
            className="w-full border rounded p-2 mb-4"
            placeholder="Enter reason for reporting..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setReportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSubmitReport}
            >
              Submit Report
            </Button>
          </div>
        </div>
      </Modal>

      {/* 🟦 Bigger, Clean Modal for Description */}
      <Modal isOpen={descModalOpen} onClose={() => setDescModalOpen(false)}>
        <div className="p-6 w-full max-w-3xl bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {descJob?.title}
          </h2>

          <div className="max-h-80 overflow-y-auto mb-4 p-3 border rounded bg-gray-50 text-gray-700 whitespace-pre-line leading-relaxed">
            {descJob?.description}
          </div>

          {/* Other details neatly aligned */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <p>
              <strong>💰 Budget:</strong> ₹{descJob?.budget}
            </p>
            <p>
              <strong>📅 Timeline:</strong> {descJob?.timeline}
            </p>
            <p>
              <strong>📍 Location:</strong> {descJob?.location}
            </p>
            <p className="col-span-full">
              <strong>🛠 Skills:</strong>{" "}
              {Array.isArray(descJob?.skillsRequired)
                ? descJob.skillsRequired.join(", ")
                : descJob?.skillsRequired}
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setDescModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default JobList;
