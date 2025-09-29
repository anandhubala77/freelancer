import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchApplicationsByHiringPerson,
  selectAllApplications,
  selectApplicationsStatus,
  selectApplicationsError,
} from "../store/slices/applicationSlice";

const ActiveApplication = () => {
  const dispatch = useDispatch();
  const hiringPersonId = useSelector((state) => state.auth.user?._id);
  const applications = useSelector(selectAllApplications);
  const status = useSelector(selectApplicationsStatus);
  const error = useSelector(selectApplicationsError);

  useEffect(() => {
    if (hiringPersonId) {
      dispatch(fetchApplicationsByHiringPerson(hiringPersonId));
    }
  }, [dispatch, hiringPersonId]);

  const filteredApplications = applications.filter(
    (app) => app.status === "accepted" && !app.submission
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">✅ Accepted Projects (Not Yet Submitted)</h2>

      {status === "loading" && <p>Loading applications...</p>}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}

      {status === "succeeded" && filteredApplications.length === 0 && (
        <p>No accepted projects pending submission.</p>
      )}

      {status === "succeeded" &&
        filteredApplications.map((app) => (
          <div
            key={app._id}
            className="bg-gray-100 p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="text-lg font-semibold">
              {app.jobId?.title || "No Title"}
            </h3>
            <p className="mb-1">
              Job Seeker: {app.userId?.name || "Unknown"}
            </p>
            <p className="mb-1">
              Proposal: {app.message}
            </p>
            <p className="text-yellow-600 font-semibold">
              Submission pending...
            </p>
          </div>
        ))}
    </div>
  );
};

export default ActiveApplication;
