import RequestLog from "../models/RequestLog.js";

export const getDailyStats = async (req, res, next) => {
  try {
    const days = req.query.days || 7;
    const stats = await RequestLog.getDailyStats(days);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export const getHourlyStats = async (req, res, next) => {
  try {
    const userId = req.user.role === "admin" ? null : req.user.userId;
    const date = req.query.date || null;
    const stats = await RequestLog.getHourlyStats(userId, date);
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
