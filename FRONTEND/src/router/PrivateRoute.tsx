import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/AuthProvider";

function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/sign-in');
  }

  return <Outlet/>;
}

export default PrivateRoute;
