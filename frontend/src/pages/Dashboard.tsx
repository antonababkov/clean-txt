import Charts from "../components/dashboards/Charts";
import SEO from "../components/common/SEO";

const Dashboard = () => {
  return (
    <>
      <SEO
        title="Панель управления – Clean Text Service"
        description="Просматривайте графики активности и статистику по очисткам"
      />
      <div className="p-4">
        <h1 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
          Дашборд
        </h1>
        <Charts />
      </div>
    </>
  );
};

export default Dashboard;
