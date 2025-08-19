import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlane } from 'react-icons/fa';
import TravelGuide from '../../components/public/components/TravelGuide';
import Itinerary from '../../components/public/components/Itinerary';
import Gallery from '../../components/public/components/Gallery';
import LoadingSpinner from '../../components/LodingSpinner';
import Navbar from '../../layout/Navbar';
import CountdownTimer from '../../components/user/CountdownTimer';
import TicketBooking from '../../components/user/TicketBooking';
import { useAuthStore } from '../../api/stores/auth.store';

// Helper function to get continent from destination
const getContinentFromDestination = (destination) => {
  const destinationLower = destination?.toLowerCase() || '';
  
  const continentMap = {
    // Asia
    'japan': 'Asia', 'china': 'Asia', 'india': 'Asia', 'thailand': 'Asia', 'vietnam': 'Asia',
    'cambodia': 'Asia', 'laos': 'Asia', 'myanmar': 'Asia', 'malaysia': 'Asia', 'singapore': 'Asia',
    'indonesia': 'Asia', 'philippines': 'Asia', 'south korea': 'Asia', 'north korea': 'Asia',
    'mongolia': 'Asia', 'kazakhstan': 'Asia', 'uzbekistan': 'Asia', 'kyrgyzstan': 'Asia',
    'tajikistan': 'Asia', 'turkmenistan': 'Asia', 'afghanistan': 'Asia', 'pakistan': 'Asia',
    'bangladesh': 'Asia', 'sri lanka': 'Asia', 'nepal': 'Asia', 'bhutan': 'Asia',
    'maldives': 'Asia', 'taiwan': 'Asia', 'hong kong': 'Asia', 'macau': 'Asia',
    
    // Europe
    'france': 'Europe', 'germany': 'Europe', 'italy': 'Europe', 'spain': 'Europe', 'uk': 'Europe',
    'united kingdom': 'Europe', 'england': 'Europe', 'scotland': 'Europe', 'wales': 'Europe',
    'ireland': 'Europe', 'netherlands': 'Europe', 'belgium': 'Europe', 'switzerland': 'Europe',
    'austria': 'Europe', 'poland': 'Europe', 'czech republic': 'Europe', 'slovakia': 'Europe',
    'hungary': 'Europe', 'romania': 'Europe', 'bulgaria': 'Europe', 'greece': 'Europe',
    'turkey': 'Europe', 'russia': 'Europe', 'ukraine': 'Europe', 'belarus': 'Europe',
    'lithuania': 'Europe', 'latvia': 'Europe', 'estonia': 'Europe', 'finland': 'Europe',
    'sweden': 'Europe', 'norway': 'Europe', 'denmark': 'Europe', 'iceland': 'Europe',
    'portugal': 'Europe', 'croatia': 'Europe', 'slovenia': 'Europe', 'serbia': 'Europe',
    'montenegro': 'Europe', 'albania': 'Europe', 'macedonia': 'Europe', 'kosovo': 'Europe',
    'bosnia': 'Europe', 'herzegovina': 'Europe', 'moldova': 'Europe', 'georgia': 'Europe',
    'armenia': 'Europe', 'azerbaijan': 'Europe', 'cyprus': 'Europe', 'malta': 'Europe',
    'luxembourg': 'Europe', 'liechtenstein': 'Europe', 'monaco': 'Europe', 'andorra': 'Europe',
    'san marino': 'Europe', 'vatican': 'Europe', 'vatican city': 'Europe',
    
    // North America
    'usa': 'North America', 'united states': 'North America', 'canada': 'North America',
    'mexico': 'North America', 'cuba': 'North America', 'jamaica': 'North America',
    'bahamas': 'North America', 'haiti': 'North America', 'dominican republic': 'North America',
    'puerto rico': 'North America', 'trinidad': 'North America', 'tobago': 'North America',
    'barbados': 'North America', 'grenada': 'North America', 'st lucia': 'North America',
    'antigua': 'North America', 'barbuda': 'North America', 'st kitts': 'North America',
    'nevis': 'North America', 'dominica': 'North America', 'st vincent': 'North America',
    'grenadines': 'North America', 'belize': 'North America', 'guatemala': 'North America',
    'honduras': 'North America', 'el salvador': 'North America', 'nicaragua': 'North America',
    'costa rica': 'North America', 'panama': 'North America',
    
    // South America
    'brazil': 'South America', 'argentina': 'South America', 'chile': 'South America',
    'peru': 'South America', 'colombia': 'South America', 'venezuela': 'South America',
    'ecuador': 'South America', 'bolivia': 'South America', 'paraguay': 'South America',
    'uruguay': 'South America', 'guyana': 'South America', 'suriname': 'South America',
    'french guiana': 'South America', 'falkland islands': 'South America',
    
    // Africa
    'egypt': 'Africa', 'morocco': 'Africa', 'tunisia': 'Africa', 'algeria': 'Africa',
    'libya': 'Africa', 'sudan': 'Africa', 'south sudan': 'Africa', 'ethiopia': 'Africa',
    'somalia': 'Africa', 'djibouti': 'Africa', 'eritrea': 'Africa', 'kenya': 'Africa',
    'tanzania': 'Africa', 'uganda': 'Africa', 'rwanda': 'Africa', 'burundi': 'Africa',
    'congo': 'Africa', 'democratic republic of congo': 'Africa', 'central african republic': 'Africa',
    'cameroon': 'Africa', 'chad': 'Africa', 'niger': 'Africa', 'nigeria': 'Africa',
    'benin': 'Africa', 'togo': 'Africa', 'ghana': 'Africa', 'ivory coast': 'Africa',
    'liberia': 'Africa', 'sierra leone': 'Africa', 'guinea': 'Africa', 'guinea-bissau': 'Africa',
    'senegal': 'Africa', 'gambia': 'Africa', 'mauritania': 'Africa', 'mali': 'Africa',
    'burkina faso': 'Africa', 'cape verde': 'Africa', 'sao tome': 'Africa', 'principe': 'Africa',
    'equatorial guinea': 'Africa', 'gabon': 'Africa', 'angola': 'Africa', 'zambia': 'Africa',
    'malawi': 'Africa', 'mozambique': 'Africa', 'zimbabwe': 'Africa', 'botswana': 'Africa',
    'namibia': 'Africa', 'south africa': 'Africa', 'lesotho': 'Africa', 'eswatini': 'Africa',
    'madagascar': 'Africa', 'mauritius': 'Africa', 'seychelles': 'Africa', 'comoros': 'Africa',
    
    // Oceania
    'australia': 'Oceania', 'new zealand': 'Oceania', 'fiji': 'Oceania', 'papua new guinea': 'Oceania',
    'solomon islands': 'Oceania', 'vanuatu': 'Oceania', 'new caledonia': 'Oceania',
    'samoa': 'Oceania', 'tonga': 'Oceania', 'tuvalu': 'Oceania', 'kiribati': 'Oceania',
    'marshall islands': 'Oceania', 'micronesia': 'Oceania', 'palau': 'Oceania',
    'nauru': 'Oceania', 'cook islands': 'Oceania', 'niue': 'Oceania', 'tokelau': 'Oceania',
    
    // Middle East
    'syria': 'Middle East', 'lebanon': 'Middle East', 'israel': 'Middle East', 'palestine': 'Middle East',
    'jordan': 'Middle East', 'iraq': 'Middle East', 'iran': 'Middle East', 'kuwait': 'Middle East',
    'saudi arabia': 'Middle East', 'yemen': 'Middle East', 'oman': 'Middle East', 'uae': 'Middle East',
    'united arab emirates': 'Middle East', 'qatar': 'Middle East', 'bahrain': 'Middle East'
  };
  
  for (const [country, continent] of Object.entries(continentMap)) {
    if (destinationLower.includes(country)) {
      return continent;
    }
  }
  
  return 'Unknown';
};

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPointing, setIsPointing] = useState(false);
  const [isWaving, setIsWaving] = useState(true);
  const [showTicketBooking, setShowTicketBooking] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  useEffect(() => {
    const abortController = new AbortController();

    const fetchTrip = async () => {
      if (!tripId || tripId === 'undefined') {
        setError('Invalid trip ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const baseUrl = 'http://localhost:8080';
        const url = `${baseUrl}/api/trips/${tripId}`;

        const response = await axios.get(url, {
          signal: abortController.signal,
          withCredentials: true
        });

        if (response.data && response.data.success) {
          setTrip({
            ...response.data.data,
            images: normalizeTripImages(response.data.data.images)
          });
        } else {
          setError('Invalid response structure from server');
        }
      } catch (err) {
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          return;
        }
        let errorMessage = 'Failed to load trip details';
        if (err.response) {
          if (err.response.status === 404) {
            errorMessage = 'Trip not found';
          } else if (err.response.data && err.response.data.error) {
            errorMessage = err.response.data.error;
          }
        }
        setError(errorMessage);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTrip();

    const timer = setTimeout(() => setIsWaving(false), 3000);

    return () => {
      abortController.abort();
      clearTimeout(timer);
    };
  }, [tripId]);

  const normalizeTripImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images) && images.every(img => typeof img === 'string')) return images;
    if (Array.isArray(images)) {
      return images.map(img => {
        if (typeof img === 'string') return img;
        if (img.url) return img.url;
        if (img.path) return `${process.env.REACT_APP_API_BASE || ''}/uploads/${img.path}`;
        return null;
      }).filter(Boolean);
    }
    if (typeof images === 'object') {
      if (images.url) return [images.url];
      if (images.path) return [`${process.env.REACT_APP_API_BASE || ''}/uploads/${images.path}`];
    }
    return [];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Check availability';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePriceHover = () => {
    setIsPointing(true);
    setTimeout(() => setIsPointing(false), 2000);
  };

  const handleWave = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1500);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-red-500 text-center mb-6">
            <div className="text-2xl font-bold mb-2">Error Loading Trip</div>
            <p className="text-lg">{error}</p>
          </div>
          <button
            className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors"
            onClick={() => navigate('/travel')}
          >
            Browse Other Trips
          </button>
        </div>
      </>
    );
  }

  if (!trip) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="text-gray-600 text-center mb-6">
            <div className="text-2xl font-bold mb-2">Trip Not Found</div>
            <p className="text-lg">The trip you're looking for doesn't exist or has been removed.</p>
          </div>
          <button
            className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors"
            onClick={() => navigate('/travel')}
          >
            Browse Other Trips
          </button>
        </div>
      </>
    );
  }

  const continent = getContinentFromDestination(trip.destination);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-emerald-50 font-sans overflow-x-hidden">
        {/* Hero Section */}
        <div className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            {trip.images?.length > 0 ? (
              <div
                className="bg-cover bg-center w-full h-full transform scale-110 filter brightness-90"
                style={{ backgroundImage: `url(${trip.images[0]})` }}
              ></div>
            ) : (
              <div className="bg-[url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center w-full h-full transform scale-110 filter brightness-90"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white opacity-80"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-xl mb-4">
              {trip.title}
            </h1>
            <p className="text-xl md:text-2xl text-white font-medium max-w-2xl mb-8 drop-shadow-md">
              {trip.description}
            </p>

            {/* Countdown Timer */}
            {trip.startDate && <CountdownTimer startDate={trip.startDate} />}

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg">
                <p className="text-gray-700 font-medium">From</p>
                <p
                  className="text-3xl font-bold text-emerald-600"
                  onMouseEnter={handlePriceHover}
                >
                  ${trip.price}
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg">
                <p className="text-gray-700 font-medium">Duration</p>
                <p className="text-2xl font-bold text-amber-600">{trip.days} Days</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg">
                <p className="text-gray-700 font-medium">Next Departure</p>
                <p className="text-xl font-bold text-sky-600">
                  {trip.startDate ? formatDate(trip.startDate) : 'Check availability'}
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg">
                <p className="text-gray-700 font-medium">End Date</p>
                <p className="text-xl font-bold text-sky-600">
                  {trip.endDate ? formatDate(trip.endDate) : 'TBA'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <button
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse"
                onClick={handleWave}
              >
                I Want This Trip!
              </button>
              
              {trip.includeFlights && (
                <>
                  <button
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      if (!isLoggedIn) {
                        navigate('/login');
                        return;
                      }
                      navigate(`/book-ticket/${trip._id}`);
                    }}
                  >
                    Book Plane Ticket (Full Page)
                  </button>
                  <button
                    className="bg-gradient-to-r from-blue-400 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      if (!isLoggedIn) {
                        navigate('/login');
                        return;
                      }
                      setShowTicketBooking(true);
                    }}
                  >
                    Book Plane Ticket (Popup)
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Animated Travel Guide */}
          <TravelGuide isPointing={isPointing} isWaving={isWaving} />
        </div>

                  {/* Trip Details Section */}
          <div className="py-10 px-4 max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Trip Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="mb-2"><span className="font-semibold">Start:</span> {trip.startDate ? formatDate(trip.startDate) : 'TBA'}</p>
                  <p className="mb-2"><span className="font-semibold">End:</span> {trip.endDate ? formatDate(trip.endDate) : 'TBA'}</p>
                  <p className="mb-2"><span className="font-semibold">Duration:</span> {trip.days} days</p>
                  <p className="mb-2"><span className="font-semibold">Destination:</span> {trip.destination}</p>
                  <p className="mb-2"><span className="font-semibold">Continent:</span> {continent}</p>
                  <p className="mb-2"><span className="font-semibold">Type:</span> {trip.type}</p>
                  <p className="mb-2"><span className="font-semibold">Capacity:</span> {trip.capacity}</p>
                  <p className="mb-2"><span className="font-semibold">Status:</span> {trip.status}</p>
                </div>
                <div>
                  <p className="mb-2"><span className="font-semibold">Included:</span></p>
                  <ul className="list-disc list-inside text-green-700 mb-2">
                    {trip.included && trip.included.length > 0 ? trip.included.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    )) : <li>See itinerary</li>}
                  </ul>
                  <p className="mb-2"><span className="font-semibold">Not Included:</span></p>
                  <ul className="list-disc list-inside text-red-700">
                    {trip.notIncluded && trip.notIncluded.length > 0 ? trip.notIncluded.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    )) : <li>See itinerary</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Flight Information */}
            {trip.includeFlights && (
              <div className="mb-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FaPlane className="mr-2 text-blue-600" />
                  Flight Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Departure</h4>
                    <p className="text-gray-700">{trip.departureCity} ({trip.departureAirport})</p>
                    <p className="text-sm text-gray-500">
                      {trip.departureTime ? new Date(trip.departureTime).toLocaleString() : 'TBA'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Arrival</h4>
                    <p className="text-gray-700">{trip.arrivalCity} ({trip.arrivalAirport})</p>
                    <p className="text-sm text-gray-500">
                      {trip.returnTime ? new Date(trip.returnTime).toLocaleString() : 'TBA'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded border border-blue-300">
                  <p className="text-blue-800">
                    <span className="font-semibold">Airline:</span> {trip.airline} | 
                    <span className="font-semibold ml-2">Flight:</span> {trip.flightNumber}
                    {trip.returnFlightNumber && (
                      <>
                        | <span className="font-semibold ml-2">Return Flight:</span> {trip.returnFlightNumber}
                      </>
                    )}
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    <span className="font-semibold">Available Seats:</span> {trip.availableSeats} | 
                    <span className="font-semibold ml-2">Ticket Price:</span> ${trip.ticketPrice || trip.price}
                  </p>
                </div>
              </div>
            )}

          {/* Day Plans */}
          {trip.dayPlans && trip.dayPlans.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Day-by-Day Itinerary</h3>
              <div className="space-y-4">
                {trip.dayPlans.map((day, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow p-4 border border-gray-100">
                    <div className="font-semibold text-emerald-700 mb-1">Day {day.dayIndex}:</div>
                    <div className="mb-2 text-gray-700">{day.details}</div>
                    {day.meals && day.meals.length > 0 && (
                      <div className="mb-1 text-sm text-gray-600">
                        <span className="font-semibold">Meals:</span> {day.meals.map(m => `${m.type}: ${m.details}`).join(', ')}
                      </div>
                    )}
                    {day.images && day.images.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {day.images.map((img, i) => (
                          <img key={i} src={img} alt={`Day ${day.dayIndex} image`} className="w-24 h-16 object-cover rounded" />
                        ))}
                      </div>
                    )}
                    {day.hotelDocument && (
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-semibold">Hotel:</span> <img src={day.hotelDocument} alt="Hotel" className="inline w-20 h-12 object-cover rounded ml-2" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Gallery */}
        {trip.images && <Gallery images={trip.images} />}

        {/* Final CTA */}
        <div className="py-20 bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6">Ready for Your {trip.destination} Adventure?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Join our next departure and experience the magic of {trip.destination} with our expert guides and like-minded travelers.
            </p>
            <button className="bg-white text-sky-600 hover:bg-gray-100 font-bold py-4 px-12 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all duration-300">
              Book Your Trip Now
            </button>
            <p className="mt-6 text-sky-100">Limited spots available</p>
          </div>
        </div>

        <footer className="py-8 bg-gray-900 text-white text-center">
          <p>© 2023 Wanderlust Adventures. All rights reserved.</p>
        </footer>
      </div>

      {/* Ticket Booking Modal */}
      {showTicketBooking && trip && (
        <TicketBooking
          trip={trip}
          onClose={() => setShowTicketBooking(false)}
          onSuccess={(ticketData) => {
            console.log('Ticket booked successfully:', ticketData);
            setShowTicketBooking(false);
          }}
        />
      )}
    </>
  );
};

export default TripDetails;
