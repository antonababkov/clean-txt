import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title = "Clean Text Service – Очистка текста онлайн",
  description = "Сервис для очистки текста от HTML-тегов, лишних пробелов и управляющих символов. Бесплатно, быстро, с историей и статистикой.",
  keywords = "очистка текста, удалить HTML теги, форматирование текста, онлайн инструмент",
  image = "/og-image.png", // (из папки public размером 1200x630 пикселей (сейчас стоит бесплатная стоковая картинка))
  url = "https://your-domain.ru", //Заменить на реальный домен
  type = "website",
}: SEOProps) => {
  return (
    <Helmet>
      {/* Базовые мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Clean Text Service" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Дополнительные мета-теги для мобильных устройств */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1a202c" />
    </Helmet>
  );
};

export default SEO;
