import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  // Prevent logged-in users from accessing login/register pages
  return !user ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoutes;
