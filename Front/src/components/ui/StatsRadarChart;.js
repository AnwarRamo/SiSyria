import React from "react";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { Radar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const StatsRadarChart = () => {
  // Sample data - replace with actual stats from your API
  const data = {
    labels: ["Bookings", "Reviews", "Trips", "Messages", "Responses", "Activity"],
    datasets: [
      {
        label: "User Activity",
        data: [65, 59, 90, 81, 56, 55],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(99, 102, 241, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        angleLines: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        pointLabels: {
          color: "#4b5563",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
        ticks: {
          display: false,
          backdropColor: "rgba(0, 0, 0, 0)",
          color: "#6b7280",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#4b5563",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleFont: {
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          family: "'Inter', sans-serif",
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Radar 
        data={data} 
        options={options}
        aria-label="User activity radar chart"
      />
    </div>
  );
};

export default StatsRadarChart;