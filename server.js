import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcryptjs"; // untuk cek password
import jwt from "jsonwebtoken"; // opsional: untuk token login

const app = express(); // <-- ini penting, jangan sampai hilang
const port = 3001;

app.use(cors());
app.use(express.json()); // supaya bisa baca req.body JSON

// 🔹 buat koneksi pool sekali di awal
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // sesuaikan dengan MySQL Anda
  database: "financial_dashboard",
});

// ==========================
// API Customers dengan Filter
// ==========================
app.get("/api/customers", async (req, res) => {
  try {
    const { page = 1, limit = 50, branch, mainBranch, officer } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT id, name, email, address, phone, branch, main_branch, officer, category, type, amount, pipeline_value, created_at
      FROM customers
      WHERE 1=1
    `;
    let params = [];

    // filter opsional
    if (branch) {
      sql += " AND branch = ?";
      params.push(branch);
    }
    if (mainBranch) {
      sql += " AND main_branch = ?";
      params.push(mainBranch);
    }
    if (officer) {
      sql += " AND officer = ?";
      params.push(officer);
    }

    // tambahkan limit & offset
    sql += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(sql, params);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// ==========================
// API Omzet
// ==========================
app.get("/api/omzet", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT SUM(amount) AS total_omzet FROM customers"
    );
    res.json({ total_omzet: rows[0].total_omzet || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch omzet" });
  }
});

// ==========================
// API Top Customers
// ==========================
app.get("/api/top-customers", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, email, branch, main_branch, officer, category, type, pipeline_value, SUM(amount) AS total
      FROM customers
      GROUP BY id, name, email, branch, main_branch, officer, category, type, pipeline_value
      ORDER BY total DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top customers" });
  }
});

// ==========================
// API Trends
// ==========================
app.get("/api/trends", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(amount) AS omzet
      FROM customers
      GROUP BY month
      ORDER BY month ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

// ==========================
// Pipeline Potential Customers
// ==========================
app.get("/api/pipeline", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT type, pipeline_value
      FROM customers
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

// ==========================
// API Notifications
// ==========================
app.get("/api/notifications", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        n.*, 
        c.name AS customer_name, 
        c.officer, 
        c.branch AS customer_branch
      FROM notifications n
      LEFT JOIN customers c ON n.customer_id = c.id
      ORDER BY n.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error ambil notifikasi:", err);
    res.status(500).json({ error: "Gagal ambil data notifikasi" });
  }
});

// ==========================
// API Login
// ==========================
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username dan password wajib diisi" });
    }

    // cek apakah user ada
    const [rows] = await pool.query(
      "SELECT * FROM logins WHERE username = ? AND is_active = 1 LIMIT 1",
      [username]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ error: "User tidak ditemukan / tidak aktif" });
    }

    const user = rows[0];

    // cek password (dibandingkan hash bcrypt)
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Password salah" });
    }

    // jika ingin pakai JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      "SECRET_KEY_JWT", // ganti pakai env var
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error login:", err);
    res.status(500).json({ error: "Gagal login" });
  }
});

// ==========================
// Jalankan server
// ==========================
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
