import React, { useEffect, useRef } from "react";
import {
  FaUsers,
  FaFolder,
  FaShieldAlt,
  FaUserTie,
  FaUser,
  FaUserCircle,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardMetrics } from "../store/slices/adminDashboardSlice";
import Loader from "../components/Loader";
import Error from "../components/Error";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const statusColors = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  active: "bg-blue-100 text-blue-700",
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { metrics, loading, error } = useSelector(
    (state) => state.adminDashboard
  );
  const contentRef = useRef(null);

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
  }, [dispatch]);

  useEffect(() => {
    const scrollPosition = localStorage.getItem("adminDashboardScroll");
    if (scrollPosition && contentRef.current) {
      contentRef.current.scrollTop = parseInt(scrollPosition);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (contentRef.current) {
        localStorage.setItem(
          "adminDashboardScroll",
          contentRef.current.scrollTop.toString()
        );
      }
    };
  }, []);

  const metricsData = [
    {
      title: "Total Users",
      value: metrics?.totalUsers ?? 0,
      icon: FaUsers,
      color: "bg-indigo-600",
    },
    {
      title: "Total Projects",
      value: metrics?.totalProjects ?? 0,
      icon: FaFolder,
      color: "bg-green-600",
    },
    {
      title: "Fraud Reports",
      value: metrics?.fraudReports ?? 0,
      icon: FaShieldAlt,
      color: "bg-red-600",
    },
    {
      title: "Job Seekers",
      value: metrics?.jobSeekers ?? 0,
      icon: FaUser,
      color: "bg-purple-600",
    },
    {
      title: "Hiring Persons",
      value: metrics?.hiringPersons ?? 0,
      icon: FaUserTie,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div
      ref={contentRef}
      className="w-full px-2 py-4 sm:px-4 md:px-6 lg:px-8 overflow-y-auto min-h-screen bg-gray-50"
    >
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base">
            Export Data
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base">
            Generate Report
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Error message={error} />
      ) : (
        <>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {metricsData.map((metric, index) => (
              <div
                key={index}
                className={`p-4 rounded shadow-md flex items-center ${metric.color} text-white hover:shadow-lg transition`}
              >
                <metric.icon className="w-8 h-8 mr-4" />
                <div>
                  <h3 className="text-xl font-bold">{metric.value}</h3>
                  <p className="text-sm">{metric.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Projects and Users */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Projects */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-4 text-gray-700">
                Recent Projects
              </h2>
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto">
                {metrics?.recentProjects?.length > 0 ? (
                  metrics.recentProjects.map((project, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg border hover:shadow transition bg-gray-50"
                    >
                      <FaFolder className="w-8 h-8 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {project.title}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs mt-1">
                          <span className="flex items-center gap-1 text-gray-600">
                            <FaMoneyBillWave className="inline-block" /> ₹
                            {project.budget}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-medium ${
                              statusColors[project.status] ||
                              "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No recent projects.</p>
                )}
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold mb-4 text-gray-700">
                Recent Users
              </h2>
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto">
                {metrics?.recentUsers?.filter((user) => user.role !== "admin")
                  ?.length > 0 ? (
                  metrics.recentUsers
                    .filter((user) => user.role !== "admin") // ✅ Filter out admins
                    .map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-lg border hover:shadow transition bg-gray-50"
                      >
                        <FaUserCircle className="w-8 h-8 text-indigo-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {user.name} {user.lastName}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded-full font-medium text-xs ${
                              user.role === "jobseeker"
                                ? "bg-purple-100 text-purple-700"
                                : user.role === "hiring"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-sm">No new users.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Bids */}
          <div className="bg-white rounded-lg shadow p-4 mt-8">
            <h2 className="text-lg font-bold mb-4 text-gray-700">
              Recent Bids
            </h2>
            <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto">
              {metrics?.recentBids?.length > 0 ? (
                metrics.recentBids.map((bid, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:shadow transition bg-gray-50"
                  >
                    <FaCheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {bid.jobId?.title || "Unknown Project"}
                      </p>
                      <div className="text-xs text-gray-600 mt-1">
                        Bid: ₹{bid.bidAmount} by {bid.userId?.name || "Unknown"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent bids.</p>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-lg shadow p-4 mt-8">
            <h2 className="text-lg font-bold mb-4 text-gray-700">
              Recent Payments
            </h2>
            <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto">
              {metrics?.recentPayments?.length > 0 ? (
                metrics.recentPayments.map((payment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:shadow transition bg-gray-50"
                  >
                    <FaMoneyBillWave className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {payment.jobId?.title || "Unknown Project"}
                      </p>
                      <div className="text-xs text-gray-600 mt-1">
                        ₹{payment.amount} paid by{" "}
                        {payment.paidBy?.name || "Unknown"} to{" "}
                        {payment.paidTo?.name || "Unknown"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent payments.</p>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {/* Monthly Payments Chart */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold text-gray-700 mb-4">
                Monthly Payments
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={metrics?.monthlyPayments || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#10B981" name="Amount (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Yearly Payments Chart */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-bold text-gray-700 mb-4">
                Yearly Payments
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={metrics?.yearlyPayments || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#6366F1" name="Amount (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
