import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { AdminService } from '../../api/services/admin.service';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import LoadingSpinner from '../../components/LodingSpinner';

ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale);

const TopDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await AdminService.getTopDestinations();
        // Transform the data to match expected structure
        const transformedData = response.map((dest, index) => ({
          _id: dest._id || index,
          name: dest._id || `Destination ${index + 1}`,
          percentage: dest.count || 0,
          imageUrl: dest.imageUrl || '/images/default.jpg'
        }));
        setDestinations(transformedData);
      } catch (err) {
        console.error('Error fetching top destinations:', err);
        setError('Failed to load destinations');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        Error: {error}
      </div>
    );
  }
  
  if (destinations.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No destination data available
      </div>
    );
  }

  // Calculate total for percentage calculation
  const total = destinations.reduce((sum, dest) => sum + dest.percentage, 0);
  
  // Add percentage calculation
  const destinationsWithPercentage = destinations.map(dest => ({
    ...dest,
    percentage: total > 0 ? Math.round((dest.percentage / total) * 100) : 0
  }));

  const chartData = {
    labels: destinationsWithPercentage.map((d) => d.name),
    datasets: [
      {
        data: destinationsWithPercentage.map((d) => d.percentage),
        backgroundColor: destinationsWithPercentage.map(
          (_, i) => `hsl(${(i + 1) * 60}, 70%, 60%)`
        ),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-purple-900 mb-1">Top Destinations</h2>
          <p className="text-sm text-gray-500">Based on most booked trips</p>
        </div>
        <div className="w-48 md:w-56">
          <Pie data={chartData} />
        </div>
      </div>

      <div className="divide-y">
        {destinationsWithPercentage.map((dest) => (
          <div key={dest._id} className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="w-14 h-14 rounded-lg object-cover border border-gray-200 shadow-sm"
                onError={(e) => { e.target.src = '/images/default.jpg'; }}
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{dest.name}</h4>
                <p className="text-sm text-gray-500">Destination</p>
              </div>
            </div>
            <span className="text-purple-700 font-semibold text-lg">
              {dest.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDestinations;