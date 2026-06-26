import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { register } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
/* протестировать */
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkpassword, setCheckpassword] = useState("");
  const [wrongpassword, setWrongpassword] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

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
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full border p-2 mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 mb-2"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="w-full border p-2 mb-2"
          type="password"
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
          className="w-full bg-blue-500 text-white p-2 rounded"
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
  );
};

export default Register;
