import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createTask } from "../store/slices/taskSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

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

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Очистка текста</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 mb-2 border rounded"
          rows={6}
          placeholder="Введите текст с HTML или лишними пробелами..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded disabled:opacity-50"
            disabled={loading || !text.trim()}
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
      </form>

      <div className="mt-4 p-4 border rounded bg-gray-50 dark:bg-gray-800 min-h-[80px]">
        {loading && !cleaned ? (
          <LoadingSpinner />
        ) : cleaned ? (
          <>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Очищенный текст:
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{cleaned}</p>
          </>
        ) : (
          <p className="text-center text-gray-400 dark:text-gray-500">
            Очищенный текст появится здесь
          </p>
        )}
      </div>
    </div>
  );
};

export default NewTask;
