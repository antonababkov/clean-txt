import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTasks, deleteTask } from "../../store/slices/taskSlice";

const TasksList = () => {
  const dispatch = useAppDispatch();
  const { tasks, total, loading } = useAppSelector((state) => state.tasks);
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    // Для админа используем специальный эндпоинт /admin/tasks
    // Для этого нужно добавить действие в taskSlice или просто вызвать api.get('/admin/tasks')
    // Временно используем обычный fetchTasks, но он вернёт только свои задачи.
    // Сделаем отдельный thunk позже.
    dispatch(fetchTasks({ limit, offset: page * limit }));
  }, [dispatch, page]);

  const handleDelete = (id: number) => {
    if (window.confirm("Удалить задание?")) {
      dispatch(deleteTask(id));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Администрирование
      </h2>
      <p className="mb-2">Всего задач: {total}</p>
      {loading && <p>Загрузка...</p>}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border p-3 rounded bg-white dark:bg-gray-800"
          >
            <p>
              <strong>ID:</strong> {task.id}
            </p>
            <p>
              <strong>Пользователь:</strong> {task.user_id}
            </p>
            <p>
              <strong>Исходный текст:</strong>{" "}
              {task.original_text.substring(0, 100)}...
            </p>
            <p>
              <strong>Очищенный:</strong> {task.cleaned_text}
            </p>
            <button
              onClick={() => handleDelete(task.id)}
              className="bg-red-500 text-white px-3 py-1 rounded mt-2"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-3 py-1 border rounded"
        >
          Назад
        </button>
        <span>Страница {page + 1}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={(page + 1) * limit >= total}
          className="px-3 py-1 border rounded"
        >
          Вперед
        </button>
      </div>
    </div>
  );
};

export default TasksList;
