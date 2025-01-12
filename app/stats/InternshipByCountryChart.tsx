"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

interface InternshipCountryData {
  _id: string;
  count: number;
  error?: string;
}

const InternshipByCountryChart: React.FC = () => {
  // State to hold the fetched data
  const [data, setData] = useState<
    InternshipCountryData[] | { error: string } | null
  >(null);

  // State to hold the selected graduation year; empty string represents "All Years"
  const [graduationYear, setGraduationYear] = useState<number | "">("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construct the query parameter based on the selected year
        const yearParam = graduationYear
          ? `?graduationYear=${graduationYear}`
          : "";
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/api/stats/internship-by-country${yearParam}`
        );
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        const json = await res.json();
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
  const labels = data.map((item) =>
    item._id.toUpperCase() !== "ISRAEL" ? item._id : "OCCUPATION"
  );

  const values = data.map((item) => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Internship by Country",
        data: values,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          // Add more colors if needed
        ],
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
      <h2 className="text-xl font-bold mb-4">Stages par pays</h2>

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
          <option value="">Toutes les années</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Doughnut Chart */}
      {chartData.labels.length === 0 ? (
        <h1>Pas de data</h1>
      ) : (
        <Doughnut data={chartData} />
      )}
    </div>
  );
};

export default InternshipByCountryChart;
