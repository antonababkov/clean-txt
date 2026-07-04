import pool from "../config/db.js";

class CleaningTask {
  static async create({ userId, originalText, cleanedText }) {
    const result = await pool.query(
      `INSERT INTO cleaning_tasks (user_id, original_text, cleaned_text)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, original_text, cleaned_text, created_at`,
      [userId, originalText, cleanedText],
    );
    return result.rows[0];
  }

  static async findByUserId(userId, { limit = 10, offset = 0 } = {}) {
    const result = await pool.query(
      `SELECT id, user_id, original_text, cleaned_text, created_at
       FROM cleaning_tasks
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM cleaning_tasks WHERE user_id = $1",
      [userId],
    );
    return {
      tasks: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  static async findById(id, userId) {
    const result = await pool.query(
      "SELECT * FROM cleaning_tasks WHERE id = $1 AND user_id = $2",
      [id, userId],
    );
    return result.rows[0] || null;
  }

  static async update(id, userId, { originalText, cleanedText }) {
    const result = await pool.query(
      `UPDATE cleaning_tasks
       SET original_text = $1, cleaned_text = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [originalText, cleanedText, id, userId],
    );
    return result.rows[0] || null;
  }

  static async delete(id, userId) {
    const result = await pool.query(
      "DELETE FROM cleaning_tasks WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, userId],
    );
    return result.rowCount > 0;
  }

  // Для админа
  static async findAll({ limit = 10, offset = 0 } = {}) {
    const result = await pool.query(
      `SELECT ct.*, u.email
       FROM cleaning_tasks ct
       LEFT JOIN users u ON ct.user_id = u.id
       ORDER BY ct.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    const countResult = await pool.query("SELECT COUNT(*) FROM cleaning_tasks");
    return {
      tasks: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }
}

export default CleaningTask;
