-- Пользователи
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Задания на очистку 
CREATE TABLE IF NOT EXISTS cleaning_tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    cleaned_text TEXT,
    remove_hidden_markers BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Логи запросов
CREATE TABLE IF NOT EXISTS request_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    endpoint VARCHAR(255),
    method VARCHAR(10),
    status INTEGER,
    response_time INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);