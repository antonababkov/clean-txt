import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <div className="max-w-4xl p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Панель администратора</h1>
      <div className="p-6 bg-white rounded-lg shadow">
        <p className="text-gray-600">
          Здесь будет админ-панель со статистикой и управлением пользователями.
        </p>
        {/* Можно добавить статистику, список пользователей, управление задачами и т.д. */}
        <Link to="/admin/tasks" className="text-gray-700 hover:underline">
          Список задач на очистку
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;
