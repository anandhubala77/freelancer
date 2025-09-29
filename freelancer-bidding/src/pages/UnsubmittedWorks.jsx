import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApplicationsByJobSeeker,
  submitCompletedWork,
} from "../store/slices/applicationSlice";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import Button from "../components/Button";

const UnsubmittedWorks = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const applications = useSelector((state) => state.application.applications);

  const [selectedApp, setSelectedApp] = useState(null);
  const [projectLink, setProjectLink] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.role === "jobseeker") {
      dispatch(fetchApplicationsByJobSeeker());
    }
  }, [dispatch, user]);

  const handleSubmitWork = async () => {
    if (!projectLink || !message) {
      toast.error("Both fields are required.");
      return;
    }

    try {
      await dispatch(
        submitCompletedWork({
          quotationId: selectedApp._id,
          link: projectLink,
          message,
          token: user.token,
        })
      ).unwrap();

      toast.success("Work submitted successfully.");
      setSelectedApp(null);
    } catch (err) {
      console.log("❌ error submitting:", err);
      toast.error("Failed to submit work.");
    }
  };

  const unsubmittedApplications = applications?.filter(
    (app) => app.status === "accepted" && !app.submission?.link
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pending Work Submission</h2>
      {unsubmittedApplications.length === 0 ? (
        <p>All accepted jobs have been submitted.</p>
      ) : (
        unsubmittedApplications.map((app) => (
          <div
            key={app._id}
            className="bg-white rounded p-4 mb-4 shadow border"
          >
            <h3 className="font-semibold text-lg">
              {app.jobId?.title || "Untitled"}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Your Bid: ₹{app.bidAmount}
            </p>
            <Button variant="primary" onClick={() => setSelectedApp(app)}>
              Submit Work
            </Button>
          </div>
        ))
      )}

      <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Submit Work</h3>
          <input
            className="w-full border rounded p-2 mb-2"
            type="url"
            placeholder="Project Link (e.g. GitHub or live site)"
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
          />
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={4}
            placeholder="Add message to client..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setSelectedApp(null)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleSubmitWork}>
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UnsubmittedWorks;
