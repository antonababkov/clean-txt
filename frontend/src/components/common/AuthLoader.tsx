import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMe } from "../../store/slices/authSlice";
import LoadingSpinner from "./LoadingSpinner";

interface AuthLoaderProps {
  children: React.ReactNode;
}

const AuthLoader = ({ children }: AuthLoaderProps) => {
  const dispatch = useAppDispatch();
  const { accessToken, isLoadingUser } = useAppSelector((state) => state.auth);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (accessToken) {
      // Если есть токен, загружаем пользователя
      dispatch(fetchMe()).finally(() => {
        setInitialized(true);
      });
    } else {
      // Если токена нет, сразу считаем инициализацию завершённой
      setInitialized(true);
    }
  }, [accessToken, dispatch]);

  // Если инициализация не завершена, показываем спиннер
  if (!initialized) {
    return <LoadingSpinner />;
  }

  // Если токен есть, но пользователь ещё грузится (дополнительная защита)
  if (accessToken && isLoadingUser) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default AuthLoader;
