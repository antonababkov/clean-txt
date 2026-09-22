import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createTask } from "../store/slices/taskSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import SEO from "../components/common/SEO";
import JsonLd from "../components/common/JsonLd";

const MAX_LENGTH = 5000;

const NewTask = () => {
  const [text, setText] = useState("");
  const [cleaned, setCleaned] = useState("");
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.tasks);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCleaned(""); // сбрасываем предыдущий результат
    const result = await dispatch(createTask(text));
    if (createTask.fulfilled.match(result)) {
      setCleaned(result.payload.cleaned_text);
    }
  };

  const handleReset = () => {
    setText("");
    setCleaned("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleaned);
      toast.success("Текст скопирован");
    } catch {
      toast.error("Не удалось скопировать текст");
    }
  };

  const isOverLimit = text.length > MAX_LENGTH;
  const charCount = text.length;
  const percent = Math.min((charCount / MAX_LENGTH) * 100, 100);

  // Цвет счётчика
  let counterColor = "text-green-600 dark:text-green-400";
  if (percent > 80 && percent <= 95)
    counterColor = "text-yellow-600 dark:text-yellow-400";
  if (percent > 95) counterColor = "text-red-600 dark:text-red-400";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Очистка текста онлайн",
    description:
      "Отправьте текст на очистку: удалите HTML-теги, лишние пробелы, управляющие символы и скрытые метки GPT. Мгновенный результат.",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: "https://your-domain.com",
        },
        { "@type": "ListItem", position: 2, name: "Новая очистка" },
      ],
    },
    mainEntity: {
      "@type": "WebApplication",
      name: "Инструмент очистки текста",
      applicationCategory: "Utility",
      operatingSystem: "All",
    },
    url: "https://your-domain.com/new",
  };

  return (
    <>
      <SEO
        title="Новая очистка текста"
        description="Очистка текста от HTML-тегов, пробелов, управляющих символов и скрытых меток GPT"
      />
      <JsonLd data={jsonLdData} />
      <div className="mx-auto max-w-80 sm:max-w-2xl">
        <h2 className="mb-4 text-2xl font-bold">Очистка текста</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            id="newTask_input"
            className="w-full p-2 mb-2 text-gray-800 border rounded dark:text-gray-300"
            rows={6}
            placeholder="Введите текст с HTML, лишними пробелами или скрытыми метками..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_LENGTH}
          />
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded disabled:opacity-50"
                disabled={loading || isOverLimit || !text.trim()}
              >
                {loading ? "Очистка..." : "Очистить"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-gray-800 bg-gray-300 rounded dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Сбросить
              </button>
            </div>
          </div>
          <div className={`text-sm font-medium ${counterColor}`}>
            {charCount} / {MAX_LENGTH} символов
          </div>
        </form>

        <div className="p-4 mt-4 border rounded bg-gray-50 dark:bg-gray-800 min-h-20">
          {loading && !cleaned ? (
            <LoadingSpinner />
          ) : cleaned ? (
            <>
              <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-200">
                Очищенный текст:
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap break-words dark:text-gray-300">
                {cleaned}
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 mt-3 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Копировать
              </button>
            </>
          ) : (
            <p className="text-center text-gray-400 dark:text-gray-500">
              Очищенный текст появится здесь
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default NewTask;
