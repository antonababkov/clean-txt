import { Link } from "react-router-dom";
import Charts from "../components/dashboards/Charts";
import SEO from "../components/common/SEO";
import JsonLd from "../components/common/JsonLd";

const AdminPanel = () => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Админ-панель Clean Text Service",
    description:
      "Управление пользователями, задачами и общей статистикой сервиса очистки текста.",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: "https://your-domain.com",
        },
        { "@type": "ListItem", position: 2, name: "Админ-панель" },
      ],
    },
    url: "https://your-domain.com/admin",
    accessMode: "restricted",
  };

  return (
    <>
      <SEO
        title="Админ-панель Clean Text Service"
        description="Просмотр активности всех пользователей"
      />
      <JsonLd data={jsonLdData} />
      <div className="max-w-6xl p-4 mx-auto">
        <div className="flex flex-col items-center justify-between gap-3 mb-6 sm:flex-row">
          <h1 className="text-xl font-bold sm:text-3xl">
            Панель администратора
          </h1>
          <Link
            to="/admin/tasks"
            className="px-6 py-3 font-bold text-white transition duration-200 bg-blue-600 rounded-lg shadow-lg text-md hover:bg-blue-700"
          >
            📋 Список задач на очистку
          </Link>
        </div>

        <div className="mt-8">
          <Charts isAdmin={true} />
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
