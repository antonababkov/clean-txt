import CleaningTask from "../models/CleaningTask.js";
import { cleanTextWithCache } from "../services/textCleaner.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";
import pool from "../config/db.js";
import { notifyUser } from "../websocket.js";

const MAX_TEXT_LENGTH = 5000;

export const createTask = async (req, res, next) => {
  try {
    const { originalText } = req.body;
    if (!originalText || typeof originalText !== "string") {
      throw new ValidationError("Текст обязателен");
    }
    if (originalText.length > MAX_TEXT_LENGTH) {
      throw new ValidationError(
        `Текст не должен превышать ${MAX_TEXT_LENGTH} символов`,
      );
    }
    const cleanedText = await cleanTextWithCache(originalText);
    const task = await CleaningTask.create({
      userId: req.user.userId,
      originalText,
      cleanedText,
      removeHiddenMarkers: true,
    });
    // Отправляем уведомление создателю задачи
    notifyUser(req.user.userId, {
      type: "TASK_CREATED",
      task: {
        id: task.id,
        original_text: task.original_text,
        cleaned_text: task.cleaned_text,
        remove_hidden_markers: task.remove_hidden_markers,
        created_at: task.created_at,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const { tasks, total } = await CleaningTask.findByUserId(req.user.userId, {
      limit,
      offset,
    });
    res.json({ tasks, total, limit, offset });
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await CleaningTask.findById(req.params.id, req.user.userId);
    if (!task) throw new NotFoundError("Задание не найдено");
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { originalText } = req.body;
    if (!originalText || typeof originalText !== "string") {
      throw new ValidationError("Текст обязателен");
    }
    if (originalText.length > MAX_TEXT_LENGTH) {
      throw new ValidationError(
        `Текст не должен превышать ${MAX_TEXT_LENGTH} символов`,
      );
    }
    const cleanedText = await cleanTextWithCache(originalText);
    const task = await CleaningTask.update(req.params.id, req.user.userId, {
      originalText,
      cleanedText,
      removeHiddenMarkers: true,
    });
    if (!task) throw new NotFoundError("Задание не найдено");
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const deleted = await CleaningTask.delete(req.params.id, req.user.userId);
    if (!deleted) throw new NotFoundError("Задание не найдено");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const adminDeleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    //Проверяем, что задача существует (админ может удалять любую)
    const result = await pool.query(
      "DELETE FROM cleaning_tasks WHERE id = $1 RETURNING id",
      [taskId],
    );
    if (result.rowCount === 0) {
      throw new NotFoundError("Задание не найдено");
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
export const adminGetTasks = async (req, res, next) => {
  try {
    const userId = req.query.userId || null;
    const days = req.query.days || null;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const result = await CleaningTask.adminGetTasks({
      userId,
      days,
      limit,
      offset,
    });
    res.json({
      tasks: result.tasks,
      total: result.total,
      limit,
      offset,
    });
  } catch (err) {
    next(err);
  }
};
