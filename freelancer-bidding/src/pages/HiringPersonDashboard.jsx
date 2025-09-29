// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
// import JobCard from "../components/JobCard";
// import JobPostingForm from "../components/JobPostingForm";
// import Modal from "../components/Modal";
// import Button from "../components/Button";
// import UserLayout from "../layout/UserLayout";
// import { toast } from "react-toastify"; // Assuming you use react-toastify
// import "react-toastify/dist/ReactToastify.css";
// import ApplicationsTab from "../pages/ApplicationsTab"; // Assuming you have an ApplicationTab component
// import { selectAllApplications } from "../store/slices/applicationSlice";

// import { getJobSeekerById, sendHireRequest } from "../store/slices/hireSlice";

// import {
//   createProject,
//   updateProject,
//   deleteProject, // You'll want to dispatch this for actual deletion
//   fetchProjects, // To load all jobs from DB
//   selectAllProjects,
//   getProjectsStatus,
//   getProjectsError,
//   clearProjectStatus,
// } from "../store/slices/projectSlice"; // Adjust the import path as necessary
// import CompletedProjects from "./CompletedProjects";
// import SentPayment from "../components/Sentpayment";
// import ActiveApplication from "../components/ActiveApplication";

// const HiringPersonDashboard = () => {
//   const dispatch = useDispatch();
//   const applications = useSelector(selectAllApplications);

//   const jobs = useSelector(selectAllProjects);
//   const projectsStatus = useSelector(getProjectsStatus);
//   const projectsError = useSelector(getProjectsError);

//   const [isPosting, setIsPosting] = useState(false);
//   const [editingJob, setEditingJob] = useState(null);
//   const [activeTab, setActiveTab] = useState("posted");
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [paymentHistory, setPaymentHistory] = useState([]); // This might also need Redux later

//   const [showHireModal, setShowHireModal] = useState(false);
//   const [jobToHire, setJobToHire] = useState(null);
//   const [jobSeekerInfo, setJobSeekerInfo] = useState(null);

//   useEffect(() => {
//     if (
//       projectsStatus === "idle" ||
//       projectsStatus === "succeeded" ||
//       projectsStatus === "failed"
//     ) {
//       dispatch(fetchProjects());
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (projectsStatus === "succeeded") {
//       if (isPosting && editingJob === null) {
//         toast.success("Project posted successfully!");
//       } else if (editingJob !== null) {
//         toast.success("Project updated successfully!");
//       }
//       setIsPosting(false); // Close the modal
//       setEditingJob(null); // Clear editing state
//       dispatch(clearProjectStatus()); // Reset status
//     } else if (projectsStatus === "failed") {
//       toast.error(`Error: ${projectsError}`);
//       dispatch(clearProjectStatus());
//     }
//   }, [projectsStatus, projectsError, dispatch, isPosting, editingJob]);

//   const handlePostJob = (jobData) => {
//     console.log("Dispatching createProject with data:", jobData); // Add this log
//     dispatch(createProject(jobData));
//   };

//   // const handleEditJob = (jobData) => {
//   //   console.log("Dispatching updateProject with data:", jobData); // Add this log
//   //   dispatch(
//   //     updateProject({
//   //       projectId: jobData._id || jobData.id,
//   //       updatedData: jobData,
//   //     })
//   //   );
//   // };

//   const handleEditJob = ({ projectId, updatedData }) => {
//     dispatch(updateProject({ projectId, updatedData }));
//   };

//   const handleDeleteJob = (jobId) => {
//     console.log("Dispatching deleteProject for ID:", jobId); // Add this log
//     dispatch(deleteProject(jobId));
//   };

//   const handleHireJobSeeker = async (jobId, freelancerId) => {
//     if (!jobId || !freelancerId) {
//       console.error("Missing job ID or freelancer ID", { jobId, freelancerId });
//       return;
//     }

//     setJobToHire({ jobId, freelancerId });
//     dispatch(getJobSeekerById(freelancerId))
//       .unwrap()
//       .then((data) => {
//         setJobSeekerInfo(data); // <-- this was missing
//         setShowHireModal(true);
//       });
//     dispatch(getJobSeekerById(freelancerId))
//       .unwrap()
//       .then(() => {
//         setShowHireModal(true);
//       })
//       .catch((err) => {
//         toast.error("Failed to load job seeker: " + err);
//       });
//   };

//   const handleConfirmHire = () => {
//     if (jobToHire) {
//       dispatch(sendHireRequest(jobToHire))
//         .unwrap()
//         .then(() => {
//           toast.success("Hire request sent successfully");
//           setShowHireModal(false);
//           setJobToHire(null);
//         })
//         .catch(() => {
//           toast.error("Failed to send hire request");
//         });
//     }
//   };

//   const handleMakePayment = (jobId, amount) => {
//     setPaymentHistory((prev) => [
//       ...prev,
//       {
//         jobId,
//         amount,
//         date: new Date().toISOString(),
//         status: "pending",
//       },
//     ]);
//   };

//   const handleSubmissionAction = (submissionId, action) => {
//     dispatch(updateSubmissionStatus({ submissionId, status: action }))
//       .unwrap()
//       .then(() => toast.success(`Marked as ${action}`))
//       .catch((err) => toast.error("Failed to update status"));
//   };

//   const jobTabs = [
//     { id: "posted", label: "Posted Jobs" },
//     { id: "active", label: "Active Projects" },
//     { id: "completed", label: "Completed Projects" },
//     { id: "payments", label: "Payment History" },
//     { id: "applications", label: "Applications" },
//   ];

//   return (
//     <UserLayout userRole="hiring">
//       <div className="max-w-6xl mx-auto px-4">
//         {/* Header Section */}
//         <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
//             <div className="mb-4 sm:mb-0">
//               <h1 className="text-xl sm:text-2xl font-bold">
//                 Hiring Dashboard
//               </h1>
//             </div>

//             <Button
//               onClick={() => {
//                 setIsPosting(true);
//                 setEditingJob(null);
//               }}
//               variant="primary"
//             >
//               Post New Job
//             </Button>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="bg-white shadow-md rounded-lg mb-6 sm:mb-8">
//           <div className="border-b">
//             <nav className="-mb-px flex flex-wrap" aria-label="Tabs">
//               {jobTabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`px-3 sm:px-4 py-2 sm:py-4 text-sm font-medium ${
//                     activeTab === tab.id
//                       ? "border-b-2 border-blue-500 text-blue-600"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
//           {activeTab === "posted" && (
//             <div>
//               <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
//                 Posted Jobs
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                 {jobs
//                   .filter((job) => job.status === "posted")
//                   .map((job) => (
//                     <JobCard
//                       key={job._id}
//                       job={job}
//                       onEdit={() => {
//                         setEditingJob(job);
//                         setIsPosting(true);
//                       }}
//                       onDelete={() => handleDeleteJob(job._id)}
//                       onHire={handleHireJobSeeker}
//                       status="posted"
//                     />
//                   ))}
//                 <div></div>
//                 {/* Display loading/error states */}
//                 {projectsStatus === "loading" && <p>Loading jobs...</p>}
//                 {projectsStatus === "failed" && (
//                   <p className="text-red-500">
//                     Error loading jobs: {projectsError}
//                   </p>
//                 )}
//                 {projectsStatus === "succeeded" && jobs.length === 0 && (
//                   <p>No jobs posted yet.</p>
//                 )}
//               </div>
//             </div>
//           )}

//           {activeTab === "active" && <ActiveApplication />}

//           {activeTab === "completed" && <CompletedProjects />}

//           {activeTab === "payments" && (
//             <div>
//               <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
//                 payment
//               </h2>
//               <SentPayment />
//             </div>
//           )}
//         </div>

//         {activeTab === "applications" && (
//           <div>
//             <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
//               Job Applications
//             </h2>
//             <ApplicationsTab />
//           </div>
//         )}

//         {/* Modals */}
//         <Modal isOpen={isPosting} onClose={() => setIsPosting(false)}>
//           <div className="p-4 sm:p-6">
//             <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//               {editingJob ? "Edit Job" : "Post New Job"}
//             </h2>
//             <JobPostingForm
//               onSubmit={editingJob ? handleEditJob : handlePostJob}
//               job={editingJob}
//             />
//           </div>
//         </Modal>

//         <Modal
//           isOpen={selectedJob !== null}
//           onClose={() => setSelectedJob(null)}
//         >
//           <div className="p-4 sm:p-6">
//             <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//               Project Details
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-semibold">{selectedJob?.title}</h3>
//                 <p className="text-sm text-gray-600">
//                   {selectedJob?.description}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600">
//                   Budget: ${selectedJob?.budget}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Status: {selectedJob?.status}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </Modal>
//       </div>

//       <Modal isOpen={showHireModal} onClose={() => setShowHireModal(false)}>
//         <div className="p-4 sm:p-6">
//           <h2 className="text-xl font-bold mb-4">Hire Freelancer</h2>

//           {jobSeekerInfo ? (
//             <div className="space-y-3 mb-6">
//               <p>
//                 <strong>Name:</strong> {jobSeekerInfo.name}
//               </p>
//               <p>
//                 <strong>Email:</strong> {jobSeekerInfo.email}
//               </p>
//               <p>
//                 <strong>Skills:</strong> {jobSeekerInfo.skills?.join(", ")}
//               </p>
//               <p>
//                 <strong>Experience:</strong> {jobSeekerInfo.experience}
//               </p>
//             </div>
//           ) : (
//             <p>Loading job seeker info...</p>
//           )}

//           <Button
//             onClick={() => {
//               dispatch(
//                 sendHireRequest({
//                   receiverId: jobSeekerInfo._id,
//                   jobId: jobToHire.jobId,
//                   message: "We would like to hire you for this project.",
//                 })
//               )
//                 .unwrap()
//                 .then(() => {
//                   toast.success("Hire request sent successfully");
//                   setShowHireModal(false);
//                 })
//                 .catch((err) => {
//                   toast.error("Failed to send hire request");
//                 });
//             }}
//             variant="primary"
//           >
//             Confirm Hire
//           </Button>
//         </div>
//       </Modal>
//     </UserLayout>
//   );
// };

// export default HiringPersonDashboard;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import JobCard from "../components/JobCard";
import JobPostingForm from "../components/JobPostingForm";
import Modal from "../components/Modal";
import Button from "../components/Button";
import UserLayout from "../layout/UserLayout";
import { toast } from "react-toastify"; // Assuming you use react-toastify
import "react-toastify/dist/ReactToastify.css";
import ApplicationsTab from "../pages/ApplicationsTab"; // Assuming you have an ApplicationTab component
import { selectAllApplications } from "../store/slices/applicationSlice";

import { getJobSeekerById, sendHireRequest } from "../store/slices/hireSlice";

import {
  createProject,
  updateProject,
  deleteProject,
  fetchProjects,
  selectAllProjects,
  getProjectsStatus,
  getProjectsError,
  clearProjectStatus,
  selectProjectPagination,
} from "../store/slices/projectSlice";

import CompletedProjects from "./CompletedProjects";
import SentPayment from "../components/Sentpayment";
import ActiveApplication from "../components/ActiveApplication";
import ChatLauncher from "../components/ChatLauncher";

const HiringPersonDashboard = () => {
  const dispatch = useDispatch();
  const applications = useSelector(selectAllApplications);

  const jobs = useSelector(selectAllProjects);
  const projectsStatus = useSelector(getProjectsStatus);
  const projectsError = useSelector(getProjectsError);

  const [isPosting, setIsPosting] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [activeTab, setActiveTab] = useState("posted");
  const [selectedJob, setSelectedJob] = useState(null);

  const [showHireModal, setShowHireModal] = useState(false);
  const [jobToHire, setJobToHire] = useState(null);
  const [jobSeekerInfo, setJobSeekerInfo] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 6;
  const { currentPage = 1, totalPages = 1 } = useSelector(selectProjectPagination) || {};

  useEffect(() => {
    dispatch(fetchProjects({ page, limit }));
  }, [dispatch, page]);

  useEffect(() => {
    if (projectsStatus === "succeeded") {
      if (isPosting && editingJob === null) {
        toast.success("Project posted successfully!");
      } else if (editingJob !== null) {
        toast.success("Project updated successfully!");
      }
      setIsPosting(false);
      setEditingJob(null);
      dispatch(clearProjectStatus());
    } else if (projectsStatus === "failed") {
      toast.error(`Error: ${projectsError}`);
      dispatch(clearProjectStatus());
    }
  }, [projectsStatus, projectsError, dispatch, isPosting, editingJob]);

  const handlePostJob = (jobData) => {
    dispatch(createProject(jobData));
  };

  const handleEditJob = ({ projectId, updatedData }) => {
    dispatch(updateProject({ projectId, updatedData }));
  };

  const handleDeleteJob = (jobId) => {
    dispatch(deleteProject(jobId));
  };

  const handleHireJobSeeker = async (jobId, freelancerId) => {
    setJobToHire({ jobId, freelancerId });
    dispatch(getJobSeekerById(freelancerId))
      .unwrap()
      .then((data) => {
        setJobSeekerInfo(data);
        setShowHireModal(true);
      })
      .catch((err) => {
        toast.error("Failed to load job seeker: " + err);
      });
  };

 



  const jobTabs = [
    { id: "posted", label: "Posted Jobs" },
    { id: "active", label: "Active Projects" },
    { id: "completed", label: "Completed Projects" },
    { id: "payments", label: "Payment History" },
    { id: "applications", label: "Applications" },
  ];

  return (
    <UserLayout userRole="hiring">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl sm:text-2xl font-bold">Hiring Dashboard</h1>
            </div>
            <Button
              onClick={() => {
                setIsPosting(true);
                setEditingJob(null);
              }}
              variant="primary"
            >
              Post New Job
            </Button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg mb-6 sm:mb-8">
          <div className="border-b">
            <nav className="-mb-px flex flex-wrap" aria-label="Tabs">
              {jobTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 sm:py-4 text-sm font-medium ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          {activeTab === "posted" && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                Posted Jobs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {jobs
                  .filter((job) => job.status === "posted")
                  .map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onEdit={() => {
                        setEditingJob(job);
                        setIsPosting(true);
                      }}
                      onDelete={() => handleDeleteJob(job._id)}
                      onHire={handleHireJobSeeker}
                      status="posted"
                    />
                  ))}
              </div>
              <div className="flex justify-between mt-6">
                <Button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                <Button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {activeTab === "active" && <ActiveApplication />}

          {activeTab === "completed" && <CompletedProjects />}

          {activeTab === "payments" && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                payment
              </h2>
              <SentPayment />
            </div>
          )}
        </div>

        {activeTab === "applications" && (
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
              Job Applications
            </h2>
            <ApplicationsTab />
          </div>
        )}

        <Modal isOpen={isPosting} onClose={() => setIsPosting(false)}>
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              {editingJob ? "Edit Job" : "Post New Job"}
            </h2>
            <JobPostingForm
              onSubmit={editingJob ? handleEditJob : handlePostJob}
              job={editingJob}
            />
          </div>
        </Modal>

        <Modal isOpen={selectedJob !== null} onClose={() => setSelectedJob(null)}>
          <div className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Project Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{selectedJob?.title}</h3>
                <p className="text-sm text-gray-600">{selectedJob?.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Budget: ${selectedJob?.budget}</p>
                <p className="text-sm text-gray-600">Status: {selectedJob?.status}</p>
              </div>
            </div>
          </div>
        </Modal>

        <Modal isOpen={showHireModal} onClose={() => setShowHireModal(false)}>
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4">Hire Freelancer</h2>
            {jobSeekerInfo ? (
              <div className="space-y-3 mb-6">
                <p><strong>Name:</strong> {jobSeekerInfo.name}</p>
                <p><strong>Email:</strong> {jobSeekerInfo.email}</p>
                <p><strong>Skills:</strong> {jobSeekerInfo.skills?.join(", ")}</p>
                <p><strong>Experience:</strong> {jobSeekerInfo.experience}</p>
              </div>
            ) : (
              <p>Loading job seeker info...</p>
            )}
            <Button
              onClick={() => {
                dispatch(
                  sendHireRequest({
                    receiverId: jobSeekerInfo._id,
                    jobId: jobToHire.jobId,
                    message: "We would like to hire you for this project.",
                  })
                )
                  .unwrap()
                  .then(() => {
                    toast.success("Hire request sent successfully");
                    setShowHireModal(false);
                  })
                  .catch((err) => {
                    toast.error("Failed to send hire request");
                  });
              }}
              variant="primary"
            >
              Confirm Hire
            </Button>
          </div>
        </Modal>
      </div>
      <ChatLauncher />
    </UserLayout>
  );
};

export default HiringPersonDashboard;
