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
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl text-gray-800 dark:text-white">
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
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
