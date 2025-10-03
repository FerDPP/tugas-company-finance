import React, { useEffect, useState } from "react";

function Monitor() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [branch, setBranch] = useState("");
  const [mainBranch, setMainBranch] = useState("");
  const [officer, setOfficer] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 🔹 state search
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  useEffect(() => {
    fetch("http://localhost:3001/api/customers?page=1&limit=500000")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setFiltered(data);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
        setCustomers([]);
      });
  }, []);

  // fungsi filter
  useEffect(() => {
    let data = customers;

    if (branch) data = data.filter((c) => c.branch === branch);
    if (mainBranch) data = data.filter((c) => c.main_branch === mainBranch);
    if (officer) data = data.filter((c) => c.officer === officer);
    if (searchTerm)
      data = data.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    setFiltered(data);
    setCurrentPage(1); // reset ke halaman pertama tiap kali filter berubah
  }, [branch, mainBranch, officer, searchTerm, customers]);

  // hitung data per halaman
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filtered.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Monitor Data Customers</h1>
      <h2>
        Showing {paginatedData.length} of {filtered.length} customers
      </h2>

      {/* Filter Controls */}
      <div style={{ marginBottom: "20px" }}>
        {/* 🔍 Search Nama */}
        <input
          type="text"
          placeholder="Cari nama customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />

        <select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="">All Branch</option>
          {[...new Set(customers.map((c) => c.branch))].map((b, i) => (
            <option key={i} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={mainBranch}
          onChange={(e) => setMainBranch(e.target.value)}
        >
          <option value="">All Main Branch</option>
          {[...new Set(customers.map((c) => c.main_branch))].map((mb, i) => (
            <option key={i} value={mb}>
              {mb}
            </option>
          ))}
        </select>

        <select value={officer} onChange={(e) => setOfficer(e.target.value)}>
          <option value="">All Officer</option>
          {[...new Set(customers.map((c) => c.officer))].map((o, i) => (
            <option key={i} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel */}
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Total Omzet</th>
            <th>Branch</th>
            <th>Main Branch</th>
            <th>Officer</th>
            <th>Type</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((c, i) => (
            <tr key={i}>
              <td>{startIndex + i + 1}</td>
              <td>{c.name}</td>
              <td>
                {Number(c.amount).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </td>
              <td>{c.branch}</td>
              <td>{c.main_branch}</td>
              <td>{c.officer}</td>
              <td>{c.type}</td>
              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Monitor;
