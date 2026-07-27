import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  if (!accessToken) {
    // Если токена нет, перенаправляем на страницу входа
    return <Navigate to="/login" replace />;
  }

  // Если токен есть, рендерим дочерние компоненты (защищённую страницу)
  return children;
};

export default PrivateRoute;
