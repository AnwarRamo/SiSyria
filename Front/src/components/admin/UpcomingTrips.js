import React from 'react';

const trips = [
  {
    title: "Cusco and Machu Picchu, Peru",
    date: "16 - 19 Apr 2025",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
    participants: 8,
  },
  {
    title: "Cusco and Machu Picchu, Peru",
    date: "6 - 11 May 2025",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
    participants: 8,
  },
  {
    title: "Cusco and Machu Picchu, Peru",
    date: "6 - 11 Jun 2025",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
    participants: 8,
  },
];

function UpcomingTrips() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Upcoming Trips</h2>
        <a href="#" className="text-blue-500">View All</a>
      </div>
      <ul className="space-y-4">
        {trips.map((trip, index) => (
          <li key={index} className="bg-gray-100 p-4 rounded-lg flex items-center shadow-sm">
            <img
              src={trip.image}
              alt={trip.title}
              className="w-24 h-24 rounded-md object-cover mr-4"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{trip.title}</h3>
              <p className="text-gray-600">{trip.date}</p>
            </div>
            <span className="text-gray-600">{trip.participants}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UpcomingTrips;