import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createTask } from "../store/slices/taskSlice";

const NewTask = () => {
  const [text, setText] = useState("");
  const [cleaned, setCleaned] = useState("");
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.tasks);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(createTask(text));
    if (createTask.fulfilled.match(result)) {
      setCleaned(result.payload.cleaned_text);
    }
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
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded"
          disabled={loading}
        >
          {loading ? "Очистка..." : "Очистить"}
        </button>
      </form>
      {cleaned && (
        <div className="p-4 mt-4 border rounded">
          <h3 className="font-semibold">Очищенный текст:</h3>
          <p>{cleaned}</p>
        </div>
      )}
    </div>
  );
};

export default NewTask;
