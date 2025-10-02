// data/data-dummy.js
const branches = [
  { id: 1, name: "Main Branch", region: "Region 1" },
  { id: 2, name: "Branch A", region: "Region 1" },
];

const officers = [
  { id: 1, name: "Officer 1", branch_id: 1 },
  { id: 2, name: "Officer 2", branch_id: 2 },
];

const customers = [
  {
    id: 1,
    name: "Customer 1",
    branch_id: 1,
    category: "A",
    pipeline_value: 10000,
  },
  {
    id: 2,
    name: "Customer 2",
    branch_id: 2,
    category: "B",
    pipeline_value: 5000,
  },
];

const transactions = [
  { id: 1, customer_id: 1, branch_id: 1, amount: 1000, date: "2025-10-01" },
  { id: 2, customer_id: 2, branch_id: 2, amount: 2000, date: "2025-10-01" },
];

export { branches, officers, customers, transactions };
