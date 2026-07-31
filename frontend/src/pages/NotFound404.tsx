import { Link } from "react-router-dom";

const NotFound404 = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-bold text-gray-300">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Страница не найдена</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        Извините, запрошенная страница не существует или была перемещена.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        На главную
      </Link>
    </div>
  );
};

export default NotFound404;
