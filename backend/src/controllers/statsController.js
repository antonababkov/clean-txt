import RequestLog from "../models/RequestLog.js";

export const getDailyStats = async (req, res, next) => {
  try {
    const days = req.query.days || 7;
    const userId = req.user.userId; // всегда используем текущего пользователя
    const stats = await RequestLog.getDailyStats(userId, days);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export const getHourlyStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const stats = await RequestLog.getHourlyStats(userId);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export const getTotalCount = async (req, res, next) => {
  try {
    const count = await RequestLog.getTotalCount();
    res.json({ total: count });
  } catch (err) {
    next(err);
  }
};
