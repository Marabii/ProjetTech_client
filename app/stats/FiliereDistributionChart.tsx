/* eslint-disable @typescript-eslint/no-unused-vars */
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
  // State to hold the fetched data
  const [data, setData] = useState<FiliereData[] | { error: string } | null>(
    null
  );

  // State to hold the selected graduation year; empty string represents "All Years"
  const [graduationYear, setGraduationYear] = useState<number | "">("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the query parameter based on the selected year
        const yearParam = graduationYear
          ? `?graduationYear=${graduationYear}`
          : "";
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/api/stats/filiere-distribution${yearParam}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const json = await response.json();
        setData(json);
      } catch (error: unknown) {
        setData({ error: "Failed to fetch data" });
      }
    };

    fetchData();
  }, [graduationYear]);

  if (!data) {
    return <p className="text-gray-600">Loading...</p>;
  }

  if ("error" in data) {
    return <p className="text-red-500">{data.error}</p>;
  }

  // Prepare labels and values for the chart
  const labels = data.map((item) => item._id);
  const values = data.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Filière Distribution",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.5)", // Customize as needed
        borderColor: "rgba(75, 192, 192, 1)", // Customize as needed
        borderWidth: 1,
      },
    ],
  };

  // Generate the list of years from current year to 30 years in the past
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 31 }, (_, i) => currentYear - i);

  // Handle selection change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setGraduationYear(selectedValue ? Number(selectedValue) : "");
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Filière Distribution</h2>

      {/* Select Element for Graduation Year */}
      <div className="mb-6">
        <label htmlFor="graduationYear" className="block text-gray-700 mb-2">
          Graduation Year:
        </label>
        <select
          id="graduationYear"
          value={graduationYear}
          onChange={handleYearChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Bar Chart */}

      {chartData.labels.length === 0 ? (
        <h1>Pas de data</h1>
      ) : (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: "Filière Distribution by Graduation Year",
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default FiliereDistributionChart;
