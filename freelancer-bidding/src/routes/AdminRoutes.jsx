import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";

const AdminRoutes = () => {
  // Retrieve token and role from sessionStorage
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));

  // Check if the user is authenticated and has the 'admin' role
  if (!token || user?.role !== "admin") {
    return <Navigate to="/Login" replace />;
  }

  return (
    <div className="flex h-screen ">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto h-full p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminRoutes;
