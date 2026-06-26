import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchMe } from "../store/slices/authSlice";

const Home = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) dispatch(fetchMe());
  }, [dispatch, user]);

  return (
    <div className="p-4">
      <h1 className="text-3xl">Добро пожаловать, {user?.email || "гость"}!</h1>
      <p className="mt-2">
        Здесь будет дашборд с графиками и форма очистки текста.
      </p>
    </div>
  );
};

export default Home;
