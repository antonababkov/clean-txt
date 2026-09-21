import pool from "../config/db.js";

class CleaningTask {
  static async create({
    userId,
    originalText,
    cleanedText,
    removeHiddenMarkers = true,
  }) {
    const result = await pool.query(
      `INSERT INTO cleaning_tasks (user_id, original_text, cleaned_text, remove_hidden_markers)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, original_text, cleaned_text, remove_hidden_markers, created_at`,
      [userId, originalText, cleanedText, removeHiddenMarkers],
    );
    return result.rows[0];
  }

  static async findByUserId(userId, { limit = 10, offset = 0 } = {}) {
    const result = await pool.query(
      `SELECT id, user_id, original_text, cleaned_text, remove_hidden_markers, created_at
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

  static async update(
    id,
    userId,
    { originalText, cleanedText, removeHiddenMarkers = true },
  ) {
    const result = await pool.query(
      `UPDATE cleaning_tasks
       SET original_text = $1, cleaned_text = $2, remove_hidden_markers = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [originalText, cleanedText, removeHiddenMarkers, id, userId],
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

  static async adminGetTasks({
    userId = null,
    days = null,
    limit = 10,
    offset = 0,
  } = {}) {
    // Базовый запрос с JOIN для получения email пользователя
    let query = `
    SELECT 
      ct.id,
      ct.user_id,
      u.email,
      ct.original_text,
      ct.cleaned_text,
      ct.remove_hidden_markers,
      ct.created_at,
      ct.updated_at
    FROM cleaning_tasks ct
    LEFT JOIN users u ON ct.user_id = u.id
    WHERE 1=1
  `;
    const params = [];
    let paramIndex = 1;

    if (userId) {
      query += ` AND ct.user_id = $${paramIndex}`;
      params.push(userId);
      paramIndex++;
    }

    if (days) {
      query += ` AND ct.created_at >= NOW() - INTERVAL '1 day' * $${paramIndex}`;
      params.push(parseInt(days));
      paramIndex++;
    }

    // Сортировка и пагинация
    query += ` ORDER BY ct.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    // Получить общее количество для пагинации (без учёта limit/offset)
    let countQuery = `
    SELECT COUNT(*) 
    FROM cleaning_tasks ct
    WHERE 1=1
  `;
    const countParams = [];
    let countIndex = 1;

    if (userId) {
      countQuery += ` AND ct.user_id = $${countIndex}`;
      countParams.push(userId);
      countIndex++;
    }
    if (days) {
      countQuery += ` AND ct.created_at >= NOW() - INTERVAL '1 day' * $${countIndex}`;
      countParams.push(parseInt(days));
      countIndex++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return {
      tasks: result.rows,
      total,
    };
  }
}

export default CleaningTask;
