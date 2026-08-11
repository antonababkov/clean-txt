import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => dispatch(logout());

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md dark:bg-gray-800">
      <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
        CleanText
      </Link>
      <div className="flex items-center space-x-4">
        {token ? (
          <>
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:underline"
            >
              Дашборд
            </Link>
            <Link
              to="/new"
              className="text-gray-700 dark:text-gray-300 hover:underline"
            >
              Новая очистка
            </Link>
            <Link
              to="/history"
              className="text-gray-700 dark:text-gray-300 hover:underline"
            >
              История
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-700 dark:text-gray-300 hover:underline"
              >
                Админка
              </Link>
            )}
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-white bg-red-500 rounded cursor-pointer hover:bg-red-600"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-300 hover:underline"
            >
              Вход
            </Link>
            <Link
              to="/register"
              className="text-gray-700 dark:text-gray-300 hover:underline"
            >
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
