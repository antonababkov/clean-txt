import { Parser } from "json2csv";
import pool from "../config/db.js";

export const exportTasksCSV = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    let query = `
      SELECT id, original_text, cleaned_text, remove_hidden_markers, created_at
      FROM cleaning_tasks
    `;
    const params = [];
    if (role !== "admin") {
      query += " WHERE user_id = $1";
      params.push(userId);
    }
    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    const tasks = result.rows;

    if (tasks.length === 0) {
      return res.status(404).json({ message: "Нет задач для экспорта" });
    }

    const formattedTasks = tasks.map((task) => ({
      ...task,
      created_at: new Date(task.created_at).toLocaleString(),
    }));

    const parser = new Parser({
      fields: ["id", "original_text", "cleaned_text", "remove_hidden_markers", "created_at"],
      header: true,
    });
    const csv = parser.parse(formattedTasks);

    res.header("Content-Type", "text/csv");
    res.attachment("tasks_export.csv");
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
