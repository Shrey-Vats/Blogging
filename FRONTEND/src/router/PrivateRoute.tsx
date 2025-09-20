import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hook/AuthProvider";

function PrivateRoute() {
  const { isAuthenticated } = useAuth();

  // Use Navigate component instead of imperative navigation
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
