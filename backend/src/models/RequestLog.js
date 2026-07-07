import pool from "../config/db.js";

class RequestLog {
  // Получить количество запросов по дням для конкретного пользователя (или всех)
  static async getDailyStats(userId = null, days = 7) {
    const whereClause = userId ? "WHERE user_id = $1" : "";
    const params = userId ? [userId, days] : [days];
    const query = `
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as count
      FROM request_logs
      ${whereClause}
      AND timestamp >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `;
    const result = await pool.query(query, params);
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
