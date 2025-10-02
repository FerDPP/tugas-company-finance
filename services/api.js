import {
  branches,
  officers,
  customers,
  transactions,
} from "../data/data-dummy";

export function getBranches() {
  return branches;
}

export function getTopOfficers(limit = 5) {
  return officers.slice(0, limit);
}

export function getOmzet(branchId) {
  const branchTransactions = transactions.filter(
    (t) => t.branch_id === branchId
  );
  return branchTransactions.reduce((sum, t) => sum + t.amount, 0);
}
