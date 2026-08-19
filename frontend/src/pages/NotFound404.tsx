import { Link } from "react-router-dom";
import SEO from "../components/common/SEO";

const NotFound404 = () => {
  return (
    <>
      <SEO
        title="Страница не найдена (404)"
        description="Запрашиваемая страница не существует. Вернитесь на главную"
      />
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-bold text-gray-300 text-9xl">404</h1>
        <h2 className="mt-4 text-3xl font-semibold">Страница не найдена</h2>
        <p className="max-w-md mt-2 text-gray-500">
          Извините, запрошенная страница не существует или была перемещена.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 mt-6 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          На главную
        </Link>
      </div>
    </>
  );
};

export default NotFound404;
