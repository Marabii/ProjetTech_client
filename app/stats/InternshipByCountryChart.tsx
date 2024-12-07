// frontend/components/charts/InternshipByCountryChart.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

interface InternshipCountryData {
  _id: string;
  count: number;
  error?: string;
}

const InternshipByCountryChart: React.FC = () => {
  const [data, setData] = useState<
    InternshipCountryData[] | { error: string } | null
  >(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stats/internship-by-country`)
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
        label: "Internship by Country",
        data: values,
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Internships by Country</h2>
      <Doughnut data={chartData} />
    </div>
  );
};

export default InternshipByCountryChart;
