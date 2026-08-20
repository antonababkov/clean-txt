# Clean Text Service

Сервис для очистки текста от HTML-тегов, лишних пробелов и управляющих символов. Пользователь отправляет текст через веб-интерфейс, бэкенд очищает его, сохраняет историю операций, предоставляет статистику по запросам (графики) и уведомления в реальном времени.

---

## Технологии

### Бэкенд

- **Node.js** (v20) + **Express**
- **PostgreSQL** – основная БД
- **Redis** – кэширование результатов очистки
- **JWT** – аутентификация (access + refresh токены)
- **bcrypt** – хеширование паролей
- **WebSocket** (`ws`) – уведомления в реальном времени
- **Swagger** – документация API
- **Jest + Supertest** – тестирование

### Фронтенд

- **React** + **TypeScript** (Vite)
- **Redux Toolkit** – управление состоянием
- **Tailwind CSS** – стилизация (с поддержкой тёмной темы)
- **Chart.js** – графики статистики
- **React Router** – маршрутизация
- **React Hook Form** – формы (опционально)

### DevOps

- **Docker** + **Docker Compose**
- **GitHub Actions** – CI/CD
- **Nginx** – раздача статики и проксирование

---

## Структура проекта

```plaintext
clean-txt/
├── backend/
│   ├── src/
│   │   ├── config/          # Конфигурации (БД, Redis, Swagger)
│   │   ├── controllers/     # Контроллеры
│   │   ├── middleware/      # Middleware (auth, errorHandler)
│   │   ├── models/          # Модели данных (pg)
│   │   ├── routes/          # Маршруты
│   │   ├── services/        # Бизнес-логика
│   │   ├── utils/           # Вспомогательные функции
│   │   └── app.js           # Express приложение
│   ├── tests/               # Интеграционные тесты
│   ├── Dockerfile           # Продакшен-образ
│   ├── Dockerfile.dev       # Образ для разработки
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/                 # React-приложение
│   ├── Dockerfile           # Продакшен-образ (с Nginx)
│   ├── Dockerfile.dev       # Образ для разработки
│   ├── package.json
│   ├── .env.development
│   └── .env.prodaction
├── docker-compose.yml       # (опционально) общий compose
├── docker-compose.dev.yml   # Для локальной разработки
├── docker-compose.prod.yml  # Для продакшена
├── .env                     # Переменные окружения
└── README.md
```

---

## Установка и запуск

### Локальный запуск (без Docker)

1. Клонируйте репозиторий:

```bash
  git clone https://github.com/antonababkov/clean-txt.git
  cd clean-txt
```

2. Установите зависимости для бэкенда и фронтенда:

```bash
   cd backend
   npm install
   cd ../frontend
   npm install
```

3. Создайте файлы .env в папках backend и frontend
4. Убедитесь, что PostgreSQL и Redis запущены локально.
5. Запустите бэкенд:

```bash
   cd backend
   npm run dev
```

6. Запустите фронтенд:

```bash
   cd frontend
   npm run dev
```

7. Откройте http://localhost:5173

### Запуск с Docker (разработка)

1. Клонируйте репозиторий:

```bash
  git clone https://github.com/antonababkov/clean-txt.git
  cd clean-txt
```

2. Создайте файл .env в корне проекта (содержит DB_PASSWORD и JWT_SECRET).
3. Создайте файлы .env в папках backend и frontend. (см. Переменные окружения)
4. Установите зависимости для бэкенда и фронтенда:

```bash
   cd backend
   npm install
   cd ../frontend
   npm install
```

5. Запустите контейнеры из корневой папки:

```bash
   npm run docker:dev
```

6. Фронтенд доступен на http://localhost:5173, бэкенд – на http://localhost:5000.
7. Для остановки контейнеров:

```bash
   npm run docker:dev:stop
```

8. Для удаления контейнеров:

```bash
   npm run docker:dev:down
```

### Запуск с Docker (продакшен)

Важно: перед запуском убедитесь, что у вас установлены Docker и Docker Compose. Также убедитесь, что порты 80 и 5000 не заняты другими приложениями.

1. Клонируйте репозиторий:

```bash
   git clone https://github.com/antonababkov/clean-txt.git
   cd clean-txt
```

2.  Создайте файл .env в корне проекта (содержит DB_PASSWORD и JWT_SECRET и DOCKER_USERNAME).
3.  Создайте файл .env в папке backend (см. раздел Переменные окружения).
4.  Создайте файлы .env.development и .env.production в папке frontend. (см. Переменные окружения)
5.  Установите зависимости для бэкенда и фронтенда:

```bash
   cd backend
   npm install
   cd ../frontend
   npm install
```

7. Убедитесь, что в docker-compose.prod.yml сервис бэкенда называется backend – именно это имя используется в proxy_pass. Если имя другое, измените его в nginx.conf

8. Соберите образы Docker локально из корневой папки проекта.

```bash
   docker build -t antonababkov/clean-text-backend:latest ./backend
   docker build -t antonababkov/clean-text-frontend:latest ./frontend
```

Примечание: при сборке фронтенда Vite автоматически подхватит .env.production, если он есть в папке frontend. Убедитесь, что этот файл не исключён в .dockerignore

9. Запуск контейнеров

```bash
   npm run docker:prod
```

10. После запуска:

```plaintext
   Фронтенд доступен по адресу: http://localhost:80 (или порт, указанный в docker-compose.prod.yml)

   Бэкенд доступен по адресу: http://localhost:5000

   Swagger документация: http://localhost:5000/api-docs
```

11. Просмотр логов

```bash
   docker:prod:logs
```

12. Для остановки контейнеров:

```bash
   npm run docker:prod:stop
```

13. Для удаления контейнеров:

```bash
   npm run docker:prod:down
```

## Переменные окружения

### Бэкенд (.env в папке backend)

```plaintext
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   JWT_SECRET=your_super_secret_key
   ACCESS_TOKEN_EXPIRES=15m
   REFRESH_TOKEN_EXPIRES=7d
   REDIS_HOST=localhost
   REDIS_PORT=6379
```

### Фронтенд (.env.development в папке frontend)

```plaintext
   VITE_API_URL=http://localhost:5000
   VITE_WS_URL=ws://localhost:5000/ws
```

### Фронтенд (.env.production в папке frontend)

```plaintext
   VITE_API_URL=/api
   VITE_WS_URL=ws://localhost/ws
```

### Корневой .env (для Docker)

```plaintext
   DB_PASSWORD=your_db_password
   JWT_SECRET=your_super_secret_key
   DOCKER_USERNAME=your_docker_username
```

## API документация

После запуска бэкенда документация Swagger доступна по адресу:
http://localhost:5000/api-docs

## Основные эндпоинты:

Метод - Путь - Описание

POST - /auth/register - Регистрация

POST - /auth/login - Вход

POST - /auth/refresh - Обновление access токена

POST - /auth/logout - Выход

GET - /auth/me - Профиль пользователя

POST - /tasks - Создать задачу на очистку

GET - /tasks - Список задач пользователя

PUT - /tasks/:id - Обновить задачу

DELETE - /tasks/:id - Удалить задачу

GET - /stats/daily - Статистика по дням (своя)

GET - /stats/hourly - Статистика по часам (своя)

GET - /admin/tasks - Все задачи (админ)

GET - /admin/users - Все пользователи (админ)

GET - /export/tasks - Экспорт задач в CSV

## Тестирование

```bash
   cd backend
   npm test
```

## Деплой на VPS (не проверено)

1. Установите Docker и Docker Compose на сервере.
2. Склонируйте репозиторий на сервер:

```bash
   git clone https://github.com/antonababkov/clean-txt.git /opt/clean-txt
   cd /opt/clean-txt
```

3. Создайте файл .env с продакшен-параметрами.
4. Запустите контейнеры:

```bash
   docker-compose -f docker-compose.prod.yml up -d
```

5. Настройте Nginx на сервере для проксирования на порты 80 (фронтенд) и 5000 (бэкенд).
6. Настройте SSL

## CI/CD (не проверено)

GitHub Actions автоматически:

Запускает тесты при каждом push.

Собирает Docker-образы при пуше в main.

Публикует их на Docker Hub.

Деплоит на VPS через SSH.

## Для работы CI/CD добавьте секреты в настройках репозитория: (не проверено)

Секрет - Описание

DOCKER_USERNAME - Логин Docker Hub

DOCKER_PASSWORD - Пароль или токен Docker Hub

SERVER_HOST - IP VPS сервера

SERVER_USER - Имя пользователя SSH

SSH_PRIVATE_KEY - Приватный SSH-ключ
