
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApplicationsByJobSeeker,
  submitCompletedWork,
} from "../store/slices/applicationSlice";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import Button from "../components/Button";

const SubmittedWork = () => {
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

  const handleResubmitWork = async () => {
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

      toast.success("Work re-submitted successfully.");
      setSelectedApp(null);
    } catch (err) {
      console.log("❌ error re-submitting:", err);
      toast.error("Failed to re-submit work.");
    }
  };

  const submittedApplications = applications?.filter(
    (app) => app.status === "accepted" && app.submission?.link
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Completed/Submitted Works</h2>
      {submittedApplications.length === 0 ? (
        <p>You haven’t submitted any work yet.</p>
      ) : (
        submittedApplications.map((app) => (
          <div
            key={app._id}
            className="bg-white rounded p-4 mb-4 shadow border"
          >
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {app.jobId?.title || "Untitled"}
              {app.correctionRequest?.requestedAt &&
                new Date(app.submission?.submittedAt) >
                  new Date(app.correctionRequest.requestedAt) && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Re-submitted
                  </span>
                )}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Submitted Link:{" "}
              <a
                href={app.submission?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {app.submission?.link}
              </a>
            </p>
            <p className="text-gray-700 mb-2">
              Message: {app.submission?.message}
            </p>
            <Button variant="primary" onClick={() => setSelectedApp(app)}>
              Re-Submit Work
            </Button>
          </div>
        ))
      )}

      <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Re-Submit Work</h3>
          <input
            className="w-full border rounded p-2 mb-2"
            type="url"
            placeholder="Updated Project Link"
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
          />
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={4}
            placeholder="Update message to client..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setSelectedApp(null)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleResubmitWork}>
              Re-Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubmittedWork;



// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchApplicationsByJobSeeker,
//   submitCompletedWork,
// } from "../store/slices/applicationSlice";
// import { toast } from "react-toastify";
// import Modal from "../components/Modal";
// import Button from "../components/Button";

// const SubmittedWork = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const applications = useSelector((state) => state.application.applications);

//   const [selectedApp, setSelectedApp] = useState(null);
//   const [projectLink, setProjectLink] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (user?.role === "jobseeker") {
//       dispatch(fetchApplicationsByJobSeeker());
//     }
//   }, [dispatch, user]);

//   const handleResubmitWork = async () => {
//     if (!projectLink || !message) {
//       toast.error("Both fields are required.");
//       return;
//     }

//     try {
//       await dispatch(
//         submitCompletedWork({
//           quotationId: selectedApp._id,
//           link: projectLink,
//           message,
//           token: user.token,
//         })
//       ).unwrap();

//       toast.success("Work re-submitted successfully.");
//       setSelectedApp(null);
//     } catch (err) {
//       console.log("❌ error re-submitting:", err);
//       toast.error("Failed to re-submit work.");
//     }
//   };

//   const submittedApplications = applications?.filter(
//     (app) => app.status === "accepted" && app.submission?.link
//   );

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Completed/Submitted Works</h2>
//       {submittedApplications.length === 0 ? (
//         <p>You haven’t submitted any work yet.</p>
//       ) : (
//         submittedApplications.map((app) => (
//           <div
//             key={app._id}
//             className="bg-white rounded p-4 mb-4 shadow border"
//           >
//             <h3 className="font-semibold text-lg">
//               {app.jobId?.title || "Untitled"}
//             </h3>
//             <p className="text-sm text-gray-600 mb-2">
//               Submitted Link:{" "}
//               <a
//                 href={app.submission?.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 underline"
//               >
//                 {app.submission?.link}
//               </a>
//             </p>
//             <p className="text-gray-700 mb-2">
//               Message: {app.submission?.message}
//             </p>

//             {/* ✅ Show correction request if exists */}
//             {app.correctionRequest?.message && (
//               <div className="bg-yellow-100 border-l-4 border-yellow-600 text-yellow-900 p-3 rounded mb-3">
//                 <p className="font-semibold">Correction Requested:</p>
//                 <p className="text-sm">{app.correctionRequest.message}</p>
//                 <p className="text-xs text-gray-600 mt-1">
//                   Requested at:{" "}
//                   {new Date(app.correctionRequest.requestedAt).toLocaleString()}
//                 </p>
//               </div>
//             )}

//             <Button variant="primary" onClick={() => setSelectedApp(app)}>
//               Re-Submit Work
//             </Button>
//           </div>
//         ))
//       )}

//       <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)}>
//         <div className="p-4">
//           <h3 className="text-lg font-semibold mb-2">Re-Submit Work</h3>
//           <input
//             className="w-full border rounded p-2 mb-2"
//             type="url"
//             placeholder="Updated Project Link"
//             value={projectLink}
//             onChange={(e) => setProjectLink(e.target.value)}
//           />
//           <textarea
//             className="w-full border rounded p-2 mb-2"
//             rows={4}
//             placeholder="Update message to client..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <div className="flex justify-end gap-3">
//             <Button variant="secondary" onClick={() => setSelectedApp(null)}>
//               Cancel
//             </Button>
//             <Button variant="success" onClick={handleResubmitWork}>
//               Re-Submit
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default SubmittedWork;




// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchApplicationsByJobSeeker,
//   submitCompletedWork,
// } from "../store/slices/applicationSlice";
// import { toast } from "react-toastify";
// import Modal from "../components/Modal";
// import Button from "../components/Button";

// const SubmittedWork = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const applications = useSelector((state) => state.application.applications);

//   const [selectedApp, setSelectedApp] = useState(null);
//   const [projectLink, setProjectLink] = useState("");
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (user?.role === "jobseeker") {
//       dispatch(fetchApplicationsByJobSeeker());
//     }
//   }, [dispatch, user]);

//   const handleResubmitWork = async () => {
//     if (!projectLink || !message) {
//       toast.error("Both fields are required.");
//       return;
//     }

//     try {
//       await dispatch(
//         submitCompletedWork({
//           quotationId: selectedApp._id,
//           link: projectLink,
//           message,
//           token: user.token,
//         })
//       ).unwrap();

//       toast.success("Work re-submitted successfully.");
//       setSelectedApp(null);
//     } catch (err) {
//       console.log("❌ error re-submitting:", err);
//       toast.error("Failed to re-submit work.");
//     }
//   };

//   const submittedApplications = applications?.filter(
//     (app) => app.status === "accepted" && app.submission?.link
//   );

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Completed/Submitted Works</h2>
//       {submittedApplications.length === 0 ? (
//         <p>You haven’t submitted any work yet.</p>
//       ) : (
//         submittedApplications.map((app) => (
//           <div
//             key={app._id}
//             className="bg-white rounded p-4 mb-4 shadow border"
//           >
//             <h3 className="font-semibold text-lg">
//               {app.jobId?.title || "Untitled"}
//             </h3>
//             <p className="text-sm text-gray-600 mb-2">
//               Submitted Link:{" "}
//               <a
//                 href={app.submission?.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 underline"
//               >
//                 {app.submission?.link}
//               </a>
//             </p>
//             <p className="text-gray-700 mb-2">Message: {app.submission?.message}</p>
//             <Button variant="primary" onClick={() => setSelectedApp(app)}>
//               Re-Submit Work
//             </Button>
//           </div>
//         ))
//       )}

//       <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)}>
//         <div className="p-4">
//           <h3 className="text-lg font-semibold mb-2">Re-Submit Work</h3>
//           <input
//             className="w-full border rounded p-2 mb-2"
//             type="url"
//             placeholder="Updated Project Link"
//             value={projectLink}
//             onChange={(e) => setProjectLink(e.target.value)}
//           />
//           <textarea
//             className="w-full border rounded p-2 mb-2"
//             rows={4}
//             placeholder="Update message to client..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <div className="flex justify-end gap-3">
//             <Button variant="secondary" onClick={() => setSelectedApp(null)}>
//               Cancel
//             </Button>
//             <Button variant="success" onClick={handleResubmitWork}>
//               Re-Submit
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default SubmittedWork;
