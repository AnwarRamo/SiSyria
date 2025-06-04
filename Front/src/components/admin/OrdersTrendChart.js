// src/components/admin/OrdersTrendChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

const chartVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const OrdersTrendChart = ({ chartData = {} }) => {
  const { labels = [], orderCounts = [] } = chartData;

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Orders This Month',
        data: orderCounts,
        fill: true,
        backgroundColor: 'rgba(165, 180, 252, 0.3)', // Softer Indigo
        borderColor: 'rgba(129, 140, 248, 1)',     // Indigo 500
        tension: 0.4,
        pointBackgroundColor: 'rgba(129, 140, 248, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 7,
        pointHoverBorderWidth: 2,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(129, 140, 248, 1)',
        pointRadius: 5,
        borderWidth: 2.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: { 
          color: '#4B5563', // text-gray-600
          font: { size: 12, family: 'Inter, sans-serif' },
          usePointStyle: true,
          boxWidth: 8,
        }
      },
      title: {
        display: true,
        text: 'Monthly Order Volume',
        align: 'start',
        color: '#1F2937', // text-gray-800
        font: { size: 20, weight: '600', family: 'Inter, sans-serif' },
        padding: { top: 0, bottom: 20 }
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1F2937', // bg-gray-800
        titleColor: '#fff',
        bodyColor: '#E5E7EB', // text-gray-200
        borderColor: '#374151', // border-gray-700
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.formattedValue} units`,
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#E5E7EB', borderColor: '#E5E7EB' }, // border-gray-200
        ticks: { color: '#6B7280', font: { family: 'Inter, sans-serif', size: 12 }, stepSize: Math.ceil(Math.max(...orderCounts, 0) / 5) || 10, } // text-gray-500
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { family: 'Inter, sans-serif', size: 12 } }
      },
    },
  };

  if (!labels.length || !orderCounts.length) {
    return (
      <motion.div 
        variants={chartVariants} 
        className="bg-white p-6 rounded-xl shadow-lg text-center text-gray-500 h-[440px] flex items-center justify-center"
      >
        No order trend data available.
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={chartVariants} 
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div style={{ height: '400px' }}>
        <Line data={data} options={options} />
      </div>
    </motion.div>
  );
};

export default OrdersTrendChart;