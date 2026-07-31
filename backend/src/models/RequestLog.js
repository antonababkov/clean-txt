import pool from "../config/db.js";

class RequestLog {
  // Получить количество созданий задач по дням для конкретного пользователя
  static async getDailyStats(userId, days) {
    const daysInt = parseInt(days) || 7;
    if (daysInt < 1) daysInt = 1;

    const result = await pool.query(
      `SELECT DATE(timestamp) AS day, COUNT(*) AS count
       FROM request_logs
       WHERE timestamp >= NOW() - INTERVAL '1 day' * $1
         AND user_id = $2
         AND endpoint = '/tasks'
         AND method = 'POST'
       GROUP BY day
       ORDER BY day ASC`,
      [daysInt, userId],
    );
    return result.rows;
  }

  // Получить количество созданий задач по часам для конкретного пользователя за сегодня
  static async getHourlyStats(userId) {
    const result = await pool.query(
      `SELECT 
        EXTRACT(HOUR FROM timestamp) as hour,
        COUNT(*) as count
       FROM request_logs
       WHERE DATE(timestamp) = CURRENT_DATE
         AND user_id = $1
         AND endpoint = '/tasks'
         AND method = 'POST'
       GROUP BY hour
       ORDER BY hour ASC`,
      [userId],
    );
    return result.rows;
  }

  // Получить общее количество созданий задач (для админа – опционально)
  static async getTotalCount() {
    const result = await pool.query(
      "SELECT COUNT(*) FROM request_logs WHERE endpoint = '/tasks' AND method = 'POST'",
    );
    return parseInt(result.rows[0].count);
  }
}

export default RequestLog;
