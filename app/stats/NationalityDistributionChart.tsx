// frontend/components/charts/NationalityDistributionChart.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

interface NationalityData {
  _id: string;
  count: number;
  error?: string;
}

const NationalityDistributionChart: React.FC = () => {
  const [data, setData] = useState<
    NationalityData[] | { error: string } | null
  >(null);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/stats/nationality-distribution`
    )
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
        label: "Nationality Distribution",
        data: values,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          // Add more colors if needed
        ],
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Nationality Distribution</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default NationalityDistributionChart;
