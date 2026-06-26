import pool from "../config/db.js";

class User {
  static async create({ email, passwordHash, role = "user" }) {
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at",
      [email, passwordHash, role],
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      "SELECT id, email, role, created_at FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0];
  }
}

export default User;
