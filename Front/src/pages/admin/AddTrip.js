// src/pages/AddTrip.js (or your specific path)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminService } from "../../api/services/admin.service"; // Adjust path if necessary
import { useAuthStore } from "../../api/stores/auth.store";    // Adjust path if necessary
import { FaPlus, FaMinus, FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LodingSpinner"; // Adjust path if necessary
import { getDisplayErrorMessage } from "../../components/ui/errorUtils"; // IMPORT THE HELPER

function AddTrip() {
  const user = useAuthStore((state) => state.user);
  const isLoadingAuth = useAuthStore((state) => state.loading);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const getInitialStartDate = () => new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    type: "Adventure", // Default type
    price: "",
    capacity: "",
    startDate: getInitialStartDate(),
    days: 1,
  });

  // Auth check
  useEffect(() => {
    if (!isLoadingAuth && !user) {
      toast.info("Please log in to access this page.");
      navigate("/login");
    }
  }, [user, isLoadingAuth, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles.slice(0, 5)); // Max 5 files
      e.target.value = null; // Reset file input to allow selecting the same file again
    }
  };

  const validateStep1 = () => {
    if (!formData.destination) {
      toast.error("Please select a destination.");
      return false;
    }
    if (!formData.startDate) {
      toast.error("Please select a start date.");
      return false;
    }
    const numDays = parseInt(String(formData.days), 10);
    if (isNaN(numDays) || numDays < 1) {
      toast.error("Duration must be at least 1 day.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title.");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a description.");
      return false;
    }
    const priceValue = parseFloat(String(formData.price));
    if (String(formData.price).trim() === "" || isNaN(priceValue) || priceValue <= 0) {
      toast.error("Please enter a valid positive price.");
      return false;
    }
    const capacityValue = parseInt(String(formData.capacity), 10);
    if (String(formData.capacity).trim() === "" || isNaN(capacityValue) || capacityValue <= 0) {
      toast.error("Please enter a valid positive capacity.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return; 
    if (!user?.id) {
      toast.error("User information is missing. Cannot create trip.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, String(value)); 
      });
      
      const startDateObj = new Date(formData.startDate);
      const numDays = parseInt(String(formData.days), 10); 

      if (isNaN(numDays) || numDays < 1) { // Should be caught by validateStep1, but good to double check
        toast.error("Invalid trip duration. Please correct and try again.");
        setIsSubmitting(false);
        return;
      }

      const endDate = new Date(startDateObj);
      endDate.setDate(startDateObj.getDate() + numDays);
      
      formPayload.append('endDate', endDate.toISOString());
      formPayload.append('createdBy', user.id);

      files.forEach((file) => {
  formPayload.append("images", file);
});

      console.log("Submitting trip. Client-side data check:", {
        ...formData, 
        days: numDays,
        endDate: endDate.toISOString(),
        createdBy: user.id,
        fileCount: files.length
      });
      // Detailed FormData content will be logged by AdminService

      const response = await AdminService.createTrip(formPayload);
      
      toast.success("Trip created successfully! Add daily plans next.");
      navigate("/admin/trip-details", { 
        state: { 
          days: numDays, 
          selectedCity: formData.destination,
          tripId: response._id || response.id 
        },
      });
    } catch (error) {
      console.error("Trip creation error in AddTrip component:", error);
      // Use the helper to get a user-friendly message
      const displayMessage = getDisplayErrorMessage(error, "Failed to create trip. Please check your input and try again.");
      toast.error(displayMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAuth) {
    return <LoadingSpinner fullScreen message="Loading authentication..." />;
  }

  if (!user) {
    return <div className="text-center p-10">Redirecting to login...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Add New Trip</h1>
      
      {step === 1 && (
        <TripBasicsStep 
          formData={formData}
          setFormData={setFormData}
          validateStep1={validateStep1}
          setStep={setStep}
          getInitialStartDate={getInitialStartDate}
        />
      )}

      {step === 2 && (
        <TripDetailsStep 
          formData={formData}
          setFormData={setFormData}
          files={files}
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          setStep={setStep}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

// --- Sub-components ---

const TripBasicsStep = ({ formData, setFormData, validateStep1, setStep, getInitialStartDate }) => {
  const handleDaysChange = (value) => {
    const num = parseInt(value, 10);
    if (value === "" || (num >= 1 && !isNaN(num))) {
      setFormData({ ...formData, days: value === "" ? "" : num });
    } else if (num < 1) {
      setFormData({ ...formData, days: 1 });
    }
  };
  
  const handleStartDateChange = (e) => {
    setFormData({ ...formData, startDate: e.target.value, days: 1 }); // Optionally reset days if start date changes
  };


  return (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-500 ease-in-out">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Step 1: Trip Basics</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
        <select
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Destination</option>
          <option value="Damascus">Damascus</option>
          <option value="Aleppo">Aleppo</option>
          <option value="Palmyra">Palmyra</option>
          <option value="Latakia">Latakia</option>
          {/* Add more destinations as needed */}
        </select>
      </div>
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          min={getInitialStartDate()}
          value={formData.startDate}
          onChange={handleStartDateChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
        <div className="flex items-center gap-2 mt-1">
          <button
            type="button"
            onClick={() => handleDaysChange(Math.max(1, parseInt(formData.days || 1, 10) - 1))}
            className="p-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            aria-label="Decrease duration by one day"
          >
            <FaMinus />
          </button>
          <input 
            type="number"
            id="days"
            name="days"
            value={formData.days}
            onChange={(e) => handleDaysChange(e.target.value)}
            min="1"
            className="p-3 text-lg font-medium text-gray-800 w-16 text-center border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
          />
          <button
            type="button"
            onClick={() => handleDaysChange(parseInt(formData.days || 0, 10) + 1)}
            className="p-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            aria-label="Increase duration by one day"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
    <div className="mt-8 text-right">
      <button
        onClick={() => validateStep1() && setStep(2)}
        className="bg-blue-600 text-white px-8 py-3 rounded-md shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Next
      </button>
    </div>
  </div>
  );
};

const TripDetailsStep = ({ formData, setFormData, files, handleFileChange, handleSubmit, setStep, isSubmitting }) => {
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumericInputChange = (e, fieldName) => {
    let value = e.target.value;
    // Allow empty string, or numbers (integers for capacity, decimals for price)
    // Basic filter: allows digits, one decimal point for price, nothing else for capacity if it should be integer
    if (value === "") {
        setFormData({ ...formData, [fieldName]: "" });
        return;
    }

    if (fieldName === "price") {
        if (/^\d*\.?\d*$/.test(value)) { // Allows numbers and one decimal
            setFormData({ ...formData, [fieldName]: value });
        }
    } else if (fieldName === "capacity") {
        if (/^\d*$/.test(value)) { // Allows only digits
            const num = parseInt(value, 10);
             if (!isNaN(num) && num > 0) {
                 setFormData({ ...formData, [fieldName]: num });
             } else if (value === "" || parseInt(value,10) === 0) { // allow to clear or be 0 before validation
                 setFormData({ ...formData, [fieldName]: value });
             }
        } else if (value === "") {
            setFormData({ ...formData, [fieldName]: "" });
        }
    }
  };


  return (
  <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-500 ease-in-out">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Step 2: Trip Details</h2>
    <div className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Ancient Wonders of Damascus"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm h-32 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Provide a captivating description of the trip..."
          required
          minLength="20" // Consistent with schema
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input
            id="price"
            name="price"
            type="text" // Changed to text for more flexible input, validation handles format
            value={formData.price}
            onChange={(e) => handleNumericInputChange(e, "price")}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 999.99"
            required
          />
        </div>
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">Capacity (Max Guests)</label>
          <input
            id="capacity"
            name="capacity"
            type="text" // Changed to text for more flexible input
            value={formData.capacity}
            onChange={(e) => handleNumericInputChange(e, "capacity")}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 15"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Adventure">Adventure</option>
          <option value="Cultural">Cultural</option>
          <option value="Beach">Beach</option>
          <option value="Cruise">Cruise</option>
          <option value="Family">Family</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Trip Images (Max 5)</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="image-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload files</span>
                <input
                  id="image-upload"
                  name="images"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="sr-only"
                  accept="image/png, image/jpeg, image/gif"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
          </div>
        </div>
        {files.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700">Selected files:</p>
            <ul className="list-disc list-inside pl-2 mt-1">
              {files.map((file, index) => (
                <li key={index} className="text-sm text-gray-600 truncate">
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-full sm:w-auto mb-2 sm:mb-0 bg-gray-200 text-gray-800 px-8 py-3 rounded-md shadow-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="button" 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-md shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
        >
          {isSubmitting ? "Creating..." : "Create Trip"}
        </button>
      </div>
    </div>
  </div>
  );
};

export default AddTrip;