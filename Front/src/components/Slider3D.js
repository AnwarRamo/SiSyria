import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import damascus from '../assets/images/damascus.jpg';
import aleppo from '../assets/images/Alepo.jpg';
import img3 from '../assets/images/img3.jpg';
import Latakia from '../assets/images/latakia2.jpg';

const slides = [
  { src: damascus, title: 'Damascus', desc: 'The capital of Syria, rich in history.' },
  { src: aleppo, title: 'Aleppo', desc: 'A city of heritage and culture.' },
  { src: img3, title: 'Palmyra', desc: 'Roman ruins and desert beauty.' },
  { src: Latakia, title: 'Latakia', desc: 'Coastal city with beautiful beaches.' },
];

const Slider3D = () => (
  <section className="relative w-full py-16 bg-gradient-to-b from-[#f8fafc] to-[#e0e7ef] flex flex-col items-center">
    <h2 className="text-4xl md:text-5xl font-bold text-[#115d5a] mb-10 text-center drop-shadow-lg">Explore Destinations</h2>
    <div className="w-full max-w-4xl">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Autoplay, Pagination]}
        className="mySwiper"
        style={{ paddingBottom: '60px' }}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="flex flex-col items-center justify-center">
            <div className="relative w-72 h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-2xl font-bold text-white drop-shadow">{slide.title}</h3>
                <p className="text-white/80 text-sm mt-1">{slide.desc}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default Slider3D; 