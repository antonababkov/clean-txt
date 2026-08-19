import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { register } from "../../store/slices/authSlice";
import SEO from "../common/SEO";

/* протестировать */
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkpassword, setCheckpassword] = useState("");
  const [wrongpassword, setWrongpassword] = useState(false);
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
    if (password !== checkpassword) {
      setWrongpassword(true);
    } else {
      const result = await dispatch(register({ email, password }));
      if (register.fulfilled.match(result)) {
        navigate("/");
      }
    }
  };

  return (
    <>
      <SEO
        title="Регистрация в Clean Text Service"
        description="Зарегистрируйтесь и начните очищать текст от лишних символов"
      />
      <div className="p-6 mx-auto mt-10 border rounded shadow max-w-80 sm:max-w-md">
        <h2 className="mb-4 text-2xl font-bold">Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-2 mb-2 text-gray-800 border dark:text-gray-300"
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />
          <input
            className="w-full p-2 mb-2 text-gray-800 border dark:text-gray-300"
            type="password"
            id="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="w-full p-2 mb-2 text-gray-800 border dark:text-gray-300"
            type="password"
            id="password-repeat"
            placeholder="Повторите пароль"
            value={checkpassword}
            onChange={(e) => setCheckpassword(e.target.value)}
            required
          />
          {wrongpassword && (
            <p className="text-red-500">Пароли должны совпадать</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <button
            className="w-full p-2 text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
            type="submit"
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Зарегистрироваться"}
          </button>
        </form>
        <p className="mt-2 text-sm">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-blue-500">
            {" "}
            Войти
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
