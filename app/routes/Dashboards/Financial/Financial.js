import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function FinancialDashboard() {
  const [omzet, setOmzet] = useState(0);
  const [topCustomers, setTopCustomers] = useState([]);
  const [trends, setTrends] = useState([]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  useEffect(() => {
    fetch("http://localhost:3001/api/omzet")
      .then((res) => res.json())
      .then((data) => setOmzet(data.total_omzet));

    fetch("http://localhost:3001/api/top-customers")
      .then((res) => res.json())
      .then((data) => setTopCustomers(data));

    fetch("http://localhost:3001/api/trends")
      .then((res) => res.json())
      .then((data) => {
        console.log("Trends from API (raw):", data);

        const fixed = data.map((d) => ({
          month: d.month,
          omzet: Number(d.omzet), // <--- PENTING: convert ke number
        }));

        console.log("Trends after fix:", fixed);
        setTrends(fixed);
      });
  }, []);

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
                <td colSpan="3" style={{ textAlign: "center" }}>
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Trends Chart */}
      <section style={{ marginTop: "30px" }}>
        <h3>Trends Omzet per Bulan</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
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
    </div>
  );
}
