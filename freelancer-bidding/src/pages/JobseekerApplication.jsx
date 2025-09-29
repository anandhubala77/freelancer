import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApplicationsByJobSeeker,
  withdrawApplication,
  selectAllApplications,
  selectApplicationsStatus,
  selectApplicationsError,
} from "../store/slices/applicationSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobSeekerApplications = () => {
  const dispatch = useDispatch();

  const applications = useSelector(selectAllApplications);
  const status = useSelector(selectApplicationsStatus);
  const error = useSelector(selectApplicationsError);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === "jobseeker") {
      dispatch(fetchApplicationsByJobSeeker());
    }
  }, [dispatch, user]);

  const handleWithdraw = async (id) => {
    if (!user?.token) {
      toast.error("User not authenticated");
      return;
    }

    try {
      await dispatch(withdrawApplication({ id, token: user.token })).unwrap();
      toast.success("Application withdrawn successfully");
    } catch (err) {
      toast.error("Failed to withdraw application");
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "accepted":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-300",
          emoji: "🟢",
        };
      case "pending":
        return {
          bg: "bg-orange-100",
          text: "text-orange-800",
          border: "border-orange-300",
          emoji: "🟡",
        };
      case "withdrawn":
        return {
          bg: "bg-gray-200",
          text: "text-gray-800",
          border: "border-gray-300",
          emoji: "⚪",
        };
      case "rejected":
      default:
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-300",
          emoji: "🔴",
        };
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Applications</h2>

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      {status === "succeeded" && applications.length === 0 && (
        <p>You haven’t applied to any jobs yet.</p>
      )}

      {status === "succeeded" &&
        applications.map((app) => {
          const { bg, text, border, emoji } = getStatusStyles(app.status);

          return (
            <div
              key={app._id}
              className={`rounded p-4 mb-3 shadow border ${bg} ${text} ${border}`}
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-semibold">
                  {app.jobId?.title || "No Title"}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${text} ${bg} border ${border}`}
                >
                  {emoji} {app.status}
                </span>
              </div>
              <p className="text-sm font-medium">Bid: ₹{app.bidAmount}</p>
              <p className="text-sm mb-2">Message: {app.message}</p>

              {app.status === "pending" && (
                <button
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleWithdraw(app._id)}
                >
                  Withdraw
                </button>
              )}
            </div>
          );
        })}

      <ToastContainer />
    </div>
  );
};

export default JobSeekerApplications;
