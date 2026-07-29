import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error, accessToken } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/new", { replace: true });
    }
  }, [accessToken, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-10 border rounded shadow">
      <h2 className="mb-4 text-2xl font-bold">Вход</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full p-2 mb-2 text-gray-800 border dark:text-gray-300"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-2 mb-2 text-gray-800 border dark:text-gray-300 "
          type="password"
          name="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="w-full p-2 text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
          type="submit"
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Войти"}
        </button>
      </form>
      <p className="mt-2 text-sm">
        Нет аккаунта?{" "}
        <Link to="/register" className="text-blue-500">
          {" "}
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
};

export default Login;
