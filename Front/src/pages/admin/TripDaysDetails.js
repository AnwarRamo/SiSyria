// TripDaysDetails.js
// (Assuming this is src/pages/TripDaysDetails.js or similar)
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUpload, FaTrash, FaArrowLeft, FaArrowRight, FaSave } from "react-icons/fa";
import { AdminService } from "../../api/services/admin.service"; // Adjusted path
import LoadingSpinner from "../../components/LodingSpinner"; // Adjusted path
import { toast } from "react-toastify";

function TripDaysDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [initialStateFromLocation] = useState(() => location.state || {});

  const [state, setState] = useState(() => {
    const savedState = localStorage.getItem("tripDetails");
    // Prioritize location.state on fresh navigation, then localStorage, then empty
    return initialStateFromLocation.tripId ? initialStateFromLocation : (savedState ? JSON.parse(savedState) : {});
  });
  
  const { days = 0, selectedCity = "Unknown", tripId = null } = state;
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [dayPlans, setDayPlans] = useState(() => {
    let initialPlans = Array.from({ length: days }, (_, i) => ({
      dayIndex: i,
      details: "",
      meals: [],
      images: [], // Will hold File objects
      hotelFile: null, // Will hold a File object
    }));
    
    if (tripId) { // Only try to load plans if tripId is valid
      const savedPlansString = localStorage.getItem(`tripPlans_${tripId}`);
      if (savedPlansString) {
        try {
          const parsedPlans = JSON.parse(savedPlansString);
          // Ensure `days` matches, otherwise, localStorage might be stale
          if (parsedPlans.length === days) {
            // *** FIX: File objects are not serializable. Reset file fields. ***
            // User will need to re-select files if they reloaded the page.
            initialPlans = parsedPlans.map(plan => ({
              ...plan,
              images: [], // Reset images; they can't be restored from JSON
              hotelFile: null, // Reset hotelFile
            }));
            // If you had any file metadata (like names) you wanted to preserve for display,
            // you could do that here, but actual File objects are gone.
          } else {
            console.warn("Stale trip plans in localStorage (day mismatch). Clearing.");
            localStorage.removeItem(`tripPlans_${tripId}`);
          }
        } catch (e) {
          console.error("Failed to parse saved plans from localStorage. Clearing.", e);
          localStorage.removeItem(`tripPlans_${tripId}`); // Clear corrupted data
        }
      }
    }
    return initialPlans;
  });

  // Save state to localStorage
  useEffect(() => {
    if (days > 0 && tripId) { // Only save if data is valid
      localStorage.setItem("tripDetails", JSON.stringify({ days, selectedCity, tripId }));
      // Note: Storing dayPlans with File objects in localStorage won't preserve the File objects themselves.
      // The loading logic above handles this by resetting file fields.
      localStorage.setItem(`tripPlans_${tripId}`, JSON.stringify(dayPlans));
    }
  }, [days, selectedCity, tripId, dayPlans]);

  // Validate trip data on mount and if critical props change
  useEffect(() => {
    if (!days || days <= 0 || !selectedCity || !tripId) {
      // Clear potentially bad localStorage if data is invalid
      if (tripId) {
        localStorage.removeItem(`tripPlans_${tripId}`);
        localStorage.removeItem("tripDetails");
      }
      toast.error("Invalid or missing trip data. Please start by creating a trip.");
      navigate("/admin/add-trip", { replace: true });
    }
  }, [days, selectedCity, tripId, navigate]);


  const currentPlan = dayPlans[currentDayIndex] || { details: "", meals: [], images: [], hotelFile: null };

  const handleNextDay = () => {
    if (currentDayIndex < days - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const handleGoBack = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const updateDayPlan = useCallback((field, value) => {
    setDayPlans(prev => {
      const newPlans = [...prev];
      if (newPlans[currentDayIndex]) { // Ensure current day plan exists
        newPlans[currentDayIndex] = { ...newPlans[currentDayIndex], [field]: value };
      }
      return newPlans;
    });
  }, [currentDayIndex]);


  const addMeal = (mealType) => {
    if (!currentPlan.meals?.some(m => m.type === mealType)) {
      updateDayPlan("meals", [...(currentPlan.meals || []), { type: mealType, details: "" }]);
    }
  };

  const updateMealDetails = (mealIndex, newDetails) => {
    const updatedMeals = [...(currentPlan.meals || [])];
    if (updatedMeals[mealIndex]) {
      updatedMeals[mealIndex].details = newDetails;
      updateDayPlan("meals", updatedMeals);
    }
  };

  const removeMeal = (mealIndex) => {
    updateDayPlan("meals", (currentPlan.meals || []).filter((_, i) => i !== mealIndex));
  };

  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (!newFiles.length) return;

    // Ensure currentPlan.images is an array
    const existingImages = Array.isArray(currentPlan.images) ? currentPlan.images : [];
    const updatedImages = [...existingImages, ...newFiles];
    updateDayPlan("images", updatedImages.slice(0, 5)); // Limit to 5 images
    e.target.value = null; // Reset file input
  };

  const removeImage = (index) => {
    const existingImages = Array.isArray(currentPlan.images) ? currentPlan.images : [];
    updateDayPlan("images", existingImages.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      updateDayPlan("hotelFile", file);
    }
    e.target.value = null; // Reset file input
  };

  const removeHotelFile = () => {
    updateDayPlan("hotelFile", null);
  };

  const handleSubmit = async () => {
    if (!tripId) {
      toast.error("Missing Trip ID. Cannot save details. Please start over.");
      navigate("/admin/add-trip", { replace: true });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formPayload = new FormData();
      formPayload.append("tripId", tripId);

      dayPlans.forEach((plan, dayIdx) => {
        formPayload.append(`dayPlans[${dayIdx}][dayIndex]`, String(plan.dayIndex));
        formPayload.append(`dayPlans[${dayIdx}][details]`, plan.details || "");
        
        (plan.meals || []).forEach((meal, mealIdx) => {
          formPayload.append(`dayPlans[${dayIdx}][meals][${mealIdx}][type]`, meal.type);
          formPayload.append(`dayPlans[${dayIdx}][meals][${mealIdx}][details]`, meal.details || "");
        });
        
        // Ensure plan.images is an array and items are File objects
        (Array.isArray(plan.images) ? plan.images : []).forEach((file) => {
          if (file instanceof File) { // Important: only append actual File objects
            formPayload.append(`day_${dayIdx}_images`, file); // Backend will need to handle these keys
          }
        });
        
        if (plan.hotelFile instanceof File) { // Important: only append actual File objects
          formPayload.append(`day_${dayIdx}_hotel`, plan.hotelFile); // Backend will need to handle these keys
        }
      });

      console.log("Submitting trip details. Check AdminService logs for FormData content.", {
        tripId,
        dayPlanCount: dayPlans.length,
      });

      await AdminService.addTripDetails(formPayload);
      
      toast.success("Daily plans added successfully!");
      localStorage.removeItem("tripDetails");
      localStorage.removeItem(`tripPlans_${tripId}`);
      navigate("/admin/trips", { replace: true });

    } catch (error) {
      console.error("Trip details submission error in component:", error);
      const errorMessage = error.message || "Failed to save trip details. Please check data and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading if critical data is missing (useEffect handles redirection)
  if (!days || days <= 0 || !selectedCity || !tripId) {
    return <LoadingSpinner fullScreen message="Validating trip data..." />;
  }

  const mealOptions = ["Breakfast", "Lunch", "Dinner"];

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100">
      <div className="bg-purple-600 text-white py-4 shadow-md rounded-lg mb-6 sticky top-0 z-20">
        <div className="w-full px-4 flex items-center justify-between">
          <h1 className="font-bold text-xl sm:text-2xl">
            Plan for {selectedCity} - Day {currentDayIndex + 1} of {days}
          </h1>
          {tripId && <span className="text-sm">Trip ID: {tripId.slice(-6)}</span>}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 space-y-8">
        {/* Activities Section */}
        <section className="p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="font-semibold text-xl mb-4 text-gray-800">Day {currentDayIndex + 1} Activities</h2>
          <textarea
            value={currentPlan.details || ""}
            onChange={(e) => updateDayPlan("details", e.target.value)}
            className="w-full h-32 border border-gray-300 rounded-lg p-4 text-gray-700 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
            placeholder={`Describe the activities for Day ${currentDayIndex + 1}...`}
          />
        </section>

        {/* Images Section */}
        <section className="p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="font-semibold text-xl mb-4 text-gray-800">Images for Day {currentDayIndex + 1}</h2>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg bg-white hover:bg-gray-100 cursor-pointer transition duration-150 ease-in-out">
            <FaUpload className="text-gray-400 text-3xl mb-2" />
            <p className="text-sm text-gray-500">Click or drag & drop images (Max 5 per day)</p>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleImageUpload} 
              className="hidden" 
            />
          </label>
          
          {(Array.isArray(currentPlan.images) && currentPlan.images.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
              {currentPlan.images.map((file, index) => (
                // Ensure 'file' is a File object for URL.createObjectURL
                file instanceof File && (
                  <div key={index} className="relative group aspect-square">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Day ${currentDayIndex + 1} Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg shadow-md"
                          onLoad={(e) => URL.revokeObjectURL(e.target.src)} // Revoke on load to free memory
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-opacity"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                )
              ))}
            </div>
          )}
        </section>

        {/* Meals Section */}
        <section className="p-6 bg-purple-50 rounded-lg shadow-inner">
          <h2 className="font-semibold text-xl text-purple-800 mb-4">Meal Plans</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {mealOptions.map(mealType => (
              <button
                key={mealType}
                onClick={() => addMeal(mealType)}
                disabled={(currentPlan.meals || []).some(m => m.type === mealType)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Add {mealType}
              </button>
            ))}
          </div>
          
          <div className="space-y-4">
            {(currentPlan.meals || []).map((meal, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow relative border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-purple-700">{meal.type}</h3>
                  <button
                    onClick={() => removeMeal(index)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <FaTrash />
                  </button>
                </div>
                <textarea
                  value={meal.details || ""}
                  onChange={(e) => updateMealDetails(index, e.target.value)}
                  className="w-full h-20 border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out resize-none"
                  placeholder={`Details for ${meal.type}...`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Hotel Section */}
        <section className="p-6 bg-purple-50 rounded-lg shadow-inner">
          <h2 className="font-semibold text-xl text-purple-800 mb-4">Hotel Information</h2>
          {currentPlan.hotelFile instanceof File ? ( // Check if it's a File object
            <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow border border-gray-200">
              <span className="text-purple-700 font-medium truncate">{currentPlan.hotelFile.name}</span>
              <button
                onClick={removeHotelFile}
                className="text-red-500 hover:text-red-700 ml-4 flex-shrink-0 focus:outline-none"
              >
                <FaTrash />
              </button>
            </div>
          ) : (
            <label className="inline-flex items-center cursor-pointer space-x-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
              <FaUpload />
              <span>Upload Hotel Document</span>
              <input
                type="file"
                accept="application/pdf,image/*,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          )}
        </section>

        {error && (
          <div className="my-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-center font-semibold">
            Error: {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-10 pt-6 border-t border-gray-200">
          <button
            onClick={handleGoBack}
            disabled={currentDayIndex === 0 || isSubmitting}
            className="w-full sm:w-auto mb-3 sm:mb-0 bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <FaArrowLeft className="inline mr-2" />
            Previous Day
          </button>

          {currentDayIndex === days - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <FaSave className="inline mr-2" />
                  Save Entire Trip Plan
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNextDay}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              Next Day
              <FaArrowRight className="inline ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripDaysDetails;