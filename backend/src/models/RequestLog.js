import pool from "../config/db.js";

class RequestLog {
  // Получить количество запросов по дням для конкретного пользователя (или всех)
  static async getDailyStats(days) {
    // Убедитесь, что days — число
    const daysInt = parseInt(days) || 7;
    if (daysInt < 1) daysInt = 1;

    const result = await pool.query(
      `SELECT DATE(timestamp) AS day, COUNT(*) AS count
       FROM request_logs
       WHERE timestamp >= NOW() - INTERVAL '1 day' * $1
       GROUP BY day
       ORDER BY day ASC`,
      [daysInt], // ровно один параметр
    );
    return result.rows;
  }

  // Получить количество запросов по часам для конкретного дня
  static async getHourlyStats(userId = null, date = null) {
    const dateCondition = date
      ? `DATE(timestamp) = '${date}'`
      : `DATE(timestamp) = CURRENT_DATE`;
    const whereClause = userId
      ? `user_id = $1 AND ${dateCondition}`
      : dateCondition;
    const params = userId ? [userId] : [];
    const query = `
      SELECT 
        EXTRACT(HOUR FROM timestamp) as hour,
        COUNT(*) as count
      FROM request_logs
      WHERE ${whereClause}
      GROUP BY hour
      ORDER BY hour ASC
    `;
    const result = await pool.query(query, params);
    return result.rows;
  }

  // Получить общее количество запросов (для админа)
  static async getTotalCount() {
    const result = await pool.query("SELECT COUNT(*) FROM request_logs");
    return parseInt(result.rows[0].count);
  }
}

export default RequestLog;
