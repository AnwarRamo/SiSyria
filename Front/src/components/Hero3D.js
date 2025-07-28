import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.jpg';

const Logo3D = () => (
  <Float speed={2} rotationIntensity={1.2} floatIntensity={2}>
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={'#E7C873'} />
    </mesh>
    <Html center>
      <img src={logo} alt="Logo" className="w-24 h-24 rounded-full shadow-2xl border-4 border-white" />
    </Html>
  </Float>
);

const Hero3D = () => (
  <section className="relative flex flex-col items-center justify-center h-[80vh] w-full bg-gradient-to-br from-[#115d5a] to-[#1a7c78] overflow-hidden">
    <Canvas camera={{ position: [0, 0, 7], fov: 50 }} className="absolute inset-0 z-0">
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Logo3D />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
    </Canvas>
    <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
      <motion.img
        src={logo}
        alt="Logo"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-28 h-28 rounded-full shadow-2xl border-4 border-white mb-4"
      />
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-4 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        SiSyria
      </motion.h1>
      <motion.p
        className="text-xl md:text-2xl text-white/90 mb-8 text-center max-w-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        Discover immersive journeys, breathtaking destinations, and unforgettable experiences.
      </motion.p>
      <motion.a
        href="#explore"
        className="px-8 py-4 bg-[#E7C873] text-[#115d5a] font-bold rounded-full shadow-lg hover:bg-[#d4b15d] transition-all text-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        Explore Now
      </motion.a>
    </div>
  </section>
);

export default Hero3D; 