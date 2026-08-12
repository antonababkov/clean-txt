import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const authLinks = (
    <>
      <Link
        to="/"
        onClick={closeMenu}
        className="block transition-colors hover:text-blue-400"
      >
        Дашборд
      </Link>
      <Link
        to="/new"
        onClick={closeMenu}
        className="block transition-colors hover:text-blue-400"
      >
        Новая очистка
      </Link>
      <Link
        to="/history"
        onClick={closeMenu}
        className="block transition-colors hover:text-blue-400"
      >
        История
      </Link>
      {user?.role === "admin" && (
        <Link
          to="/admin"
          onClick={closeMenu}
          className="block transition-colors hover:text-blue-400"
        >
          Админка
        </Link>
      )}
    </>
  );

  return (
    <nav className="p-4 text-white bg-gray-800 shadow-md">
      <div className="container flex items-center justify-between mx-auto">
        {/* Логотип */}
        <Link
          to="/"
          className="text-xl font-bold transition-colors hover:text-gray-300"
        >
          CleanText
        </Link>

        {/* Десктопное меню */}
        <div className="items-center hidden space-x-6 md:flex">
          {token ? (
            <>
              {authLinks}
              <button
                onClick={handleLogout}
                className="px-3 py-1 transition-colors bg-red-500 rounded hover:bg-red-600"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="transition-colors hover:text-blue-400"
              >
                Вход
              </Link>
              <Link
                to="/register"
                className="transition-colors hover:text-blue-400"
              >
                Регистрация
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>

        {/* Гамбургер-иконка (только на мобильных) */}
        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="p-2 ml-4 transition-colors rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Меню"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Мобильное меню (выпадающее) */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-start pt-4 pb-2 mt-2 space-y-3 border-t border-gray-700">
          {token ? (
            <>
              {authLinks}
              <button
                onClick={handleLogout}
                className="w-full px-3 py-2 text-left transition-colors bg-red-500 rounded hover:bg-red-600"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="block w-full transition-colors hover:text-blue-400"
              >
                Вход
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="block w-full transition-colors hover:text-blue-400"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
