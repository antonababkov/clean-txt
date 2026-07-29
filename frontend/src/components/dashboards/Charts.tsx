import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchDailyStats,
  fetchHourlyStats,
} from "../../store/slices/statsSlice";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Charts = () => {
  const dispatch = useAppDispatch();
  const { daily, hourly, loading } = useAppSelector((state) => state.stats);

  useEffect(() => {
    dispatch(fetchDailyStats(7));
    dispatch(fetchHourlyStats());
  }, [dispatch]);

  if (loading) return <div className="text-center">Загрузка графиков...</div>;

  const dailyData = {
    labels: daily.map((item) => {
      // Используем поле day (которое приходит с сервера)
      const dateStr = item.day; // fallback на случай другого названия
      return new Date(dateStr).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
      });
    }),
    datasets: [
      {
        label: "Количество запросов",
        data: daily.map((item) => item.count),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const hourlyData = {
    labels: hourly.map((item) => `${item.hour}:00`),
    datasets: [
      {
        label: "Запросы по часам",
        data: hourly.map((item) => item.count),
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="p-4 bg-white rounded shadow dark:bg-gray-800">
        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
          Запросы за последние 7 дней
        </h3>
        <Line data={dailyData} />
      </div>
      <div className="p-4 bg-white rounded shadow dark:bg-gray-800">
        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
          Запросы по часам (сегодня)
        </h3>
        <Line data={hourlyData} />
      </div>
    </div>
  );
};

export default Charts;
