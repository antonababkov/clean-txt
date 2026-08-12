import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchAdminTasks,
  fetchUsers,
  deleteTask,
} from "../../store/slices/adminSlice";

const TasksList = () => {
  const dispatch = useAppDispatch();
  const { tasks, users, total, loading } = useAppSelector(
    (state) => state.admin,
  );
  const [filters, setFilters] = useState({ userId: "", days: "" });
  const [page, setPage] = useState(0);
  const [emailInput, setEmailInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<
    { id: number; email: string; role: string }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAdminTasks({
        userId: filters.userId || undefined,
        days: filters.days || undefined,
        limit,
        offset: page * limit,
      }),
    );
  }, [dispatch, filters, page]);

  // Фильтрация пользователей по введённому email
  useEffect(() => {
    if (emailInput.trim() === "") {
      setFilteredUsers([]);
      setShowSuggestions(false);
      return;
    }
    const lower = emailInput.toLowerCase();
    const matched = users.filter((u) => u.email.toLowerCase().includes(lower));
    setFilteredUsers(matched);
    setShowSuggestions(matched.length > 0);
  }, [emailInput, users]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(0);
  };

  const handleUserSelect = (userId: string, email: string) => {
    setFilters({ ...filters, userId });
    setEmailInput(email);
    setShowSuggestions(false); // Скрываем подсказки после выбора
    setPage(0);
    // Убираем фокус с поля, чтобы скрыть список
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleClearFilter = () => {
    setFilters({ ...filters, userId: "" });
    setEmailInput("");
    setShowSuggestions(false);
    setPage(0);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Удалить задание?")) {
      dispatch(deleteTask(id));
    }
  };

  const handleFocus = () => {
    // Показываем подсказки, только если есть введённый текст и есть совпадения
    if (emailInput.trim() !== "" && filteredUsers.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Скрываем подсказки с задержкой, чтобы клик по элементу успел сработать
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  if (loading) return <div className="text-center">Загрузка...</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Все задания</h2>

      {/* Фильтры */}
      <div className="flex flex-wrap items-end gap-4 mb-4">
        <div className="relative">
          <label
            htmlFor="tasksList_email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Пользователь (email)
          </label>
          <input
            id="tasksList_email"
            ref={inputRef}
            type="text"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Введите email для поиска..."
            className="block w-64 px-3 py-2 mt-1 text-gray-800 border border-gray-300 rounded-md shadow-sm dark:text-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
          />
          {showSuggestions && (
            <ul className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700 max-h-60">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleUserSelect(String(user.id), user.email)}
                  className="px-3 py-2 text-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-100"
                >
                  {user.email}{" "}
                  {user.role === "admin" && (
                    <span className="text-xs text-blue-500">(admin)</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label
            htmlFor="tasksList_days"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Период (дней)
          </label>
          <select
            id="tasksList_days"
            name="days"
            value={filters.days}
            onChange={handleFilterChange}
            className="block w-32 px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Все</option>
            <option value="7">7</option>
            <option value="14">14</option>
            <option value="30">30</option>
          </select>
        </div>

        <button
          onClick={handleClearFilter}
          className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Очистить фильтры
        </button>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                ID
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Пользователь
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Исходный текст
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Очищенный текст
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Дата
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-100">
                  {task.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-gray-100">
                  {task.email}
                </td>
                <td className="max-w-xs px-6 py-4 text-sm text-gray-900 truncate dark:text-gray-100">
                  {task.original_text}
                </td>
                <td className="max-w-xs px-6 py-4 text-sm text-gray-900 truncate dark:text-gray-100">
                  {task.cleaned_text}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                  {new Date(task.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Пагинация */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-4 py-2 border border-gray-300 rounded-md dark:border-gray-700 disabled:opacity-50"
        >
          Назад
        </button>
        <span>
          Страница {page + 1} из {Math.ceil(total / limit)}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={(page + 1) * limit >= total}
          className="px-4 py-2 border border-gray-300 rounded-md dark:border-gray-700 disabled:opacity-50"
        >
          Вперёд
        </button>
      </div>
    </div>
  );
};

export default TasksList;
