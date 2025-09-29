import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoutes = () => {
  const token = sessionStorage.getItem("token");
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  // Redirect to the correct login page
  if (!token) {
    return <Navigate to={isAdminRoute ? "/admin/login" : "/login"} />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
