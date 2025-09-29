import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProjects,
  adminDeleteProject,
  selectAdminProjects,
  getAdminProjectsStatus,
  getAdminProjectsError,
  selectAdminProjectsPagination,
} from "../store/slices/adminProjectSlice";
import { MdSearch, MdFilterList, MdSort, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "../components/Pagination";

const ManageProjects = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectAdminProjects) || [];
  const status = useSelector(getAdminProjectsStatus);
  const error = useSelector(getAdminProjectsError);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { currentPage, totalPages, limit } = useSelector(selectAdminProjectsPagination);
  const [page, setPage] = useState(currentPage || 1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    dispatch(
      fetchAllProjects({ page, limit, q: debouncedSearch, sortBy, sortOrder })
    );
  }, [dispatch, page, limit, debouncedSearch, sortBy, sortOrder]);

  const filtered = projects; // server-side filtered & sorted

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(adminDeleteProject(id))
        .unwrap()
        .then(() => toast.success("Project deleted successfully"))
        .catch(() => toast.error("Failed to delete project"));
    }
  };

  return (
    <div className="w-full px-2 py-4 sm:px-4 md:px-6 lg:px-8 min-h-screen bg-gray-50">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Manage Projects</h1>

      {/* Search Bar and Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6">
        <div className="relative w-full sm:w-auto flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MdSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="w-full sm:w-auto flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort By</label>
          <select
            className="px-3 py-2 border rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Created</option>
            <option value="title">Title</option>
            <option value="budget">Budget</option>
          </select>
        </div>
        <button
          className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
          onClick={() => setSortOrder((p) => (p === "asc" ? "desc" : "asc"))}
        >
          <MdSort className="inline-block mr-1" />
          {sortOrder === "asc" ? "Asc" : "Desc"}
        </button>
      </div>

      {/* Loading/Error Messages */}
      {status === "loading" && <p>Loading projects…</p>}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}

      {/* Table */}
      {status === "succeeded" && (
        <div className="bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto">
          <table className="min-w-[800px] w-full text-xs sm:text-sm text-left">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-2 px-2 text-left">Title</th>
                <th className="py-2 px-2 text-left">Budget</th>
                <th className="py-2 px-2 text-left">Status</th>
                <th className="py-2 px-2 text-left">Reports</th>
                <th className="py-2 px-2 text-left">Posted By</th>
                <th className="py-2 px-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((proj) => (
                <tr key={proj._id} className="border-b hover:bg-blue-50 transition">
                  <td className="py-3 px-2 break-words max-w-[180px] font-medium text-gray-800">{proj.title}</td>
                  <td className="py-3 px-2 text-blue-700 font-semibold">₹{proj.budget}</td>
                  <td className="py-3 px-2 capitalize">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      proj.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : proj.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : proj.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-200 text-gray-700"
                    }`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">{proj.reports?.length || 0}</td>
                  <td className="py-3 px-2 break-words max-w-[120px]">
                    {proj.userId?.name} {proj.userId?.lastName}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleDelete(proj._id)}
                        className="text-red-500 hover:text-red-600 flex items-center gap-1"
                        aria-label="Delete"
                      >
                        <MdDelete size={20} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ManageProjects;