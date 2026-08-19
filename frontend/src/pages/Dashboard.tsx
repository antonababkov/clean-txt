import Charts from "../components/dashboards/Charts";
import SEO from "../components/common/SEO";
import JsonLd from "../components/common/JsonLd";

const Dashboard = () => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Clean Text Service",
    description:
      "Онлайн-сервис для очистки текста от HTML-тегов и лишних пробелов",
    applicationCategory: "Utility",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "RUB",
    },
  };

  return (
    <>
      <SEO
        title="Панель управления – Clean Text Service"
        description="Просматривайте графики активности и статистику по очисткам"
      />
      <JsonLd data={jsonLdData} />
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
