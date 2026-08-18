import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleTheme } from "../../store/slices/themeSlice";

const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 text-gray-800 bg-gray-700 rounded cursor-pointer dark:text-gray-200"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggle;
