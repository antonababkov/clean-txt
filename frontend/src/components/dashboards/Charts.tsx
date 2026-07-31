import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchDailyStats,
  fetchHourlyStats,
  fetchAdminDailyStats,
  fetchAdminHourlyStats,
} from "../../store/slices/statsSlice";
import LoadingSpinner from "../common/LoadingSpinner";
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

interface ChartsProps {
  isAdmin?: boolean;
}

const Charts = ({ isAdmin = false }: ChartsProps) => {
  const dispatch = useAppDispatch();
  const { daily, hourly, adminDaily, adminHourly, loading, adminLoading } =
    useAppSelector((state) => state.stats);

  const isLoading = isAdmin ? adminLoading : loading;
  const dailyData = isAdmin ? adminDaily : daily;
  const hourlyData = isAdmin ? adminHourly : hourly;

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchAdminDailyStats(7));
      dispatch(fetchAdminHourlyStats());
    } else {
      dispatch(fetchDailyStats(7));
      dispatch(fetchHourlyStats());
    }
  }, [dispatch, isAdmin]);

  if (isLoading) return <LoadingSpinner />;

  const chartData = (
    data: { day?: string; hour?: number; count: number }[],
    label: string,
    dateKey: "day" | "hour",
  ) => {
    const labels = data.map((item) => {
      if (dateKey === "day") {
        const dateStr = item.day || "";
        return new Date(dateStr).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
        });
      } else {
        return `${item.hour}:00`;
      }
    });
    return {
      labels,
      datasets: [
        {
          label,
          data: data.map((item) => item.count),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
        },
      ],
    };
  };

  const dailyChartData = chartData(dailyData, "Количество запросов", "day");
  const hourlyChartData = chartData(hourlyData, "Запросы по часам", "hour");

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="p-4 bg-white rounded shadow dark:bg-gray-800">
        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
          Запросы за последние 7 дней {isAdmin && "(все пользователи)"}
        </h3>
        <Line data={dailyChartData} />
      </div>
      <div className="p-4 bg-white rounded shadow dark:bg-gray-800">
        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
          Запросы по часам (сегодня) {isAdmin && "(все пользователи)"}
        </h3>
        <Line data={hourlyChartData} />
      </div>
    </div>
  );
};

export default Charts;
