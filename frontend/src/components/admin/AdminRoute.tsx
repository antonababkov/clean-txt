import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import LoadingSpinner from "../common/LoadingSpinner";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { accessToken, user, isLoadingUser } = useAppSelector(
    (state) => state.auth,
  );

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (isLoadingUser) {
    return <LoadingSpinner />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
