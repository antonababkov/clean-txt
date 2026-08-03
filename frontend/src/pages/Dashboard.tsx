import Charts from "../components/dashboards/Charts";

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
        Дашборд
      </h1>
      <Charts />
    </div>
  );
};

export default Dashboard;
