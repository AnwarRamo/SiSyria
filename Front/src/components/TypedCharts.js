// src/components/TypedCharts.jsx (or any component you're using for Chart.js)

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js plugins
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,  // Enable the 'fill' option for line charts
  Tooltip,
  Legend
);

const TypedChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [
      {
        label: 'Example Dataset',
        data: [65, 59, 80, 81],
        fill: true,  // Now you can use the 'fill' option
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div>
      <h2>My Line Chart</h2>
      <Line data={data} />
    </div>
  );
};

export default TypedChart;
