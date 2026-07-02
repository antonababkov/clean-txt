import CleaningTask from "../models/CleaningTask.js";
import { cleanTextWithCache } from "../services/textCleaner.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";

export const createTask = async (req, res, next) => {
  try {
    const { originalText } = req.body;
    if (!originalText || typeof originalText !== "string") {
      throw new ValidationError("Текст обязателен");
    }
    const cleanedText = cleanTextWithCache(originalText);
    const task = await CleaningTask.create({
      userId: req.user.userId,
      originalText,
      cleanedText,
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
    const cleanedText = cleanTextWithCache(originalText);
    const task = await CleaningTask.update(req.params.id, req.user.userId, {
      originalText,
      cleanedText,
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

// Админский эндпоинт
export const adminGetAllTasks = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const { tasks, total } = await CleaningTask.findAll({ limit, offset });
    res.json({ tasks, total, limit, offset });
  } catch (err) {
    next(err);
  }
};
