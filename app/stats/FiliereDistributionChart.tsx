// frontend/components/charts/FiliereDistributionChart.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

interface FiliereData {
  _id: string;
  count: number;
  error?: string;
}

const FiliereDistributionChart: React.FC = () => {
  const [data, setData] = useState<FiliereData[] | { error: string } | null>(
    null
  );

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stats/filiere-distribution`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => setData({ error: "Failed to fetch data" }));
  }, []);

  if (!data) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if ("error" in data) {
    return <p className="text-red-500">{data.error}</p>;
  }

  const labels = data.map((item) => item._id);
  const values = data.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Filière Distribution",
        data: values,
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Filière Distribution</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default FiliereDistributionChart;
