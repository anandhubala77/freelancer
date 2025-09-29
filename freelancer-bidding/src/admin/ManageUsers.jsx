import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  deleteUser,
  selectAllUsers,
} from "../store/slices/adminUserSlice";
import {
  MdDelete,
  MdSearch,
  MdSort,
  MdContentCopy,
} from "react-icons/md";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import { selectAdminUsersPagination } from "../store/slices/adminUserSlice";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const { currentPage, totalPages, limit } = useSelector(selectAdminUsersPagination);
  const [page, setPage] = useState(currentPage || 1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // reset to first page on new search or sort change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortOrder]);

  useEffect(() => {
    dispatch(
      fetchAllUsers({ page, limit, q: debouncedSearch, sortBy: "createdAt", sortOrder })
    );
  }, [dispatch, page, limit, debouncedSearch, sortOrder]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id))
        .unwrap()
        .then(() => toast.success("User deleted successfully"))
        .catch(() => toast.error("Failed to delete user"));
    }
  };

  const filteredUsers = users; // now server-side filtered and sorted

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="w-full px-2 py-4 sm:px-4 md:px-6 lg:px-8 min-h-screen bg-gray-50">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Manage Users</h1>

      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search by ID, name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MdSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button
          onClick={toggleSort}
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 justify-center"
        >
          <MdSort />
          Sort by Date {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto">
        <table className="min-w-[800px] w-full text-xs sm:text-sm text-left">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2">User ID</th>
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Email</th>
              <th className="py-2 px-2">Role</th>
              <th className="py-2 px-2">Registered</th>
              <th className="py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, index) => (
              <tr key={u._id} className="border-b hover:bg-blue-50 transition">
                <td className="py-3 px-2">{index + 1}</td>
                <td className="py-3 px-2 text-xs text-gray-700 break-all select-text">
                  <div className="flex items-center gap-2">
                    <span>{u._id}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(u._id);
                        toast.success("User ID copied!");
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <MdContentCopy size={16} />
                    </button>
                  </div>
                </td>
                <td className="py-3 px-2 break-words max-w-[120px]">
                  {u.name} {u.lastName}
                </td>
                <td className="py-3 px-2 break-all max-w-[160px]">{u.email}</td>
                <td className="py-3 px-2 capitalize">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    u.role === "admin"
                      ? "bg-blue-100 text-blue-700"
                      : u.role === "jobseeker"
                      ? "bg-purple-100 text-purple-700"
                      : u.role === "hiring"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-2">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-red-500 hover:text-red-600"
                    title="Delete user"
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default ManageUsers;