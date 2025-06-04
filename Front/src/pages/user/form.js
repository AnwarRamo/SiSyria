import { useState } from "react";
import { motion } from "framer-motion";

const steps = ["Personal Info", "Address", "Work Details", "Socials", "Review"];

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    dob: "",
    gender: "",
    occupation: "",
    company: "",
    experience: "",
    skills: "",
    education: "",
    hobbies: "",
    website: "",
    linkedIn: "",
    github: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center">{steps[step - 1]}</h2>
      <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
        <motion.div
          className="h-2 bg-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(step / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
      <form>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <div className="space-y-3">
              <input name="firstName" placeholder="First Name" onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="lastName" placeholder="Last Name" onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="phone" placeholder="Phone" onChange={handleChange} className="w-full p-3 border rounded" />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3">
              <input name="address" placeholder="Address" onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="city" placeholder="City" onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="state" placeholder="State" onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="zip" placeholder="Zip Code" onChange={handleChange} className="w-full p-3 border rounded" />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3">
              <input name="company" placeholder="Company" onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="experience" placeholder="Years of Experience" onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="skills" placeholder="Skills" onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="education" placeholder="Education" onChange={handleChange} className="w-full p-3 border rounded" />
            </div>
          )}
          {step === 4 && (
            <div className="space-y-3">
              <input name="hobbies" placeholder="Hobbies" onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="website" placeholder="Personal Website" onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="linkedIn" placeholder="LinkedIn Profile" onChange={handleChange} className="w-full p-3 border rounded" />
              <input name="github" placeholder="GitHub Profile" onChange={handleChange} className="w-full p-3 border rounded" />
            </div>
          )}
        </motion.div>
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-5 py-2 rounded-lg">Back</button>
          )}
          {step < steps.length ? (
            <button type="button" onClick={nextStep} className="bg-blue-500 text-white px-5 py-2 rounded-lg">Next</button>
          ) : (
            <button type="submit" className="bg-green-500 text-white px-5 py-2 rounded-lg">Submit</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
