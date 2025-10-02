import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express(); // <-- ini penting, jangan sampai hilang
const port = 3001;

app.use(cors());

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
      SELECT id, name, email, branch, main_branch, SUM(amount) AS total
      FROM customers
      GROUP BY id, name, email, branch, main_branch
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
// Jalankan server
// ==========================
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
