import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAppSelector((state) => state.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default PrivateRoute;
