import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTasks } from "../store/slices/taskSlice";
import SEO from "../components/common/SEO";
import toast from "react-hot-toast";
import api from "../api/axiosConfig";

const History = () => {
  const dispatch = useAppDispatch();
  const { tasks, total, loading } = useAppSelector((state) => state.tasks);
  const [page, setPage] = useState(0);
  const [exporting, setExporting] = useState(false);
  const limit = 5;

  useEffect(() => {
    dispatch(fetchTasks({ limit, offset: page * limit }));
  }, [dispatch, page]);

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const response = await api.get("/export/tasks", {
        responseType: "blob",
      });
      // Если статус 200, скачиваем файл
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Экспорт выполнен успешно");
    } catch (error: any) {
      // Обрабатываем ошибку
      if (error.response?.status === 404) {
        toast.error("Нет задач для экспорта");
      } else {
        toast.error("Ошибка при экспорте");
      }
      console.error("Export error", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <SEO
        title="История очисток текста"
        description="Просматривайте и управляйте своими предыдущими задачами"
      />
      <div>
        <h2 className="mb-4 text-2xl font-bold">История очистки</h2>
        <button
          onClick={handleExport}
          disabled={exporting || tasks.length === 0}
          className="px-4 py-2 mb-4 text-white bg-green-500 rounded cursor-pointer hover:bg-green-600"
        >
          Экспорт истории в CSV
        </button>
        {loading && <p>Загрузка...</p>}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-3 border rounded">
              <p className="break-all">
                <strong>Исходный:</strong>{" "}
                {task.original_text.substring(0, 100)}
                ...
              </p>
              <p className="break-all">
                <strong>Очищенный:</strong> {task.cleaned_text}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(task.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 ">
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
    </>
  );
};

export default History;
