-- Миграция: колонка remove_hidden_markers в cleaning_tasks (удаление скрытых меток).
-- Для существующих баз данных выполнить вручную (например: psql -f backend/src/config/migrations/2026-09-remove_hidden_markers.sql).
ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS remove_hidden_markers BOOLEAN NOT NULL DEFAULT true;