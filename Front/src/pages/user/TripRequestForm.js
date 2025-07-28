import React, { useState, useEffect, useCallback } from 'react';
import {
  PlusCircle,
  Trash2,
  Calendar,
  Hotel,
  Utensils,
  Upload,
  Sun,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Loader2,
  FileText,
  Sparkles,
  Plane,
  CloudSun
} from 'lucide-react';
import { TripDesignService } from '../../api/services/TripDesignService';
import Navbar from '../../layout/Navbar';

const TravelBuddy = ({ state }) => {
  const states = {
    idle: {
      transform: 'translateY(0px)',
      icon: <Plane size={48} className="text-[#115d5a] transform -rotate-12" />,
      message: "Let's plan an adventure!"
    },
    thinking: {
      transform: 'translateY(-5px) rotate(5deg)',
      icon: <CloudSun size={48} className="text-[#E7C873]" />,
      message: "What a great idea..."
    },
    celebrating: {
      transform: 'translateY(0px) scale(1.1)',
      icon: <Sparkles size={48} className="text-[#E7C873]" />,
      message: "Saved! This trip will be amazing!"
    },
  };

  const currentState = states[state] || states.idle;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg text-[#115d5a] transition-all duration-500 ease-in-out">
      <div
        className="transition-transform duration-500"
        style={{ transform: currentState.transform }}
      >
        {currentState.icon}
      </div>
      <p className="font-semibold text-lg">{currentState.message}</p>
    </div>
  );
};

const Stepper = ({ currentDay, totalDays, setDay }) => (
  <div className="flex items-center justify-center p-4 space-x-2 overflow-x-auto">
    {Array.from({ length: totalDays }).map((_, index) => (
      <button
        key={index}
        onClick={() => setDay(index)}
        className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 font-semibold ${
          index === currentDay
            ? 'bg-gradient-to-r from-[#E7C873] to-[#115d5a] text-white shadow-lg scale-110'
            : 'bg-white text-[#115d5a] border border-gray-300 hover:shadow-md'
        }`}
      >
        Day {index + 1}
      </button>
    ))}
  </div>
);

const MediaUploader = ({ files, onFilesChange, fileTypes, label }) => {
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    onFilesChange([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    if (updatedFiles[index]?.preview) {
      URL.revokeObjectURL(updatedFiles[index].preview);
    }
    updatedFiles.splice(index, 1);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="mt-2">
      <label className="block text-sm font-medium text-[#115d5a] mb-1">{label}</label>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E7C873] rounded-xl cursor-pointer bg-white hover:bg-[#E7C873]/10 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-[#115d5a]" />
            <p className="mb-1 text-sm text-[#115d5a]"><span className="font-semibold">Click to upload</span></p>
            <p className="text-xs text-[#115d5a]">{fileTypes}</p>
          </div>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept={fileTypes === "PDFs" ? ".pdf" : "image/*,video/*"}
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {files.map((f, index) => (
          <div key={index} className="relative">
            {f.file?.type?.startsWith('image/') ? (
              <img src={f.preview} alt="preview" className="h-20 w-20 object-cover rounded-md border border-gray-300" />
            ) : (
              <div className="h-20 w-20 flex flex-col items-center justify-center bg-gray-100 rounded-md border border-gray-300">
                <FileText className="w-8 h-8 text-[#115d5a]" />
                <span className="text-xs text-center truncate w-full px-1">{f.file?.name}</span>
              </div>
            )}
            <button
              onClick={() => removeFile(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 transform translate-x-1/2 -translate-y-1/2 shadow-md"
              aria-label="Remove file"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const MealInput = ({ meal, mealName, onMealChange }) => (
  <div className="p-4 bg-white rounded-2xl border border-gray-300 shadow-sm">
    <h4 className="font-semibold text-lg text-[#115d5a] flex items-center gap-2 mb-3">
      <Utensils size={20} className="text-[#E7C873]" />
      {mealName.charAt(0).toUpperCase() + mealName.slice(1)}
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-[#115d5a] mb-1">Items</label>
        <input
          type="text"
          placeholder="e.g., Croissants, Coffee"
          value={meal.items || ''}
          onChange={(e) => onMealChange('items', e.target.value.split(',').map(item => item.trim()))}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E7C873] focus:border-transparent bg-white text-[#115d5a]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#115d5a] mb-1">Time</label>
        <input
          type="time"
          value={meal.time || ''}
          onChange={(e) => onMealChange('time', e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E7C873] focus:border-transparent bg-white text-[#115d5a]"
        />
      </div>
    </div>
    <MediaUploader
      files={meal.media || []}
      onFilesChange={(files) => onMealChange('media', files)}
      fileTypes="Images/Videos"
      label="Meal Photos"
    />
  </div>
);

const HotelInput = ({ hotel, onHotelChange }) => (
  <div className="mt-6">
    <h3 className="text-xl font-bold text-[#115d5a] flex items-center gap-2 mb-3">
      <Hotel size={20} className="text-[#E7C873]" />
      Hotel Information
    </h3>
    <div className="p-4 bg-white rounded-2xl border border-gray-300 shadow-sm space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#115d5a] mb-1">Hotel Name</label>
        <input
          type="text"
          placeholder="e.g., The Grand Budapest Hotel"
          value={hotel.name || ''}
          onChange={(e) => onHotelChange('name', e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E7C873] focus:border-transparent bg-white text-[#115d5a]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#115d5a] mb-1">Check-in Date</label>
          <input
            type="date"
            value={hotel.checkin || ''}
            onChange={(e) => onHotelChange('checkin', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E7C873] focus:border-transparent bg-white text-[#115d5a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#115d5a] mb-1">Check-out Date</label>
          <input
            type="date"
            value={hotel.checkout || ''}
            onChange={(e) => onHotelChange('checkout', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E7C873] focus:border-transparent bg-white text-[#115d5a]"
          />
        </div>
      </div>
      <MediaUploader
        files={hotel.images || []}
        onFilesChange={(files) => onHotelChange('images', files)}
        fileTypes="Images"
        label="Hotel Photos"
      />
      <MediaUploader
        files={hotel.documents || []}
        onFilesChange={(files) => onHotelChange('documents', files)}
        fileTypes="PDFs"
        label="Booking Documents"
      />
    </div>
  </div>
);

const ActivityInput = ({ activity, onActivityChange, onRemove }) => (
  <div className="p-4 bg-white rounded-2xl border border-yellow-200 shadow-sm relative">
    <button
      onClick={onRemove}
      className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white p-1 rounded-full shadow-md"
      aria-label="Remove activity"
    >
      <Trash2 size={18} />
    </button>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#115d5a] mb-1">Activity Title</label>
        <input
          type="text"
          placeholder="e.g., Museum Visit"
          value={activity.title || ''}
          onChange={(e) => onActivityChange('title', e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white text-[#115d5a]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#115d5a] mb-1">Description</label>
        <textarea
          placeholder="Details about the activity"
          value={activity.description || ''}
          onChange={(e) => onActivityChange('description', e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white text-[#115d5a]"
          rows="3"
        ></textarea>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#115d5a] mb-1">Time</label>
        <input
          type="time"
          value={activity.time || ''}
          onChange={(e) => onActivityChange('time', e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white text-[#115d5a]"
        />
      </div>
      <MediaUploader
        files={activity.media || []}
        onFilesChange={(files) => onActivityChange('media', files)}
        fileTypes="Images/Videos"
        label="Activity Photos"
      />
    </div>
  </div>
);

const DayAccordion = ({ day, dayIndex, onDayChange, onRemoveDay, isActive, onToggle }) => {
  const handleMealChange = (mealName, field, value) => {
    const updatedMeals = { ...day.meals, [mealName]: { ...day.meals[mealName], [field]: value } };
    onDayChange(dayIndex, 'meals', updatedMeals);
  };

  const handleHotelChange = (field, value) => {
    const updatedHotel = { ...day.hotel, [field]: value };
    onDayChange(dayIndex, 'hotel', updatedHotel);
  };

  const handleActivityChange = (activityIndex, field, value) => {
    const updatedActivities = [...day.activities];
    updatedActivities[activityIndex] = { ...updatedActivities[activityIndex], [field]: value };
    onDayChange(dayIndex, 'activities', updatedActivities);
  };

  const addActivity = () => {
    const newActivity = { id: Date.now(), title: '', description: '', time: '', media: [] };
    onDayChange(dayIndex, 'activities', [...day.activities, newActivity]);
  };

  const removeActivity = (activityIndex) => {
    const updatedActivities = [...day.activities];
    updatedActivities.splice(activityIndex, 1);
    onDayChange(dayIndex, 'activities', updatedActivities);
  };

  return (
    <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button onClick={onToggle} className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-[#115d5a]">Day {dayIndex + 1}</span>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#115d5a]" />
            <input
              type="date"
              value={day.date || ''}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onDayChange(dayIndex, 'date', e.target.value)}
              className="px-3 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E7C873] focus:border-transparent bg-white text-[#115d5a]"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); onRemoveDay(dayIndex); }}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
          >
            <Trash2 size={20} />
          </button>
          <ArrowRight className={`transform transition-transform duration-300 ${isActive ? 'rotate-90' : 'rotate-0'}`} />
        </div>
      </button>
      <div className={`transition-all duration-500 ease-in-out ${isActive ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 bg-gray-50 border-t border-gray-300 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#115d5a] flex items-center gap-2 mb-3">
              <Utensils className="text-[#E7C873]" /> Meals
            </h3>
            <div className="space-y-4">
              <MealInput meal={day.meals?.breakfast || {}} mealName="breakfast" onMealChange={(f, v) => handleMealChange('breakfast', f, v)} />
              <MealInput meal={day.meals?.lunch || {}} mealName="lunch" onMealChange={(f, v) => handleMealChange('lunch', f, v)} />
              <MealInput meal={day.meals?.dinner || {}} mealName="dinner" onMealChange={(f, v) => handleMealChange('dinner', f, v)} />
            </div>
          </div>
          <HotelInput hotel={day.hotel || {}} onHotelChange={handleHotelChange} />
          <div>
            <h3 className="text-xl font-bold text-[#115d5a] flex items-center gap-2 mb-3">
              <Sun className="text-[#E7C873]" /> Activities
            </h3>
            <div className="space-y-4">
              {(day.activities || []).map((activity, index) => (
                <ActivityInput
                  key={activity.id || index}
                  activity={activity}
                  onActivityChange={(f, v) => handleActivityChange(index, f, v)}
                  onRemove={() => removeActivity(index)}
                />
              ))}
            </div>
            <button
              onClick={addActivity}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E7C873] to-[#115d5a] text-white rounded-lg shadow hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              <PlusCircle size={20} /> Add Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TripDesignCreatePage = ({ tripId: initialTripId }) => {
  const [tripId, setTripId] = useState(initialTripId);
  const [title, setTitle] = useState('');
  const [days, setDays] = useState([]);
  const [activeDay, setActiveDay] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [buddyState, setBuddyState] = useState('idle');

  const createNewDay = () => ({
    id: Date.now(),
    date: '',
    meals: {
      breakfast: { items: [], time: '', media: [] },
      lunch: { items: [], time: '', media: [] },
      dinner: { items: [], time: '', media: [] },
    },
    hotel: { name: '', checkin: '', checkout: '', images: [], documents: [] },
    activities: [],
  });

  const loadTripData = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    setBuddyState('thinking');
    try {
      const response = await TripDesignService.getById(id);
      const { title, days } = response.data;
      setTitle(title);
      const hydratedDays = days.map(d => ({
        ...d,
        id: d._id || Date.now(),
        meals: {
          breakfast: { items: [], time: '', media: [], ...d.meals?.breakfast },
          lunch: { items: [], time: '', media: [], ...d.meals?.lunch },
          dinner: { items: [], time: '', media: [], ...d.meals?.dinner },
        },
        hotel: { images: [], documents: [], ...d.hotel },
        activities: d.activities?.map(a => ({ media: [], ...a, id: a._id || Date.now() })) || []
      }));
      setDays(hydratedDays);
      setTripId(id);
      setBuddyState('idle');
    } catch (err) {
      setError(err.message || 'Failed to fetch trip data.');
      setBuddyState('idle');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUserTrips = useCallback(async () => {
    try {
      const response = await TripDesignService.getAll();
      setUserTrips(response.data);
    } catch (err) {
      console.error("Failed to fetch user trips", err);
    }
  }, []);

  useEffect(() => {
    loadUserTrips();
    if (tripId) {
      loadTripData(tripId);
    } else {
      setDays([createNewDay()]);
    }
  }, [tripId, loadTripData, loadUserTrips]);
  
  useEffect(() => {
    if (isLoading) {
      setBuddyState('thinking');
    } else if (success) {
      setBuddyState('celebrating');
      const timer = setTimeout(() => setBuddyState('idle'), 4000);
      return () => clearTimeout(timer);
    } else if (error) {
      const timer = setTimeout(() => setBuddyState('idle'), 4000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, success, error]);

  const handleDayChange = (index, field, value) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
  };

  const addDay = () => {
    setDays([...days, createNewDay()]);
    setActiveDay(days.length);
  };

  const removeDay = (index) => {
    const newDays = [...days];
    newDays.splice(index, 1);
    setDays(newDays);
    if (activeDay >= index && activeDay > 0) {
      setActiveDay(activeDay - 1);
    } else if (newDays.length === 0) {
      setActiveDay(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Trip title is required.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);

    const sanitizedDays = days.map((day, dayIndex) => {
      const sanitizedDay = { ...day };
      delete sanitizedDay.id;

      // Process meal media files
      Object.keys(day.meals).forEach(mealKey => {
        const meal = day.meals[mealKey];
        if (meal.media && Array.isArray(meal.media)) {
          meal.media.forEach((mediaItem, mediaIndex) => {
            if (mediaItem.file) {
              formData.append(`day_${dayIndex}_meal_${mealKey}_media_${mediaIndex}`, mediaItem.file);
            }
          });
        }
        // Convert items array to proper format
        if (Array.isArray(meal.items)) {
          sanitizedDay.meals[mealKey] = { ...meal, media: [] };
        } else {
          sanitizedDay.meals[mealKey] = { items: [], time: meal.time || '', media: [] };
        }
      });

      // Process hotel media files
      if (day.hotel) {
        if (day.hotel.images && Array.isArray(day.hotel.images)) {
          day.hotel.images.forEach((mediaItem, mediaIndex) => {
            if (mediaItem.file) {
              formData.append(`day_${dayIndex}_hotel_image_${mediaIndex}`, mediaItem.file);
            }
          });
        }
        if (day.hotel.documents && Array.isArray(day.hotel.documents)) {
          day.hotel.documents.forEach((mediaItem, mediaIndex) => {
            if (mediaItem.file) {
              formData.append(`day_${dayIndex}_hotel_document_${mediaIndex}`, mediaItem.file);
            }
          });
        }
        sanitizedDay.hotel = { 
          name: day.hotel.name || '',
          checkin: day.hotel.checkin || '',
          checkout: day.hotel.checkout || '',
          images: [], 
          documents: [] 
        };
      }

      // Process activity media files
      sanitizedDay.activities = (day.activities || []).map((activity, activityIndex) => {
        if (activity.media && Array.isArray(activity.media)) {
          activity.media.forEach((mediaItem, mediaIndex) => {
            if (mediaItem.file) {
              formData.append(`day_${dayIndex}_activity_${activityIndex}_media_${mediaIndex}`, mediaItem.file);
            }
          });
        }
        const sanitizedActivity = { ...activity };
        delete sanitizedActivity.id;
        sanitizedActivity.media = [];
        return sanitizedActivity;
      });

      return sanitizedDay;
    });

    formData.append('days', JSON.stringify(sanitizedDays));

    try {
      let response;
      if (tripId) {
        response = await TripDesignService.update(tripId, formData);
        setSuccess('Trip updated successfully!');
      } else {
        response = await TripDesignService.create(formData);
        setSuccess('Trip created successfully!');
        setTripId(response.data._id);
      }
      loadUserTrips();
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTrip = (id) => {
    if (id) {
      loadTripData(id);
    } else {
      setTripId(null);
      setTitle('');
      setDays([createNewDay()]);
      setActiveDay(0);
      setError(null);
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "linear-gradient(rgba(17,93,90,0.85), rgba(231,200,115,0.65)), url('/backgrounds/landmarkImage.jpg')" }}>
      <Navbar />
      <TravelBuddy state={buddyState} />
      <div className="py-16 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-3">
          <h1 className="text-4xl font-bold text-[#115d5a] mb-6 text-center uppercase tracking-wider">
            Trip Itinerary Planner
          </h1>
          <p className="mb-8 text-center text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Create a detailed day-by-day itinerary including meals, hotel, and activities.
          </p>

          <div className="mb-8">
            <label htmlFor="trip-select" className="block text-sm font-medium text-[#115d5a] mb-2">
              Load Saved Trip or Create New
            </label>
            <select
              id="trip-select"
              value={tripId || ''}
              onChange={(e) => handleSelectTrip(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#E7C873] focus:border-transparent bg-white text-[#115d5a] font-semibold shadow-sm"
            >
              <option value="">-- Create a New Trip --</option>
              {userTrips.map(trip => (
                <option key={trip._id} value={trip._id}>{trip.title}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="trip-title" className="block text-xl font-bold text-[#115d5a] mb-2">
                Trip Title
              </label>
              <input
                id="trip-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setBuddyState('thinking')}
                onBlur={() => setBuddyState('idle')}
                placeholder="e.g., Summer Adventure in Italy"
                className="w-full px-4 py-3 text-lg rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#E7C873] focus:border-transparent bg-white text-[#115d5a] font-semibold shadow-sm"
              />
            </div>

            <Stepper currentDay={activeDay} totalDays={days.length} setDay={setActiveDay} />

            <div className="space-y-6">
              {days.map((day, index) => (
                <DayAccordion
                  key={day.id}
                  day={day}
                  dayIndex={index}
                  onDayChange={handleDayChange}
                  onRemoveDay={removeDay}
                  isActive={index === activeDay}
                  onToggle={() => setActiveDay(index === activeDay ? -1 : index)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={addDay}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#115d5a] to-[#E7C873] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              <PlusCircle size={22} /> Add Another Day
            </button>

            <footer className="pt-6 border-t border-gray-300">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                  {error && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg">
                      <AlertTriangle size={20} /> {error}
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg">
                      <CheckCircle size={20} /> {success}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#115d5a] to-[#E7C873] text-white font-medium rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (tripId ? 'Update Trip' : 'Create Trip')}
                </button>
              </div>
            </footer>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TripDesignCreatePage;