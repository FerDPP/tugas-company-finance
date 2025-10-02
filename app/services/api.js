export const fetchOmzet = async () => {
  const response = await fetch("http://localhost:3001/omzet");
  const data = await response.json();
  return data.totalOmzet;
};

export const fetchTop10 = async () => {
  const response = await fetch("http://localhost:3001/top10");
  const data = await response.json();
  return data;
};

export const fetchRevenueTrend = async () => {
  const response = await fetch("http://localhost:3001/revenue-trend");
  const data = await response.json();
  return data;
};
