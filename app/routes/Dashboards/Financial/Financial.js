import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function FinancialDashboard() {
  const [omzet, setOmzet] = useState(0);
  const [topCustomers, setTopCustomers] = useState([]);
  const [trends, setTrends] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [categories, setCategories] = useState([]);

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);

  useEffect(() => {
    // --- API asli ---
    fetch("http://localhost:3001/api/omzet")
      .then((res) => res.json())
      .then((data) => setOmzet(data.total_omzet));

    fetch("http://localhost:3001/api/top-customers")
      .then((res) => res.json())
      .then((data) => setTopCustomers(data));

    fetch("http://localhost:3001/api/trends")
      .then((res) => res.json())
      .then((data) => {
        const fixed = data.map((d) => ({
          month: d.month,
          omzet: Number(d.omzet),
        }));
        setTrends(fixed);
      });

    // --- Dummy kategori data ---
    setCategories([
      { name: "Type A", value: 350000000 },
      { name: "Type B", value: 200000000 },
      { name: "Type C", value: 450000000 },
    ]);
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Highlight Omzet */}
      <section>
        <h2>Highlight Omzet</h2>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>
          {formatRupiah(omzet)}
        </p>
      </section>

      {/* Top Customers Table */}
      <section style={{ marginTop: "30px" }}>
        <h3>Top 10 Customers</h3>
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead style={{ backgroundColor: "#f5f5f5" }}>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Total Omzet</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.length > 0 ? (
              topCustomers.map((c, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{c.name}</td>
                  <td>{formatRupiah(c.total)}</td>
                  <td>{c.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Trends + Predictions Chart */}
      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        <section style={{ flex: 1 }}>
          <h3>Trends & Predictions Omzet per Bulan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[...trends, ...predictions]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(value)
                }
              />
              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(value)
                }
                labelFormatter={(label) => `Bulan: ${label}`}
              />
              <Line type="monotone" dataKey="omzet" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Kategori Omzet */}
        <section style={{ flex: 1 }}>
          <h3>Customer's Pipeline Potential (Kategori)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatRupiah(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
}
