import React from "react";
import NavBar from "../../layout/Navbar";
import Footer from "../../layout/Footer";
import Team from "../../assets/images/team.jpg";
import LandmarkImage from "../../assets/images/landmarkImage.jpg";

export const AboutUs = () => {
  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${LandmarkImage})` }}
    >
      <NavBar />
      
      <div className="flex-grow">
        <div className="container mx-auto mt-24 mb-16 px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 lg:p-10">
            {/* Header Section */}
            <header className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-[#115d5a] uppercase tracking-wide mb-4">
                About Us
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover the beauty, history, and culture of Syria. A land of rich traditions and breathtaking landscapes.
              </p>
            </header>

            {/* Main Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Our Story */}
              <section className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-bold text-[#115d5a] mb-4">
                  Our Story
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Explore Syria's timeless history and culture. From ancient ruins to bustling souks, our mission is to bring the beauty of Syria to travelers around the world.
                </p>
              </section>

              {/* Vision and Mission */}
              <section className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-bold text-[#E7C873] mb-4">
                  Our Vision & Mission
                </h2>
                <ul className="text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <span className="font-semibold min-w-[70px]">Vision:</span>
                    <span>To celebrate and preserve Syria's cultural and natural heritage.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold min-w-[70px]">Mission:</span>
                    <span>Inspiring global travelers to experience Syria's rich history and vibrant traditions.</span>
                  </li>
                </ul>
              </section>
            </div>

            {/* Team Section */}
            <section className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-[#115d5a] mb-10">
                Meet the Team
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <TeamMember name="Anwar Ramo" role="CEO" imgUrl={Team} />
                <TeamMember name="Doaa Ali" role="CTO" imgUrl={Team} />
                <TeamMember name="Abd Al Rahman" role="Designer" imgUrl={Team} />
              </div>
            </section>

            {/* Core Values */}
            <section className="bg-gray-50 p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-[#E7C873] text-center mb-10">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ValueCard 
                  title="Heritage" 
                  description="Preserving and showcasing Syria's timeless culture." 
                  bgColor="#115d5a" 
                />
                <ValueCard 
                  title="Hospitality" 
                  description="Sharing the warmth and generosity of Syrian people." 
                  bgColor="#E7C873" 
                />
                <ValueCard 
                  title="Sustainability" 
                  description="Promoting sustainable tourism to protect Syria's treasures." 
                  bgColor="#6b7280" 
                />
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const TeamMember = ({ name, role, imgUrl }) => (
  <div className="bg-white p-5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
    <div className="flex justify-center mb-4">
      <div className="relative">
        <img 
          src={imgUrl} 
          alt={`${name}'s photo`} 
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
        />
      </div>
    </div>
    <h3 className="text-xl font-bold text-[#115d5a] mb-1">{name}</h3>
    <p className="text-gray-600">{role}</p>
  </div>
);

const ValueCard = ({ title, description, bgColor }) => (
  <div 
    className="p-6 rounded-xl text-white shadow-lg"
    style={{ backgroundColor: bgColor }}
  >
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p>{description}</p>
  </div>
);

export default AboutUs;
// import React, { useState, useEffect } from 'react';
// import { ChevronDown, PlusCircle, Share2, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// // --- SVG ICONS ---
// const IconHeart = ({ size = 20, className = "", isFilled = false }) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
//   </svg>
// );


// // --- UI COMPONENTS ---

// // Reusable Button Component
// const Button = ({ children, className, variant = 'primary', ...props }) => {
//   const baseStyles = 'px-5 py-2 rounded-full font-semibold transition-all duration-300 flex items-center justify-center';
//   const variants = {
//     primary: 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg',
//     outline: 'border border-white text-white hover:bg-white hover:text-slate-900',
//   };
//   return <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>{children}</button>;
// };

// // --- PAGE SECTIONS & LAYOUT ---

// const Header = () => (
//   <header className="absolute top-0 left-0 right-0 z-50 py-8 px-4 sm:px-8 md:px-16 flex justify-between items-start text-white animate-fade-in-down">
//     {/* Logo */}
//     <div className="flex flex-col leading-none">
//       <span className="text-3xl font-light tracking-wider" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Syria Travel</span>
//       <span className="text-[0.6rem] font-light tracking-[0.2em]" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>ANCIENT LANDS</span>
//       <span className="text-[0.6rem] font-light tracking-[0.35em]" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>EXPLORE</span>
//     </div>

//     {/* Navigation */}
//     <nav className="hidden lg:flex items-center space-x-8 text-sm pt-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
//       <a href="#" className="hover:text-amber-400 transition">Tours</a>
//       <a href="#" className="hover:text-amber-400 transition">Destinations</a>
//       <a href="#" className="flex items-center hover:text-amber-400 transition">
//         About Us <ChevronDown className="w-4 h-4 ml-1" />
//       </a>
//       <a href="#" className="hover:text-amber-400 transition">Contacts</a>
//     </nav>

//     {/* Right-side button */}
//     <div className="hidden lg:block">
//         <Button variant="outline">
//             <MessageCircle className="w-4 h-4 mr-2"/>
//             Inquire Now
//         </Button>
//     </div>
//   </header>
// );

// const InfoCard = ({ title, children, isActive, onClick, style }) => {
//     const [isLiked, setIsLiked] = useState(false);

//     return (
//         <div 
//             onClick={onClick}
//             style={style}
//             className={`absolute top-1/2 w-80 cursor-pointer bg-black/30 border border-white/20 backdrop-blur-lg rounded-lg p-6 shadow-2xl transition-all duration-700 ease-in-out ${isActive ? 'z-20' : 'z-10'}`}
//         >
//             <button 
//                 onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }} 
//                 className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-30"
//             >
//                 <IconHeart isFilled={isLiked} className={`transition-all duration-300 ${isLiked ? 'text-red-500 scale-110' : ''}`} />
//             </button>
//             <h3 className="text-2xl font-semibold text-white">{title}</h3>
//             <p className="mt-4 text-gray-200 text-sm leading-relaxed">
//                 {children}
//             </p>
//             <a href="#" className="mt-6 flex items-center text-amber-500 font-semibold hover:text-amber-400 transition-colors text-sm">
//                 <PlusCircle className="w-5 h-5 mr-2" />
//                 Learn More
//             </a>
//         </div>
//     );
// };

// const carouselData = [
//     {
//         title: "Damascus",
//         description: "The capital of Syria and one of the oldest continuously inhabited cities in the world, known for its historic markets and mosques.",
//         image: "https://images.unsplash.com/photo-1616982023669-732425835979?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//     },
//     {
//         title: "Aleppo",
//         description: "A city rich in cultural heritage, famous for its ancient citadel and traditional markets.",
//         image: "https://images.unsplash.com/photo-1590322969232-09605854902a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//     },
//     {
//         title: "Palmyra",
//         description: "An oasis in the Syrian desert, renowned for its Roman ruins and historical landmarks.",
//         image: "https://images.unsplash.com/photo-1589182337358-2cb32395589a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//     },
//     {
//         title: "Latakia",
//         description: "A coastal city on the Mediterranean Sea, known for its beautiful beaches and mild climate.",
//         image: "https://images.unsplash.com/photo-1603598584430-0545738875a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//     },
// ];

// const InfoCarousel = ({ activeIndex, setActiveIndex }) => {
//     const totalItems = carouselData.length;

//     const getCardStyle = (index) => {
//         const offset = index - activeIndex;
        
//         let position = '50%';
//         let scale = 0.7;
//         let opacity = 0;
//         let zIndex = 10;

//         if (offset === 0) { // Active card
//             position = '50%';
//             scale = 1.1;
//             opacity = 1;
//             zIndex = 20;
//         } else if (offset === 1 || offset === - (totalItems - 1)) { // Right card
//             position = '80%';
//             scale = 0.9;
//             opacity = 0.7;
//         } else if (offset === -1 || offset === totalItems - 1) { // Left card
//             position = '20%';
//             scale = 0.9;
//             opacity = 0.7;
//         }

//         return { 
//             transform: `translateY(-50%) translateX(-50%) scale(${scale})`, 
//             opacity: opacity, 
//             left: position,
//             zIndex: zIndex
//         };
//     };

//     return (
//         <div className="relative w-full h-80 mt-16">
//             {carouselData.map((item, index) => (
//                 <InfoCard 
//                     key={item.title}
//                     style={getCardStyle(index)}
//                     title={item.title} 
//                     isActive={index === activeIndex} 
//                     onClick={() => setActiveIndex(index)}
//                 >
//                     {item.description}
//                 </InfoCard>
//             ))}
//         </div>
//     );
// };


// const MainContent = ({ activeIndex, setActiveIndex }) => (
//     <div className="relative z-10 w-full h-full flex items-center justify-center">
//         <div className="w-full max-w-[1400px] px-4 sm:px-8 md:px-16 grid grid-cols-12 gap-x-8 items-end">
            
//             <div className="col-span-12 lg:col-span-5 pb-24 animate-slide-in-up" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.7)' }}>
//                 <h1 className="text-8xl md:text-9xl font-thin tracking-wide text-white">Explore Syria</h1>
//                 <p className="mt-6 max-w-md text-gray-100 leading-relaxed">
//                     Discover a land of ancient history, rich culture, and breathtaking landscapes. A journey through time awaits.
//                 </p>
//                 <a href="#" className="mt-8 inline-block font-semibold border-b-2 border-amber-500 pb-1 text-white hover:text-amber-400 transition text-sm">
//                     More
//                 </a>
//             </div>

//             <div className="col-span-12 lg:col-span-7 relative pb-12">
//                 <InfoCarousel activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
//             </div>
//         </div>
//     </div>
// );


// const PageFooter = ({ activeIndex, setActiveIndex }) => {
//     const totalItems = carouselData.length;
//     const next = () => setActiveIndex((activeIndex + 1) % totalItems);
//     const prev = () => setActiveIndex((activeIndex - 1 + totalItems) % totalItems);

//     return (
//         <footer className="absolute bottom-0 left-0 right-0 z-50 p-6 px-4 sm:px-8 md:px-16 flex justify-between items-center text-white animate-fade-in-up" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
//             <div className="flex items-center space-x-4">
//                 <div className="text-sm">
//                     <span className="font-bold">0{activeIndex + 1}</span> / 0{totalItems}
//                 </div>
//                 <button className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center hover:bg-white/10 transition">
//                     <Share2 className="w-5 h-5"/>
//                 </button>
//             </div>
//             <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center space-x-4">
//                 <button onClick={prev} className="hover:text-amber-400 transition-colors">Prev</button>
//                 <div className="w-24 h-0.5 bg-white/20 rounded-full">
//                     <div 
//                         className="h-full bg-amber-500 rounded-full transition-all duration-500"
//                         style={{ width: `${((activeIndex + 1) / totalItems) * 100}%` }}
//                     ></div>
//                 </div>
//                 <button onClick={next} className="hover:text-amber-400 transition-colors">Next</button>
//             </div>
//             <Button variant="primary" className="lg:hidden">
//                 <MessageCircle className="w-4 h-4 mr-2"/>
//                 Ask val
//             </Button>
//         </footer>
//     );
// };

// export default function App() {
//     const [activeIndex, setActiveIndex] = useState(0);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setActiveIndex(prev => (prev + 1) % carouselData.length);
//         }, 5000); // Change slide every 5 seconds
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <>
//             <style>{`
//                 @keyframes fade-in-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
//                 @keyframes slide-in-up { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
//                 .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
//                 .animate-slide-in-up { animation: slide-in-up 0.8s ease-out forwards; opacity: 0; animation-fill-mode: forwards; }
//             `}</style>
//             <div className="relative w-full h-screen bg-black font-sans text-white overflow-hidden">
//                 {carouselData.map((item, index) => (
//                     <div
//                         key={item.title}
//                         className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
//                         style={{
//                             backgroundImage: `url('${item.image}')`,
//                             opacity: index === activeIndex ? 1 : 0,
//                             zIndex: 0
//                         }}
//                     />
//                 ))}
                
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/20 z-10"></div>
                
//                 <div className="relative z-20">
//                     <div className="absolute top-1/4 left-16 w-px h-24 bg-white/30">
//                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white"></div>
//                     </div>
//                     <div className="absolute bottom-[40%] right-[calc(50%-100px)] w-px h-16 bg-white/30">
//                         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white"></div>
//                     </div>

//                     <Header />
                    
//                     <main className="w-full h-screen pt-24">
//                         <MainContent activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
//                     </main>
                    
//                     <PageFooter activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
//                 </div>
//             </div>
//         </>
//     );
// }
