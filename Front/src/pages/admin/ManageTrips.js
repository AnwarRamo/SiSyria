import { useEffect, useState } from 'react';
import { AdminService } from '../../api/services/admin.service';
import Card, { CardContent } from '../../components/ui/card';
import Skeleton from '../../components/ui/Skeleton';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FiMapPin, FiCalendar, FiClock, FiDollarSign, FiStar } from 'react-icons/fi';

const ManageTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTrips = async () => {
      try {
        const data = await AdminService.getAllTrips(controller.signal);
        setTrips(data);
      } catch (err) {
        toast.error(err?.message || 'An error occurred while fetching trips.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
    return () => controller.abort();
  }, []);

  const formatTripDate = (date) => {
    try {
      if (!date) return 'No date';
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? 'Invalid date' : format(parsed, 'dd MMM yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        ✈️ Manage Adventures
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-3xl bg-white/80" />
          ))
        ) : trips.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="text-6xl mb-4">🌴</div>
            <h2 className="text-2xl font-semibold text-gray-600">
              No adventures found. Start creating!
            </h2>
          </div>
        ) : (
          trips.map((trip, i) => (
            <motion.div
              key={trip._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col bg-white/90 backdrop-blur-sm overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={trip.images || 'https://source.unsplash.com/random/800x600?travel'}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://source.unsplash.com/random/800x600?nature';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white truncate">{trip.title}</h3>
                  </div>
                  {trip.featured && (
                    <div className="absolute top-4 right-4 bg-amber-400 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      <FiStar className="mr-1" /> Featured
                    </div>
                  )}
                </div>

                <CardContent className="p-6 flex-1 flex flex-col">
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                    {trip.description}
                  </p>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FiMapPin className="mr-2 text-purple-500" />
                      <span>{trip.destination || 'Unknown destination'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-purple-500" />
                      <span>{formatTripDate(trip.startDate)} - {formatTripDate(trip.endDate)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FiClock className="mr-2 text-purple-500" />
                        <span>{trip.duration} days</span>
                      </div>
                      <div className="flex items-center">
                        <FiDollarSign className="mr-2 text-purple-500" />
                        <span className="font-bold text-lg text-purple-600">
                          {trip.price?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${i < (trip.rating || 0) ? 'text-amber-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {trip.bookings || 0} bookings
                    </span>
                  </div>
                </CardContent>

                <button className="absolute bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-purple-700">
                  <FiStar className="w-5 h-5" />
                </button>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageTrips;