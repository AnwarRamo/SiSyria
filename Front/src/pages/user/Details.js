import React, { useState } from "react";
import NavBar from "../../layout/Navbar";
import Footer from "../../layout/Footer";
import Btn from "../../components/user/bokingBtn";
import Map from "../../components/user/map";
import Day1 from "../../assets/images/img1.jpg";
import Day2 from "../../assets/images/img2.jpg";
import Day3 from "../../assets/images/img3.jpg";
import Trip1 from "../../assets/images/img1.jpg";
import Trip2 from "../../assets/images/img2.jpg";
import Trip3 from "../../assets/images/img3.jpg";
import Trip4 from "../../assets/images/img4.jpg";

export const TripDetails = () => {
  const [selectedDay, setSelectedDay] = useState(Day1);

  const days = [
    { label: "Day 1", image: Day1 },
    { label: "Day 2", image: Day2 },
    { label: "Day 3", image: Day3 },
  ];

  const relatedTrips = [
    { label: "Details", image: Trip1 },
    { label: "Details", image: Trip2 },
    { label: "Details", image: Trip3 },
    { label: "Details", image: Trip4 },
  ];

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        backgroundSize: "cover",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        color: "#333",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <NavBar />
      {/* Hero Section */}
      <div
        className="relative w-full h-[550px] bg-cover bg-center mt-16"
        style={{ backgroundImage: `url(${selectedDay})` }}
        aria-label="Syria Landscape"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black">
          <div className="absolute inset-0 flex justify-between items-center px-8 h-full md:ml-32">
            <div className="text-white space-y-4">
              <h1 className="text-6xl font-extrabold drop-shadow-lg">Trip Details</h1>
              <p className="text-xl font-medium">Explore the wonders of Syria with us!</p>
              <p className="text-lg">Destination: <span className="font-semibold">Beautiful Syria</span></p>
              <p className="text-lg">Price: <span className="font-semibold">$300</span></p>
              <div className="mt-8">
                <Btn />
              </div>
            </div>
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-[350px] h-[350px] bg-white rounded-lg shadow-lg overflow-hidden">
              <Map />
            </div>
          </div>
        </div>
      </div>

      {/* Days Section */}
      <div className="flex gap-6 -mt-24 px-6">
        {days.map((day, index) => (
          <div
            key={index}
            className={`relative flex flex-col items-center bg-cover bg-center w-[180px] h-[120px] rounded-lg shadow-lg overflow-hidden transform transition-transform cursor-pointer hover:scale-110 ${
              selectedDay === day.image ? "scale-110 border-4 border-[#E7C873]" : "opacity-80"
            }`} // Updated border to gold
            style={{ backgroundImage: `url(${day.image})` }}
            aria-label={day.label}
            onClick={() => setSelectedDay(day.image)}
          >
            <span className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white font-bold text-lg">
              {day.label}
            </span>
          </div>
        ))}
      </div>

      {/* Related Trips Section */}
      <div className="mt-32 w-full text-center px-6">
        <h2 className="text-4xl font-extrabold mb-10 text-[#115d5a]">Related Trips</h2> {/* Updated to dark teal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {relatedTrips.map((trip, index) => (
            <div
              key={index}
              className="relative bg-cover bg-center w-full h-[180px] rounded-lg shadow-lg overflow-hidden hover:scale-105 transform transition-transform hover:shadow-2xl"
              style={{ backgroundImage: `url(${trip.image})` }}
              aria-label={`Related Trip ${index + 1}`}
            >
              <span className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white font-semibold text-lg">
                {trip.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TripDetails;