import React from 'react';

function BookingHistory() {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Booking History</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="px-4 py-2">Booking ID</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Destination</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Add booking history data here */}
          <tr>
            <td className="px-4 py-2">12345</td>
            <td className="px-4 py-2">Jan 10, 2025</td>
            <td className="px-4 py-2">Tokyo</td>
            <td className="px-4 py-2">Confirmed</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
}

export default BookingHistory;
