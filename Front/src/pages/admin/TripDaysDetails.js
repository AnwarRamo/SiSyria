import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUpload, FaTrash, FaArrowLeft, FaArrowRight, FaSave } from "react-icons/fa";
import { AdminService } from "../../api/services/admin.service";
import LoadingSpinner from "../../components/LodingSpinner";
import { toast } from "react-toastify";
import { getDisplayErrorMessage } from "../../components/ui/errorUtils";

const createEmptyDayPlan = (dayIndex) => ({
  dayIndex,
  details: "",
  meals: [],
  images: [],
  hotelFile: null,
});

function TripDaysDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const [state] = useState(() => {
    if (location.state?.tripId) return location.state;
    const savedState = localStorage.getItem("tripDetails");
    return savedState ? JSON.parse(savedState) : {};
  });

  const { days = 0, selectedCity = "Unknown", tripId = null } = state;
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const mealOptions = ["Breakfast", "Lunch", "Dinner"];

  const [dayPlans, setDayPlans] = useState(() => {
    if (!tripId) return [];
    const savedPlansString = localStorage.getItem(`tripPlans_${tripId}`);
    let initialPlans = Array.from({ length: days }, (_, i) => createEmptyDayPlan(i));
    if (savedPlansString) {
      try {
        const parsedPlans = JSON.parse(savedPlansString);
        if (Array.isArray(parsedPlans) && parsedPlans.length === days) {
          return parsedPlans.map((plan, i) => ({
            ...createEmptyDayPlan(i),
            details: plan.details || "",
            meals: Array.isArray(plan.meals) ? plan.meals : [],
            images: Array.isArray(plan.images) ? plan.images : [],
            hotelFile: plan.hotelFile || null,
          }));
        }
      } catch (e) {
        localStorage.removeItem(`tripPlans_${tripId}`);
      }
    }
    return initialPlans;
  });

  useEffect(() => {
    if (tripId && days > 0) {
      localStorage.setItem("tripDetails", JSON.stringify({ days, selectedCity, tripId }));
      localStorage.setItem(`tripPlans_${tripId}`, JSON.stringify(dayPlans));
    }
  }, [days, selectedCity, tripId, dayPlans]);

  useEffect(() => {
    if (!tripId || !days || days <= 0) {
      toast.error("Invalid trip data. Please start by creating a trip.");
      navigate("/admin/add-trip", { replace: true });
    }
  }, [tripId, days, navigate]);

  const currentPlan = dayPlans[currentDayIndex];

  const updateDayPlan = useCallback(
    (field, value) => {
      setDayPlans((prev) => {
        const newPlans = [...prev];
        if (newPlans[currentDayIndex]) {
          newPlans[currentDayIndex] = { ...newPlans[currentDayIndex], [field]: value };
        }
        return newPlans;
      });
    },
    [currentDayIndex]
  );

  const handleNextDay = () => {
    if (currentDayIndex < days - 1) setCurrentDayIndex(currentDayIndex + 1);
  };

  const handleGoBack = () => {
    if (currentDayIndex > 0) setCurrentDayIndex(currentDayIndex - 1);
  };

  const addMeal = (mealType) => {
    const meals = currentPlan.meals || [];
    if (!meals.some((m) => m.type === mealType)) {
      updateDayPlan("meals", [...meals, { type: mealType, details: "" }]);
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

    const existingImages = Array.isArray(currentPlan.images) ? currentPlan.images : [];
    const combined = [...existingImages, ...newFiles].slice(0, 5);
    updateDayPlan("images", combined);
    e.target.value = null;
  };

  const removeImage = (indexToRemove) => {
    updateDayPlan("images", (currentPlan.images || []).filter((_, i) => i !== indexToRemove));
  };

  useEffect(() => {
    return () => {
      (currentPlan?.images || []).forEach((file) => {
        if (file instanceof File) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [currentPlan?.images]);

  const handleHotelFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) updateDayPlan("hotelFile", file);
    e.target.value = null;
  };

  const removeHotelFile = () => {
    updateDayPlan("hotelFile", null);
  };

  // ✅ FIXED handleSubmit with day check
  const handleSubmit = async () => {
  if (!tripId) return;

  // Enhanced validation - check all required fields
  const validationErrors = [];
  dayPlans.forEach((plan, index) => {
    if (!plan.details || plan.details.trim().length === 0) {
      validationErrors.push(`Day ${index + 1} activities are required`);
    }
    
    // Optional: Validate meals if required
    plan.meals?.forEach(meal => {
      if (!meal.details || meal.details.trim().length === 0) {
        validationErrors.push(`Day ${index + 1} ${meal.type} details are required`);
      }
    });
  });

  if (validationErrors.length > 0) {
    toast.error(validationErrors[0]); // Show first error
    // Optionally show all errors: toast.error(validationErrors.join('\n'));
    return;
  }

  setIsSubmitting(true);
  setError(null);
  
  try {
    const formPayload = new FormData();
    formPayload.append("tripId", tripId);

    // Format day plans to match backend expectations
    dayPlans.forEach((plan, dayIdx) => {
      // Append basic day info
      formPayload.append(`dayPlans[${dayIdx}][dayIndex]`, dayIdx);
      formPayload.append(`dayPlans[${dayIdx}][details]`, plan.details);

      // Append meals if they exist
      if (plan.meals && plan.meals.length > 0) {
        plan.meals.forEach((meal, mealIdx) => {
          formPayload.append(`dayPlans[${dayIdx}][meals][${mealIdx}][type]`, meal.type);
          formPayload.append(`dayPlans[${dayIdx}][meals][${mealIdx}][details]`, meal.details);
        });
      }

      // Append images
      if (plan.images && plan.images.length > 0) {
        plan.images.forEach((file, imgIdx) => {
          if (file instanceof File) {
            formPayload.append(`dayPlans[${dayIdx}][images]`, file);
          }
        });
      }

      // Append hotel file if it exists
      if (plan.hotelFile instanceof File) {
        formPayload.append(`dayPlans[${dayIdx}][hotelDocument]`, plan.hotelFile);
      }
    });

    // Debugging: Log FormData contents
    for (let [key, value] of formPayload.entries()) {
      console.log(key, value);
    }

    await AdminService.addTripDetails(formPayload);
    
    toast.success("Daily plans added successfully!");
    localStorage.removeItem("tripDetails");
    localStorage.removeItem(`tripPlans_${tripId}`);
    navigate("/admin/trips", { replace: true });
  } catch (err) {
    console.error("Submission error:", err);
    const errorMessage = getDisplayErrorMessage(err, "Failed to save trip details.");
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};
  if (!tripId || !currentPlan) {
    return <LoadingSpinner fullScreen message="Initializing trip planner..." />;
  }


  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-100">
      <div className="bg-purple-600 text-white py-4 shadow-md rounded-lg mb-6 sticky top-0 z-20">
        <div className="w-full px-4 flex items-center justify-between">
          <h1 className="font-bold text-xl sm:text-2xl">
            Plan for {selectedCity} - Day {currentDayIndex + 1} of {days}
          </h1>
          <span className="text-sm font-mono bg-white/20 px-2 py-1 rounded">
            ID: {tripId.slice(-6)}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 space-y-8">
        <section>
          <h2 className="font-semibold text-xl mb-3 text-gray-800">Day {currentDayIndex + 1} Activities</h2>
          <textarea
            value={currentPlan.details || ""}
            onChange={(e) => updateDayPlan("details", e.target.value)}
            className="w-full h-32 border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-purple-500 transition"
            placeholder={`Describe the main activities for the day...`}
          />
        </section>

        <section>
          <h2 className="font-semibold text-xl mb-3 text-gray-800">Images for Day {currentDayIndex + 1}</h2>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
            <FaUpload className="text-gray-400 text-3xl mb-2" />
            <p className="text-sm text-gray-500">Click or drag to upload (Max 5)</p>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          </label>
          {Array.isArray(currentPlan.images) && currentPlan.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
              {currentPlan.images.map((file, index) =>
                file instanceof File ? (
                  <div key={file.name + index} className="relative group aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg shadow"
                      onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ) : null
              )}
            </div>
          )}
        </section>

        <section className="p-6 bg-purple-50 rounded-lg">
          <h2 className="font-semibold text-xl text-purple-800 mb-4">Meal Plans</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {mealOptions.map((mealType) => (
              <button
                key={mealType}
                onClick={() => addMeal(mealType)}
                disabled={(currentPlan.meals || []).some((m) => m.type === mealType)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 disabled:opacity-50"
              >
                Add {mealType}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {(currentPlan.meals || []).map((meal, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow border-l-4 border-purple-500">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-purple-700">{meal.type}</h3>
                  <button onClick={() => removeMeal(index)} className="text-red-500 hover:text-red-700" aria-label={`Remove ${meal.type} meal`}>
                    <FaTrash />
                  </button>
                </div>
                <textarea
                  value={meal.details || ""}
                  onChange={(e) => updateMealDetails(index, e.target.value)}
                  className="w-full h-20 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder={`Details for ${meal.type}...`}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 bg-purple-50 rounded-lg">
          <h2 className="font-semibold text-xl text-purple-800 mb-4">Hotel Information Document</h2>
          {currentPlan.hotelFile instanceof File ? (
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <span className="text-purple-700 font-medium truncate">{currentPlan.hotelFile.name}</span>
              <button onClick={removeHotelFile} className="text-red-500 hover:text-red-700 ml-4" aria-label="Remove hotel document">
                <FaTrash />
              </button>
            </div>
          ) : (
            <label className="inline-flex items-center cursor-pointer space-x-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-purple-700">
              <FaUpload />
              <span>Upload Document</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,image/*"
                onChange={handleHotelFileUpload}
                className="hidden"
              />
            </label>
          )}
        </section>

        {error && (
          <div className="p-4 bg-red-100 text-red-800 border-l-4 border-red-500 rounded-r-lg" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mt-10 pt-6 border-t">
          <button
            onClick={handleGoBack}
            disabled={currentDayIndex === 0 || isSubmitting}
            className="w-full sm:w-auto mb-3 sm:mb-0 bg-gray-500 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-600 disabled:opacity-50 flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" /> Previous Day
          </button>

          {currentDayIndex === days - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : <><FaSave className="mr-2" /> Save Trip Plan</>}
            </button>
          ) : (
            <button
              onClick={handleNextDay}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
            >
              Next Day <FaArrowRight className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripDaysDetails;
