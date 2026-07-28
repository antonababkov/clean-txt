import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">
          Здесь будет админ-панель со статистикой и управлением пользователями.
        </p>
        {/* Можно добавить статистику, список пользователей, управление задачами и т.д. */}
        <Link
          to="/admin/tasks"
          className="text-gray-700 dark:text-gray-300 hover:underline"
        >
          Список задач на очистку
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;
