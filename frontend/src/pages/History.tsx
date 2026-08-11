import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTasks } from "../store/slices/taskSlice";
import api from "../api/axiosConfig";

const History = () => {
  const dispatch = useAppDispatch();
  const { tasks, total, loading } = useAppSelector((state) => state.tasks);
  const [page, setPage] = useState(0);
  const limit = 5;

  useEffect(() => {
    dispatch(fetchTasks({ limit, offset: page * limit }));
  }, [dispatch, page]);

  const handleExport = async () => {
    try {
      const response = await api.get("/export/tasks", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export error", error);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">История очистки</h2>
      <button
        onClick={handleExport}
        className="px-4 py-2 mb-4 text-white bg-green-500 rounded cursor-pointer hover:bg-green-600"
      >
        Экспорт истории в CSV
      </button>
      {loading && <p>Загрузка...</p>}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="p-3 border rounded">
            <p>
              <strong>Исходный:</strong> {task.original_text.substring(0, 100)}
              ...
            </p>
            <p>
              <strong>Очищенный:</strong> {task.cleaned_text}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(task.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
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

export default History;
