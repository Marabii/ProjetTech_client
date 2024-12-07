// frontend/components/charts/TotalStudentsChart.tsx
"use client";

import React, { useEffect, useState } from "react";

interface TotalStudentsData {
  count?: number;
  error?: string;
}

const TotalStudentsChart: React.FC = () => {
  const [data, setData] = useState<TotalStudentsData | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stats/total-students`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => setData({ error: "Failed to fetch data" }));
  }, []);

  if (!data) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if (data.error) {
    return <p className="text-red-500">{data.error}</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Total Students</h2>
      <p className="text-4xl font-semibold text-center">{data.count}</p>
    </div>
  );
};

export default TotalStudentsChart;
