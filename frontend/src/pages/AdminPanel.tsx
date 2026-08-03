import { Link } from "react-router-dom";
import Charts from "../components/dashboards/Charts";

const AdminPanel = () => {
  return (
    <div className="max-w-6xl p-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Панель администратора</h1>
        <Link
          to="/admin/tasks"
          className="px-6 py-3 text-lg font-bold text-white transition duration-200 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700"
        >
          📋 Список задач на очистку
        </Link>
      </div>

      <div className="mt-8">
        <Charts isAdmin={true} />
      </div>
    </div>
  );
};

export default AdminPanel;
