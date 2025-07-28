import React, { useEffect, useState } from 'react';
import { AdminService } from '../../api/services/admin.service';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function RevenueOverview() {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    revenueLastMonth: 0,
    monthlyRevenue: [], // Array to hold the monthly revenue data for the line chart
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch revenue data from the backend API
    const fetchRevenueData = async () => {
      try {
        const data = await AdminService.getRevenueAnalytics();
        
        // Transform the data to match our component's expected structure
        // The backend returns an array of monthly data, we need to process it
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthlyRevenue = months.map((month, index) => {
          const monthData = data.find(item => item._id === index + 1);
          return monthData ? monthData.totalRevenue : 0;
        });

        // Calculate totals
        const totalRevenue = data.reduce((sum, item) => sum + (item.totalRevenue || 0), 0);
        const currentMonth = new Date().getMonth();
        const revenueLastMonth = data.find(item => item._id === currentMonth)?.totalRevenue || 0;

        setRevenueData({
          totalRevenue,
          revenueLastMonth,
          monthlyRevenue,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setError('Failed to fetch revenue data.');
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  // Prepare data for the Line chart
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.monthlyRevenue.slice(0, 8), // Only show first 8 months
        borderColor: 'rgba(128, 0, 128, 1)', // Purple color
        backgroundColor: 'rgba(128, 0, 128, 0.2)',
        borderWidth: 5,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend to match design
      },
      title: {
        display: false, // Hide title to match design
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.dataset.label + ': $' + tooltipItem.raw;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide grid lines
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // Light grid color
        },
      },
    },
  };

  // Handle loading and error states
  if (loading) {
    return <div>Loading revenue data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-4">
      <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
      <div className="relative">
        <h3 className="absolute top-0 right-0 text-xl font-semibold text-purple-700">
          ${revenueData.totalRevenue.toLocaleString()} {/* Display total revenue */}
        </h3>
        <Line data={chartData} options={options} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <p className="text-purple-800">Total Earnings</p>
          <p className="text-2xl font-semibold">${revenueData.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <p className="text-purple-800">Last Month</p>
          <p className="text-2xl font-semibold">${revenueData.revenueLastMonth.toLocaleString()}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <p className="text-purple-800">Monthly Average</p>
          <p className="text-2xl font-semibold">${Math.round(revenueData.totalRevenue / 12).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default RevenueOverview;
