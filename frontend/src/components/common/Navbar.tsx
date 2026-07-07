import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { Link } from "react-router-dom";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const handleLogout = () => dispatch(logout());

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        CleanText
      </Link>
      {token ? (
        <div className="flex items-center space-x-4">
          <Link to="/new" className="hover:underline">
            Новая очистка
          </Link>
          <Link to="/history" className="hover:underline">
            История
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Выйти
          </button>
        </div>
      ) : (
        <div>
          <Link to="/login" className="mr-2 hover:underline">
            Вход
          </Link>
          <Link to="/register" className="hover:underline">
            Регистрация
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
