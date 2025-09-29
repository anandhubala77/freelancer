import React, { useEffect, useState } from "react";
import { QuotationForm } from "../components/QuotationForm";
import Modal from "../components/Modal";
import Button from "../components/Button";
import UserLayout from "../layout/UserLayout";
import UpdateProfile from "./UpdateProfile";
import { useDispatch, useSelector } from "react-redux";
import JobList from "./JobList";
import { fetchJobs, selectJobsPagination } from "../store/slices/jobSlice";
import { submitQuotation } from "../store/slices/quotationSlice";
import { toast, ToastContainer } from "react-toastify";
import JobSeekerApplication from "./JobseekerApplication";
import SubmittedWork from "./SubmittedWork";
import UnsubmittedWorks from "./UnsubmittedWorks";
import ReceivedPayments from "./RecivedPayment";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { fetchMyQuotations } from "../store/slices/quotationSlice";
import Pagination from "../components/Pagination";
import ChatLauncher from "../components/ChatLauncher";


const JobSeekerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: jobs, loading, error } = useSelector((state) => state.jobs);
  const { currentPage, totalPages } = useSelector(selectJobsPagination);
  const [page, setPage] = useState(currentPage || 1);
  const limit = 10;
  const { user } = useSelector((state) => state.auth);
  const { myQuotations } = useSelector((state) => state.quotation);


  const [selectedJob, setSelectedJob] = useState(null);
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("available");
  const [hasSubmitted, setHasSubmitted] = useState(false); // Set to true when submission is done


  // Search and Sort State
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date"); // "date" or "price"
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"

  useEffect(() => {
    if (user?.role === "jobseeker" && user?.token) {
      dispatch(fetchJobs({ token: user.token, page, limit }));
      dispatch(fetchMyQuotations(user.token));
    }
  }, [dispatch, user, page]);

  const handleSubmitQuote = async (quoteData) => {
    try {
      await dispatch(
        submitQuotation({
          quoteData: {
            ...quoteData,
            jobId: selectedJob._id,
          },
          token: user.token,
        })
      ).unwrap();

      toast.success("Quotation submitted successfully! 🎉");
      setSelectedJob(null);
    } catch (err) {
      toast.error("Failed to submit quotation ❌");
      console.error(err);
    }
  };

  const handleOpenUpdateProfileModal = () => {
    setShowUpdateProfileModal(true);
    setShowMobileMenu(false);
  };

  const handleCloseUpdateProfileModal = () => {
    setShowUpdateProfileModal(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout successful");
    navigate("/login");
    setShowMobileMenu(false);
  };

  // Tab Content Renderer
  const renderTabContent = () => {
    if (activeTab === "available") {
      if (loading)
        return (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-blue-600 font-medium">
              Loading jobs...
            </span>
          </div>
        );
      if (error)
        return (
          <div className="flex justify-center items-center py-12">
            <span className="text-red-600 font-medium">{error}</span>
          </div>
        );

      // Filter and Sort
      let filteredJobs = jobs.filter((job) => {
        const searchLower = search.toLowerCase();
      
        const titleMatch = job.title?.toLowerCase().includes(searchLower);
        const locationMatch = job.location?.toLowerCase().includes(searchLower);
      
        const skillsMatch = Array.isArray(job.skillsRequired)
          ? job.skillsRequired.some((skill) =>
              skill?.toLowerCase().includes(searchLower)
            )
          : false;
      
        return titleMatch || locationMatch || skillsMatch;
      });
      
      filteredJobs = filteredJobs.sort((a, b) => {
        if (sortBy === "date") {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortBy === "price") {
          return sortOrder === "asc"
            ? a.budget - b.budget
            : b.budget - a.budget;
        }
        return 0;
      });

      return (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Available Jobs
          </h2>
          {/* Search and Sort Controls */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex flex-1 min-w-0">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by project name, skill, or location..."
                className="w-full px-4 py-2 border border-blue-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={() => {}}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition text-sm"
              >
                Search
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Amount</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 hover:bg-blue-600 hover:text-white transition text-lg"
                title="Toggle sort order"
              >
                {sortOrder === "desc" ? "↓" : "↑"}
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-2 sm:p-4">
            <JobList
              jobs={filteredJobs}
              onApplyClick={setSelectedJob}
              myQuotations={myQuotations}
            />
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
        </div>
      );
    }

    if (activeTab === "applied") {
      return (
        <div className="bg-white rounded-xl shadow p-2 sm:p-4 mb-8">
          <JobSeekerApplication />
        </div>
      );
    }

    if (activeTab === "submitted") {
      return (
        <div className="bg-white rounded-xl shadow p-2 sm:p-4 mb-8">
          <UnsubmittedWorks />
        </div>
      );
    }

    if (activeTab === "completed") {
      return (
        <div className="bg-white rounded-xl shadow p-2 sm:p-4 mb-8">
          <SubmittedWork />
        </div>
      );
    }

    if (activeTab === "payments") {
      return (
        <div className="bg-white rounded-xl shadow p-2 sm:p-4 mb-8">
          <ReceivedPayments />
        </div>
      );
    }
  };

  return (
    <UserLayout userRole="jobseeker">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 text-center sm:text-left">
            Jobseeker Dashboard
          </h1>
          {/* Hide on mobile, show on sm+ */}
          <div className="hidden sm:flex flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={handleOpenUpdateProfileModal}
            >
              Update Profile
            </Button>
          </div>
        </div>

        {/* Toggle Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-6 border-b mb-6 overflow-x-auto">
          <button
            className={`pb-2 px-3 text-sm font-medium ${
              activeTab === "available"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("available")}
          >
            Available Jobs
          </button>
          <button
            className={`pb-2 px-3 text-sm font-medium ${
              activeTab === "applied"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("applied")}
          >
            Applied Jobs
          </button>
          <button
            className={`pb-2 px-3 text-sm font-medium ${
              activeTab === "submitted"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("submitted")}
          >
            Works to Submit
          </button>

          
          <button
            className={`pb-2 px-3 text-sm font-medium ${
              activeTab === "completed"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed Works
          </button>
          <Button
            className={`pb-2 px-3 text-sm font-medium ${
              activeTab === "payments"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("payments")}
          >
            Payment History
          </Button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Quotation Modal */}
        <Modal
          isOpen={selectedJob !== null}
          onClose={() => setSelectedJob(null)}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Submit Quotation</h2>
            <QuotationForm
              job={selectedJob}
              onSubmit={handleSubmitQuote}
              onCancel={() => setSelectedJob(null)}
            />
          </div>
        </Modal>

        {/* Update Profile Modal */}
        <Modal
          isOpen={showUpdateProfileModal}
          onClose={handleCloseUpdateProfileModal}
        >
          <UpdateProfile onClose={handleCloseUpdateProfileModal} />
        </Modal>
        {/* Render ChatLauncher */}
        <ChatLauncher />
      </div>
      <ToastContainer />
    </UserLayout>
  );
};

export default JobSeekerDashboard;