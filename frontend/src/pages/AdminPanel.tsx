import { Link } from "react-router-dom";
import Charts from "../components/dashboards/Charts";
import SEO from "../components/common/SEO";

const AdminPanel = () => {
  return (
    <>
      <SEO
        title="Админ-панель Clean Text Service"
        description="Просмотр активности всех пользователей"
      />
      <div className="max-w-6xl p-4 mx-auto">
        <div className="flex flex-col items-center justify-between gap-3 mb-6 sm:flex-row">
          <h1 className="text-xl font-bold sm:text-3xl">
            Панель администратора
          </h1>
          <Link
            to="/admin/tasks"
            className="px-6 py-3 font-bold text-white transition duration-200 bg-blue-600 rounded-lg shadow-lg text-md hover:bg-blue-700"
          >
            📋 Список задач на очистку
          </Link>
        </div>

        <div className="mt-8">
          <Charts isAdmin={true} />
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
