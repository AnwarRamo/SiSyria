import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaStar, FaRegUser } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "Abdulrahman",
    rating: 4.5,
    text: "Amazing experience! The team was very professional, and the service was fast and efficient. Highly recommended!",
  },
  {
    id: 2,
    name: "Doaa",
    rating: 5,
    text: "The best platform for booking trips! Everything was perfectly organized, and the instructions were clear.",
  },
  {
    id: 3,
    name: "Anwar",
    rating: 3.5,
    text: "Good experience overall, but customer communication could be improved.",
  },
  {
    id: 4,
    name: "Ayham",
    rating: 5,
    text: "An unforgettable trip! Every detail was perfect, and the team was extremely friendly.",
  },
  {
    id: 5,
    name: "Ali",
    rating: 4,
    text: "Excellent service, but some small details like trip timing could be improved.",
  },
];

const Review = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#f8fafc]">
      <h2 className="text-4xl font-bold text-[#115d5a] mb-8">Customer Reviews</h2>

      <div className="flex items-center justify-center space-x-4">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="text-gray-600 hover:text-[#115d5a] transition-all duration-300"
        >
          <FaArrowLeft size={24} />
        </button>

        {/* Review Card */}
        <div className="relative flex items-center space-x-4 overflow-hidden w-[300px] md:w-[600px] lg:w-[800px]">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`p-6 bg-white rounded-2xl shadow-lg w-72 flex-shrink-0 transition-all duration-500 ${
                index === current
                  ? "scale-110 opacity-100"
                  : "scale-90 opacity-50"
              }`}
              style={{
                transform: `translateX(-${current * 100}%)`,
              }}
            >
              {/* User Name and Icon */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-[#115d5a]">
                  {review.name}
                </h3>
                <FaRegUser size={32} className="text-[#E7C873]" />
              </div>

              {/* Star Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i + 1 <= Math.floor(review.rating)
                        ? "text-yellow-400"
                        : i < review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-sm text-gray-700">{review.text}</p>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="text-gray-600 hover:text-[#115d5a] transition-all duration-300"
        >
          <FaArrowRight size={24} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex space-x-2 mt-8">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current ? "bg-[#115d5a]" : "bg-gray-300"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Review;