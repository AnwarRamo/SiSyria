import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminService } from "../../api/services/admin.service";
import { useAuthStore } from "../../api/stores/auth.store";
import { FaPlus, FaMinus, FaUpload, FaTrash, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LodingSpinner";
import { getDisplayErrorMessage } from "../../components/ui/errorUtils";

const createEmptyDayPlan = () => ({
    details: "",
    meals: [],
    images: [],      // This will hold File objects
    hotelFile: null, // This will hold a single File object
});

function AddTrip() {
    const user = useAuthStore((state) => state.user);
    const isLoadingAuth = useAuthStore((state) => state.loading);
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        destination: "",
        type: "Adventure",
        price: "",
        capacity: "",
        startDate: new Date().toISOString().split("T")[0],
        days: 1,
        // Ticket/Plane System Fields
        includeFlights: true,
        departureCity: "",
        arrivalCity: "",
        departureAirport: "",
        arrivalAirport: "",
        departureTime: "",
        returnTime: "",
        airline: "",
        flightNumber: "",
        returnFlightNumber: "",
        seatClasses: ["Economy"],
        ticketPrice: "",
        availableSeats: ""
    });

    const [mainImages, setMainImages] = useState([]); // This will hold File objects
    const [dayPlans, setDayPlans] = useState([createEmptyDayPlan()]);

    useEffect(() => {
        if (!isLoadingAuth && !user) {
            toast.info("Please log in to create a trip.");
            navigate("/login");
        }
    }, [user, isLoadingAuth, navigate]);

    useEffect(() => {
        const numDays = parseInt(formData.days, 10) || 0;
        if (numDays > 0) {
            setDayPlans(currentPlans => {
                const newPlans = [...currentPlans];
                while (newPlans.length < numDays) {
                    newPlans.push(createEmptyDayPlan());
                }
                return newPlans.slice(0, numDays);
            });
        } else {
            setDayPlans([]);
        }
    }, [formData.days]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDaysChange = (value) => {
        const num = parseInt(value, 10);
        if (value === "" || (num >= 1 && !isNaN(num))) {
            setFormData({ ...formData, days: value === "" ? "" : num });
        } else if (num < 1) {
            setFormData({ ...formData, days: 1 });
        }
    };

    const handleMainImageChange = (e) => {
        if (e.target.files) {
            setMainImages(Array.from(e.target.files).slice(0, 5));
            e.target.value = null;
        }
    };

    const handleDayPlanChange = (index, field, value) => {
        const newDayPlans = [...dayPlans];
        newDayPlans[index][field] = value;
        setDayPlans(newDayPlans);
    };

    const handleDayFileChange = (index, field, files) => {
        const newDayPlans = [...dayPlans];
        if (field === 'images') {
            const existingImages = newDayPlans[index].images || [];
            const combined = [...existingImages, ...Array.from(files)].slice(0, 5);
            newDayPlans[index].images = combined;
        } else {
            newDayPlans[index][field] = files[0] || null;
        }
        setDayPlans(newDayPlans);
    };

    const validateForm = () => {
        const requiredFields = {
            title: "A title is required.",
            description: "A description is required.",
            destination: "Please select a destination.",
            price: "A valid, positive price is required.",
            capacity: "A valid, positive capacity is required.",
            days: "Duration must be at least 1 day."
        };

        for (const [field, message] of Object.entries(requiredFields)) {
            const value = formData[field];
            if (!value || String(value).trim() === '' || parseFloat(value) <= 0) {
                toast.error(message);
                return false;
            }
        }
        if (mainImages.length === 0) {
            toast.error("Please upload at least one main image for the trip.");
            return false;
        }
        for (let i = 0; i < dayPlans.length; i++) {
            if (!dayPlans[i].details.trim()) {
                toast.error(`Details for Day ${i + 1} are required.`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const payload = new FormData();

        // Append all basic form fields
        Object.entries(formData).forEach(([key, value]) => {
            payload.append(key, value);
        });

        // Append main images with the key 'images'
        mainImages.forEach(file => {
            payload.append('images', file);
        });

        // Prepare dayPlans JSON without file data
        const dayPlansJson = dayPlans.map(plan => ({
            details: plan.details,
            meals: plan.meals,
        }));
        
        // Append the JSON string with the key 'dayPlansJSON'
        payload.append('dayPlansJSON', JSON.stringify(dayPlansJson));

        // Append files for each day plan with grouped field names
        dayPlans.forEach((plan, index) => {
            plan.images.forEach(file => {
                payload.append(`day_${index}_images`, file);
            });
            if (plan.hotelFile) {
                payload.append(`day_${index}_hotel`, plan.hotelFile);
            }
        });

        try {
            await AdminService.fullTripCreate(payload);
            toast.success("Trip created successfully!");
            navigate("/admin/trips");
        } catch (error) {
            const displayMessage = getDisplayErrorMessage(error, "Failed to create trip.");
            toast.error(displayMessage);
            console.error("Full trip creation error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingAuth) return <LoadingSpinner fullScreen message="Authenticating..." />;
    if (!user) return <div className="text-center p-10">Redirecting...</div>;
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
            <form onSubmit={handleSubmit}>
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Add New Trip</h1>

                {/* --- Section 1: Trip Basics --- */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Trip Basics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                             <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                             <select id="destination" name="destination" value={formData.destination} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" required>
                                 <option value="">Select Destination</option>
                                 <option value="Damascus">Damascus</option>
                                 <option value="Aleppo">Aleppo</option>
                                 <option value="Palmyra">Palmyra</option>
                                 <option value="Latakia">Latakia</option>
                             </select>
                        </div>
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input id="startDate" name="startDate" type="date" min={new Date().toISOString().split("T")[0]} value={formData.startDate} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                             <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                             <div className="flex items-center gap-2 mt-1">
                                 <button type="button" onClick={() => handleDaysChange(Math.max(1, parseInt(formData.days || 1, 10) - 1))} className="p-3 bg-gray-200 rounded-md"><FaMinus /></button>
                                 <input type="number" id="days" name="days" value={formData.days} onChange={(e) => handleDaysChange(e.target.value)} min="1" className="p-3 text-lg text-center w-16 border rounded-md" required />
                                 <button type="button" onClick={() => handleDaysChange(parseInt(formData.days || 0, 10) + 1)} className="p-3 bg-gray-200 rounded-md"><FaPlus /></button>
                             </div>
                        </div>
                    </div>
                </div>

                {/* --- Section 2: Trip Details & Media --- */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Trip Details & Media</h2>
                    <div className="space-y-6">
                        {/* Title, Description, Price, Capacity, Type */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input id="title" name="title" type="text" value={formData.title} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md h-32" required minLength="20" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input id="price" name="price" type="number" value={formData.price} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" required />
                            </div>
                            <div>
                                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                <input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                            <select id="type" name="type" value={formData.type} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md">
                                <option value="Adventure">Adventure</option>
                                <option value="Cultural">Cultural</option>
                                <option value="Beach">Beach</option>
                            </select>
                        </div>
                        {/* Main Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Main Trip Images (Max 5)</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                                    <label htmlFor="main-image-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                                        <span>Upload files</span>
                                        <input id="main-image-upload" type="file" multiple onChange={handleMainImageChange} className="sr-only" accept="image/*" />
                                    </label>
                                </div>
                            </div>
                            {mainImages.length > 0 && (
                                <ul className="list-disc list-inside mt-2">
                                    {mainImages.map((file, i) => <li key={i} className="text-sm text-gray-600 truncate">{file.name}</li>)}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Section 2.5: Flight Information --- */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Flight Information</h2>
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <input
                                id="includeFlights"
                                name="includeFlights"
                                type="checkbox"
                                checked={formData.includeFlights}
                                onChange={(e) => setFormData(prev => ({ ...prev, includeFlights: e.target.checked }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="includeFlights" className="ml-2 block text-sm text-gray-900">
                                Include flights in this trip
                            </label>
                        </div>

                        {formData.includeFlights && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="departureCity" className="block text-sm font-medium text-gray-700 mb-1">Departure City</label>
                                        <input id="departureCity" name="departureCity" type="text" value={formData.departureCity} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="arrivalCity" className="block text-sm font-medium text-gray-700 mb-1">Arrival City</label>
                                        <input id="arrivalCity" name="arrivalCity" type="text" value={formData.arrivalCity} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="departureAirport" className="block text-sm font-medium text-gray-700 mb-1">Departure Airport</label>
                                        <input id="departureAirport" name="departureAirport" type="text" value={formData.departureAirport} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="arrivalAirport" className="block text-sm font-medium text-gray-700 mb-1">Arrival Airport</label>
                                        <input id="arrivalAirport" name="arrivalAirport" type="text" value={formData.arrivalAirport} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                                        <input id="departureTime" name="departureTime" type="datetime-local" value={formData.departureTime} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="returnTime" className="block text-sm font-medium text-gray-700 mb-1">Return Time</label>
                                        <input id="returnTime" name="returnTime" type="datetime-local" value={formData.returnTime} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="airline" className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                                        <input id="airline" name="airline" type="text" value={formData.airline} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                                        <input id="flightNumber" name="flightNumber" type="text" value={formData.flightNumber} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="returnFlightNumber" className="block text-sm font-medium text-gray-700 mb-1">Return Flight Number (Optional)</label>
                                    <input id="returnFlightNumber" name="returnFlightNumber" type="text" value={formData.returnFlightNumber} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-700 mb-1">Ticket Price ($)</label>
                                        <input id="ticketPrice" name="ticketPrice" type="number" value={formData.ticketPrice} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                                        <input id="availableSeats" name="availableSeats" type="number" value={formData.availableSeats} onChange={handleFormChange} className="w-full p-3 border border-gray-300 rounded-md" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Seat Classes</label>
                                    <div className="space-y-2">
                                        {['Economy', 'Business', 'First'].map(seatClass => (
                                            <label key={seatClass} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.seatClasses.includes(seatClass)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                seatClasses: [...prev.seatClasses, seatClass]
                                                            }));
                                                        } else {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                seatClasses: prev.seatClasses.filter(c => c !== seatClass)
                                                            }));
                                                        }
                                                    }}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-sm text-gray-900">{seatClass}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                
                {/* --- Section 3: Daily Itinerary --- */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                     <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Daily Itinerary</h2>
                     <div className="space-y-8">
                         {dayPlans.map((plan, index) => (
                             <DayPlanInput 
                                 key={index} 
                                 dayIndex={index} 
                                 planData={plan} 
                                 onPlanChange={handleDayPlanChange}
                                 onFileChange={handleDayFileChange}
                             />
                         ))}
                     </div>
                </div>

                {/* --- Submission Button --- */}
                <div className="flex justify-end mt-8">
                    <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-8 py-3 rounded-md shadow-md hover:bg-green-700 disabled:opacity-70 flex items-center gap-2">
                        {isSubmitting ? <LoadingSpinner size="sm" /> : <FaSave />}
                        {isSubmitting ? "Submitting..." : "Create Full Trip"}
                    </button>
                </div>
            </form>
        </div>
    );
}

// --- Sub-component for a single day's plan ---
const DayPlanInput = ({ dayIndex, planData, onPlanChange, onFileChange }) => {
    
    const addMeal = (type) => {
        const newMeals = [...planData.meals, { type, details: "" }];
        onPlanChange(dayIndex, 'meals', newMeals);
    };

    const updateMeal = (mealIndex, details) => {
        const newMeals = [...planData.meals];
        newMeals[mealIndex].details = details;
        onPlanChange(dayIndex, 'meals', newMeals);
    };
    
    const removeMeal = (mealIndex) => {
        const newMeals = planData.meals.filter((_, i) => i !== mealIndex);
        onPlanChange(dayIndex, 'meals', newMeals);
    };

    const removeImage = (imgIndex) => {
        const newImages = planData.images.filter((_, i) => i !== imgIndex);
        onPlanChange(dayIndex, 'images', newImages);
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-bold text-lg text-gray-700 mb-4">Day {dayIndex + 1}</h3>
            {/* Day Details */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activities / Details</label>
                <textarea 
                    value={planData.details}
                    onChange={(e) => onPlanChange(dayIndex, 'details', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md h-24"
                    placeholder="Describe the main activities..."
                    required
                />
            </div>

            {/* Day Images */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Images for Day {dayIndex + 1} (Max 5)</label>
                <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={(e) => onFileChange(dayIndex, 'images', e.target.files)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {planData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {planData.images.map((file, i) => (
                            <div key={i} className="relative">
                                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-24 object-cover rounded"/>
                                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"><FaTrash /></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hotel Document */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Document (PDF, DOC, etc.)</label>
                <input 
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) => onFileChange(dayIndex, 'hotelFile', e.target.files)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {planData.hotelFile && (
                    <div className="flex items-center justify-between bg-white p-2 mt-2 rounded border">
                        <p className="text-sm truncate">{planData.hotelFile.name}</p>
                        <button type="button" onClick={() => onPlanChange(dayIndex, 'hotelFile', null)} className="text-red-500 p-1"><FaTrash /></button>
                    </div>
                )}
            </div>

            {/* Meals */}
            <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-700 mb-2">Meal Plan</h4>
                <div className="flex gap-2 mb-3">
                    {['Breakfast', 'Lunch', 'Dinner'].map(type => (
                        <button key={type} type="button" onClick={() => addMeal(type)} disabled={planData.meals.some(m => m.type === type)} className="text-sm bg-blue-500 text-white px-3 py-1 rounded disabled:bg-gray-400">
                            + {type}
                        </button>
                    ))}
                </div>
                <div className="space-y-2">
                    {planData.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="flex items-center gap-2">
                            <input 
                                type="text"
                                value={meal.details}
                                onChange={(e) => updateMeal(mealIndex, e.target.value)}
                                placeholder={`${meal.type} details...`}
                                className="flex-grow p-2 border rounded"
                            />
                            <button type="button" onClick={() => removeMeal(mealIndex)} className="text-red-500 p-2"><FaTrash /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddTrip;
