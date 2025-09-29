import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApplicationsByJobSeeker,
  selectJobSeekerApplications,
  selectApplicationsStatus,
} from "../store/slices/applicationSlice";

const MyApplications = () => {
  const dispatch = useDispatch();
  const jobSeeker = useSelector((state) => state.auth.user);
  const applications = useSelector(selectJobSeekerApplications);
  const status = useSelector(selectApplicationsStatus);

  useEffect(() => {
    if (jobSeeker?._id) {
      dispatch(fetchApplicationsByJobSeeker(jobSeeker._id));
    }
  }, [dispatch, jobSeeker]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Job Applications</h2>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>You haven't applied for any jobs yet.</p>
      ) : (
        applications.map((app) => (
          <div
            key={app._id}
            className="bg-white p-4 rounded shadow mb-3 border"
          >
            <h3 className="text-lg font-semibold">
              {app.jobId?.title || "No Title"}
            </h3>
            <p>Status:{" "}
              <span
                className={`font-semibold capitalize ${
                  app.status === "accepted"
                    ? "text-green-600"
                    : app.status === "rejected"
                    ? "text-red-500"
                    : "text-yellow-600"
                }`}
              >
                {app.status}
              </span>
            </p>
            <p>Message: {app.message}</p>
            {app.status === "rejected" && (
              <p className="text-red-500 font-semibold mt-1">
                ❌ Your application was rejected.
              </p>
            )}
            {app.status === "accepted" && (
              <p className="text-green-600 font-semibold mt-1">
                ✅ Your application has been accepted!
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyApplications;
