import React from "react";
import LandmarkImage from "../../assets/images/landmarkImage.jpg";
import NavBar from "../../layout/Navbar";
import Footer from "../../layout/Footer";

export const ContactUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-[#f8fafc] text-black dark:bg-[#0a192f] dark:text-white" style={{ backgroundImage: `url(${LandmarkImage})` }}>
      <NavBar />
      <div
        className="container mx-auto mt-32 mb-24"
        style={{
          maxWidth: "1200px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          flexGrow: 1,
        }}
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            style={{
              color: "#115d5a", // Updated to dark teal
              marginBottom: "20px",
              fontSize: "40px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            Contact Us
          </h1>
          <p style={{ fontSize: "18px", color: "#555" }}>
            Get in touch with us for inquiries, support, or feedback.
          </p>
        </div>

        {/* Main Section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            marginBottom: "30px",
          }}
        >
          {/* Contact Info Section */}
          <div
            style={{
              flex: 1,
              minWidth: "300px",
              backgroundColor: "#ffffff",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ color: "#115d5a", marginBottom: "20px" }}> {/* Updated to dark teal */}
              Contact Information
            </h2>
            <ContactItem icon="📞" title="Call Us" detail="+963 0981546088" />
            <ContactItem icon="📧" title="Email Us" detail="anwarramo@gamil.com" />
            <ContactItem icon="📍" title="Visit Us" detail="Syria" />
          </div>

          {/* Form Section */}
          <div
            style={{
              flex: 2,
              minWidth: "300px",
              backgroundColor: "#f8f9fa",
              padding: "30px",
              borderRadius: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ color: "#115d5a", marginBottom: "20px" }}> {/* Updated to dark teal */}
              Send Us a Message
            </h2>
            <form>
              <InputField label="Full Name" placeholder="Enter your name" />
              <InputField label="Email" placeholder="example@gmail.com" type="email" />
              <InputField label="Phone Number" placeholder="+963" type="tel" />
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Message</label>
                <textarea
                  rows="5"
                  placeholder="Type your message..."
                  style={textareaStyle}
                />
              </div>
              <button
                type="submit"
                style={buttonStyle}
                onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

// Contact Item Component
const ContactItem = ({ icon, title, detail }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "15px",
    }}
  >
    <div
      style={{
        width: "50px",
        height: "50px",
        backgroundColor: "#E7C873", // Updated to gold
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        color: "white",
      }}
    >
      {icon}
    </div>
    <div>
      <h4 style={{ margin: "0", fontSize: "18px", color: "#115d5a" }}>{title}</h4> {/* Updated to dark teal */}
      <p style={{ margin: "0", color: "#555", fontSize: "16px" }}>{detail}</p>
    </div>
  </div>
);

// Input Field Component
const InputField = ({ label, placeholder, type = "text" }) => (
  <div style={{ marginBottom: "20px" }}>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      style={inputStyle}
    />
  </div>
);

// Styles
const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "10px",
  fontSize: "16px",
  color: "#115d5a", // Updated to dark teal
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "16px",
  transition: "border-color 0.3s",
};

const textareaStyle = {
  ...inputStyle,
  resize: "none",
};

// Button Style
const buttonStyle = {
  background: "#115d5a", // Updated to dark teal
  color: "white",
  padding: "15px 30px",
  border: "none",
  borderRadius: "10px",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export default ContactUs;



// import React, { useState, useEffect, useRef } from 'react';

// // --- SVG Icons (as React Components) ---
// const PriceIcon = () => <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1h4v1h-4zm-2 10v-1h4v1h-4z"></path></svg>;
// const DurationIcon = () => <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>;
// const DatesIcon = () => <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
// const DestinationIcon = () => <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;

// // --- Animated Character: Sandy The Crab ---
// const SandyTheCrab = ({ targetRefs }) => {
//     const sandyRef = useRef(null);

//     useEffect(() => {
//         const sandy = sandyRef.current;
//         if (!sandy) return;

//         const sandyBody = sandy.querySelector('.crab-body');
//         const sandyRightClaw = sandy.querySelector('.crab-claw.right');
        
//         const handleScroll = () => {
//             const priceCard = targetRefs.priceCardRef.current;
//             const ctaSection = targetRefs.ctaSectionRef.current;

//             // Interaction with Price Card
//             if (priceCard) {
//                 const priceRect = priceCard.getBoundingClientRect();
//                 if (priceRect.top < window.innerHeight * 0.8 && priceRect.bottom > window.innerHeight * 0.2) {
//                     sandy.style.transform = `translate(${priceRect.left - 50}px, ${window.scrollY + priceRect.top - 150}px) rotate(-15deg)`;
//                     sandyRightClaw.style.animation = 'none';
//                 } else {
//                     sandy.style.transform = 'translate(0, 0) rotate(0)';
//                     sandyRightClaw.style.animation = 'wave 1.5s infinite';
//                 }
//             }

//             // Interaction with CTA Section
//             if (ctaSection) {
//                 const ctaRect = ctaSection.getBoundingClientRect();
//                 if (ctaRect.top < window.innerHeight * 0.8) {
//                     sandyBody.style.animation = 'excitedDance 1s infinite ease-in-out';
//                 } else {
//                     sandyBody.style.animation = 'scuttle 2s infinite ease-in-out';
//                 }
//             }
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, [targetRefs]);

//     return (
//         <div ref={sandyRef} className="fixed bottom-5 left-5 z-[1000] w-32 h-auto transition-transform duration-1000 ease-in-out pointer-events-none">
//             <div className="crab-body w-20 h-16 bg-red-400 rounded-[50%_50%_40%_40%] relative mx-auto animate-scuttle">
//                 <div className="crab-eye left absolute top-[-10px] w-2.5 h-5 bg-red-400 rounded-md left-5"></div>
//                 <div className="crab-eye right absolute top-[-10px] w-2.5 h-5 bg-red-400 rounded-md right-5"></div>
//                 <div className="crab-claw left absolute top-2.5 w-8 h-6 bg-red-400 rounded-t-full origin-bottom -rotate-30 left-[-25px]"></div>
//                 <div className="crab-claw right absolute top-2.5 w-8 h-6 bg-red-400 rounded-t-full origin-bottom rotate-30 right-[-25px] animate-wave"></div>
//                 <div className="crab-leg absolute bottom-0 w-2.5 h-8 bg-red-400 rounded-md left-[5px] rotate-45"></div>
//                 <div className="crab-leg absolute bottom-0 w-2.5 h-8 bg-red-400 rounded-md left-[25px] rotate-25"></div>
//                 <div className="crab-leg absolute bottom-0 w-2.5 h-8 bg-red-400 rounded-md left-[45px] -rotate-25"></div>
//                 <div className="crab-leg absolute bottom-0 w-2.5 h-8 bg-red-400 rounded-md left-[65px] -rotate-45"></div>
//             </div>
//             {/* Adding the eye pupils via pseudo-elements in a style tag since Tailwind doesn't support them directly */}
//             <style>{`
//                 #sandy-the-crab .crab-eye::after {
//                     content: ''; position: absolute; top: -8px; left: 1px; width: 8px; height: 8px;
//                     background: white; border-radius: 50%; border: 2px solid #333;
//                 }
//             `}</style>
//         </div>
//     );
// };


// // --- Page Sections ---
// const HeroSection = () => {
//     const [transform, setTransform] = useState('');

//     const handleMouseMove = (e) => {
//         const { clientX, clientY, currentTarget } = e;
//         const { offsetWidth, offsetHeight } = currentTarget;
//         const x = (clientX / offsetWidth - 0.5) * 20; // Reduced intensity
//         const y = (clientY / offsetHeight - 0.5) * 20; // Reduced intensity
//         setTransform(`rotateY(${x}deg) rotateX(${-y}deg)`);
//     };

//     const handleMouseLeave = () => {
//         setTransform('');
//     };

//     return (
//         <header 
//             className="h-screen flex items-center justify-center text-white text-center p-4 bg-cover bg-center"
//             style={{ 
//                 backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2)), url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
//                 perspective: '1000px'
//             }}
//             onMouseMove={handleMouseMove}
//             onMouseLeave={handleMouseLeave}
//         >
//             <div className="transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform }}>
//                 <h1 className="text-5xl md:text-8xl font-black tracking-tighter animate-fadeInUp" style={{ textShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>The Maldives Dream Escape</h1>
//                 <p className="mt-4 text-xl md:text-2xl font-light animate-fadeInUp animation-delay-200">Your personal slice of paradise awaits.</p>
//                 <a href="#trip-details" className="mt-8 inline-block bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 animate-fadeInUp animation-delay-400">
//                     Explore The Trip
//                 </a>
//             </div>
//         </header>
//     );
// };

// const TripDetailsSection = React.forwardRef((props, ref) => (
//     <section id="trip-details" className="py-20 px-4 container mx-auto">
//         <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-800">Trip At a Glance</h2>
//             <p className="text-gray-500 mt-2">Everything you need to know, all in one place.</p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             <div ref={ref} className="card-3d bg-white p-6 rounded-2xl shadow-lg text-center">
//                 <div className="text-teal-500 mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-teal-50"><PriceIcon /></div>
//                 <h3 className="font-bold text-xl text-gray-800">Price</h3>
//                 <p className="text-3xl font-extrabold text-teal-600 mt-2">$2,499</p>
//                 <p className="text-gray-500 text-sm">per person</p>
//             </div>
//             <div className="card-3d bg-white p-6 rounded-2xl shadow-lg text-center">
//                 <div className="text-indigo-500 mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-indigo-50"><DurationIcon /></div>
//                 <h3 className="font-bold text-xl text-gray-800">Duration</h3>
//                 <p className="text-3xl font-extrabold text-indigo-600 mt-2">8 Days</p>
//                 <p className="text-gray-500 text-sm">7 Nights</p>
//             </div>
//             <div className="card-3d bg-white p-6 rounded-2xl shadow-lg text-center">
//                 <div className="text-rose-500 mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-rose-50"><DatesIcon /></div>
//                 <h3 className="font-bold text-xl text-gray-800">Dates</h3>
//                 <p className="text-xl font-bold text-rose-600 mt-2">Oct 15-22, 2025</p>
//                 <p className="text-gray-500 text-sm">Peak Season</p>
//             </div>
//             <div className="card-3d bg-white p-6 rounded-2xl shadow-lg text-center">
//                 <div className="text-amber-500 mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-amber-50"><DestinationIcon /></div>
//                 <h3 className="font-bold text-xl text-gray-800">Destination</h3>
//                 <p className="text-3xl font-extrabold text-amber-600 mt-2">Maldives</p>
//                 <p className="text-gray-500 text-sm">South Malé Atoll</p>
//             </div>
//         </div>
//         <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Highlights, Activities, Meals */}
//             <div><h3 className="font-bold text-lg text-gray-800">Highlights</h3><ul className="mt-2 space-y-2 text-gray-600">
//                 <li className="flex items-center"><span className="text-teal-500 mr-2">✓</span>Overwater Bungalows</li>
//                 <li className="flex items-center"><span className="text-teal-500 mr-2">✓</span>Coral Reef Snorkeling</li>
//                 <li className="flex items-center"><span className="text-teal-500 mr-2">✓</span>Sunset Dolphin Cruise</li>
//             </ul></div>
//             <div><h3 className="font-bold text-lg text-gray-800">Activities</h3><ul className="mt-2 space-y-2 text-gray-600">
//                 <li className="flex items-center"><span className="text-teal-500 mr-2">✓</span>Scuba Diving & Kayaking</li>
//                 <li className="flex items-center"><span className="text-teal-500 mr-2">✓</span>Local Island Hopping</li>
//                 <li className="flex items-center"><span className="text-teal-500 mr-2">✓</span>Spa & Wellness Center</li>
//             </ul></div>
//             <div><h3 className="font-bold text-lg text-gray-800">Meals Included</h3><ul className="mt-2 space-y-2 text-gray-600">
//                 <li className="flex items-center"><span className="text-teal-500 mr-2">✓</span>Daily Gourmet Breakfast</li>
//                 <li className="flex items-center"><span className="text-teal-500 mr-2">✓</span>Daily Themed Dinner</li>
//                 <li className="flex items-center"><span className="text-teal-500 mr-2">✓</span>Welcome Cocktail Party</li>
//             </ul></div>
//         </div>
//     </section>
// ));

// const ItinerarySection = () => {
//     const itineraryData = [
//         { day: 1, title: 'Arrival in Paradise', description: "Arrive at Malé airport, where you'll be greeted and whisked away by speedboat to our luxurious overwater resort. Settle in and enjoy a welcome cocktail as the sun sets." },
//         { day: 2, title: 'Underwater Wonders', description: 'Explore the vibrant house reef teeming with colorful fish, turtles, and rays. Our marine biologist will guide you to the best spots for an unforgettable snorkeling experience.' },
//         { day: 4, title: 'Sunset & Dolphins', description: 'Embark on a traditional dhoni boat for a magical sunset cruise. Watch pods of playful dolphins leap through the waves as the sky turns into a canvas of fiery colors.' }
//     ];

//     return (
//         <section className="py-20 px-4 bg-teal-50">
//             <div className="container mx-auto">
//                 <div className="text-center mb-16">
//                     <h2 className="text-4xl font-bold text-gray-800">Your Day-by-Day Adventure</h2>
//                     <p className="text-gray-500 mt-2">An unforgettable journey from start to finish.</p>
//                 </div>
//                 <div className="relative">
//                     <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-teal-200 rounded-full hidden md:block"></div>
//                     <div className="space-y-16">
//                         {itineraryData.map((item, index) => (
//                             <div key={index} className="relative flex md:justify-center items-center">
//                                 {index % 2 !== 0 && <div className="hidden md:block w-1/2"></div>}
//                                 <div className="hidden md:block absolute w-6 h-6 rounded-full bg-teal-500 border-4 border-white z-10"></div>
//                                 <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
//                                     <div className={`bg-white p-6 rounded-2xl shadow-lg card-3d ${index % 2 !== 0 ? 'text-right' : ''}`}>
//                                         <p className="text-teal-500 font-bold">Day {item.day}: {item.title}</p>
//                                         <p className="text-gray-600 mt-2">{item.description}</p>
//                                     </div>
//                                 </div>
//                                 {index % 2 === 0 && <div className="hidden md:block w-1/2"></div>}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// const GallerySection = () => {
//     const images = [
//         "https://images.unsplash.com/photo-1572263523352-0219b161a9b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
//         "https://images.unsplash.com/photo-1540202404-1b927e27448a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
//         "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
//         "https://images.unsplash.com/photo-1528716321680-2a043cd22e7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
//         "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
//     ];
//     return (
//         <section className="py-20 px-4">
//             <div className="container mx-auto">
//                 <div className="text-center mb-16"><h2 className="text-4xl font-bold text-gray-800">Glimpses of Your Getaway</h2><p className="text-gray-500 mt-2">Scroll through moments that await you.</p></div>
//                 <div className="relative">
//                     <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 pb-4 gallery-carousel">
//                         {images.map((src, i) => <img key={i} src={src} className="snap-center w-4/5 md:w-2/5 flex-shrink-0 rounded-2xl shadow-lg object-cover" alt={`Gallery image ${i+1}`} />)}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// const TestimonialsSection = () => {
//     const testimonials = [
//         { name: 'Jessica S.', avatar: 'JS', color: 'bg-blue-400', text: "An absolutely magical experience. The overwater bungalow was a dream come true. The staff were incredible and the dolphin cruise was the highlight of our trip!" },
//         { name: 'Michael B.', avatar: 'MB', color: 'bg-pink-400', text: "I've traveled all over the world, and this trip to the Maldives is now at the top of my list. The attention to detail was impeccable. Worth every single penny." },
//         { name: 'Chen & David', avatar: 'C+D', color: 'bg-indigo-400', text: "We went for our honeymoon and it was more perfect than we could have imagined. So romantic and relaxing. We're already planning our anniversary trip back!" }
//     ];
//     return (
//         <section className="py-20 px-4 bg-gray-50">
//             <div className="container mx-auto">
//                 <div className="text-center mb-16"><h2 className="text-4xl font-bold text-gray-800">What Our Travelers Say</h2><p className="text-gray-500 mt-2">Real stories from people just like you.</p></div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                     {testimonials.map((t, i) => (
//                         <div key={i} className="bg-white p-8 rounded-2xl shadow-lg">
//                             <div className="flex items-center mb-4">
//                                 <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-bold`}>{t.avatar}</div>
//                                 <div className="ml-4"><p className="font-bold text-gray-800">{t.name}</p><p className="text-amber-500">★★★★★</p></div>
//                             </div>
//                             <p className="text-gray-600">{t.text}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// const CtaSection = React.forwardRef((props, ref) => (
//     <section ref={ref} id="cta-section" className="py-24 bg-teal-600 text-white">
//         <div className="container mx-auto text-center px-4">
//             <h2 className="text-4xl md:text-5xl font-black">Ready for an Unforgettable Escape?</h2>
//             <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto text-teal-100">Your dream vacation is just a click away. Don't let this slice of paradise slip by!</p>
//             <button className="mt-8 bg-white text-teal-600 font-bold py-4 px-10 rounded-full text-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 animate-pulse">
//                 I Want This Trip!
//             </button>
//         </div>
//     </section>
// ));


// // --- Main App Component ---
// export default function App() {
//     const priceCardRef = useRef(null);
//     const ctaSectionRef = useRef(null);

//     // This effect is for scroll-triggered animations on cards
//     useEffect(() => {
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('opacity-100', 'translate-y-0');
//                     entry.target.classList.remove('opacity-0', 'translate-y-8');
//                     observer.unobserve(entry.target);
//                 }
//             });
//         }, { threshold: 0.1 });

//         document.querySelectorAll('.card-3d').forEach(el => {
//             el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
//             observer.observe(el);
//         });
        
//         return () => observer.disconnect();
//     }, []);

//     return (
//         <div className="bg-gray-50 font-poppins overflow-x-hidden">
//              {/* We need a style tag for keyframe animations as Tailwind config is not available here */}
//             <style>{`
//                 @keyframes fadeInUp {
//                     from { opacity: 0; transform: translateY(30px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }
//                 @keyframes wave {
//                     0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(20deg); } 75% { transform: rotate(-15deg); }
//                 }
//                 @keyframes scuttle {
//                     0%, 100% { transform: translateX(0) rotate(0deg); } 25% { transform: translateX(-5px) rotate(-5deg); } 75% { transform: translateX(5px) rotate(5deg); }
//                 }
//                 @keyframes excitedDance {
//                     0%, 100% { transform: translateY(0) rotate(0); } 25% { transform: translateY(-10px) rotate(10deg); } 50% { transform: translateY(0) rotate(0); } 75% { transform: translateY(-10px) rotate(-10deg); }
//                 }
//                 .animate-fadeInUp { animation: fadeInUp 1s ease-out .2s both; }
//                 .animation-delay-200 { animation-delay: 0.4s; }
//                 .animation-delay-400 { animation-delay: 0.6s; }
//                 .animate-wave { animation: wave 1.5s infinite; }
//                 .animate-scuttle { animation: scuttle 2s infinite ease-in-out; }
//                 .gallery-carousel::-webkit-scrollbar { display: none; }
//                 .gallery-carousel { -ms-overflow-style: none; scrollbar-width: none; }
//                 .card-3d:hover { transform: translateY(-15px) rotateX(5deg); box-shadow: 0 25px 40px rgba(0,0,0,0.2); }
//             `}</style>
            
//             <SandyTheCrab targetRefs={{ priceCardRef, ctaSectionRef }} />
//             <HeroSection />
//             <main>
//                 <TripDetailsSection ref={priceCardRef} />
//                 <ItinerarySection />
//                 <GallerySection />
//                 <TestimonialsSection />
//                 <CtaSection ref={ctaSectionRef} />
//             </main>
//         </div>
//     );
// }

