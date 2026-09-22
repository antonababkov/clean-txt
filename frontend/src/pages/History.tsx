import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTasks } from "../store/slices/taskSlice";
import SEO from "../components/common/SEO";
import JsonLd from "../components/common/JsonLd";
import toast from "react-hot-toast";
import api from "../api/axiosConfig";

const History = () => {
  const dispatch = useAppDispatch();
  const { tasks, total, loading } = useAppSelector((state) => state.tasks);
  const [page, setPage] = useState(0);
  const [exporting, setExporting] = useState(false);
  const limit = 5;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    dispatch(fetchTasks({ limit, offset: page * limit }));
  }, [dispatch, page]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Текст скопирован");
    } catch {
      toast.error("Не удалось скопировать текст");
    }
  };

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

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "История очисток текста",
    description: "Просматривайте все предыдущие задачи по очистке текста.",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: "https://your-domain.com",
        },
        { "@type": "ListItem", position: 2, name: "История" },
      ],
    },
    url: "https://your-domain.com/history",
  };

  return (
    <>
      <SEO
        title="История очисток текста"
        description="Просматривайте и управляйте своими предыдущими задачами"
      />
      <JsonLd data={jsonLdData} />
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
              <p className="whitespace-pre-wrap break-words">
                <strong>Исходный:</strong>{" "}
                {task.original_text.substring(0, 100)}
                ...
              </p>
              <p className="whitespace-pre-wrap break-words">
                <strong>Очищенный:</strong> {task.cleaned_text}
              </p>
              <button
                type="button"
                onClick={() => handleCopy(task.cleaned_text)}
                className="px-3 py-1 mt-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Копировать
              </button>
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
          <span>Страница {page + 1} из {totalPages}</span>
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
