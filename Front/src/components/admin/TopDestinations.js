import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Registering the necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

function TopDestinations() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/top-destinations');
        setDestinations(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDestinations();
  }, []);

  // Prepare data for the pie chart
  const chartData = {
    labels: destinations.map((destination) => destination.name),
    datasets: [
      {
        data: destinations.map((destination) => destination.percentage),
        backgroundColor: destinations.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`), // Random color generator for each segment
        borderColor: 'white',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-md mb-4">
      <h2 className="text-xl font-semibold mb-4">Top Destinations</h2>
      <p className="text-sm text-gray-600 mb-4">245,930 Customers</p>

      {/* Pie chart section */}
      <div className="mb-6">
        <Pie data={chartData} />
      </div>

      {/* List of destinations */}
      <ul>
        {destinations.map((destination) => (
          <li key={destination._id} className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img
                src={destination.imageUrl}
                alt={destination.name}
                className="h-12 w-12 object-cover rounded-md mr-4"
              />
              <span className="text-lg font-semibold">{destination.name}</span>
            </div>
            <span className="text-gray-600">{destination.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopDestinations;
