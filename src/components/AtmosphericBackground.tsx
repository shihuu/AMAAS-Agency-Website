import React from 'react';
import { motion } from 'motion/react';
import backgroundImage from '../assets/images/amaas-background.jpg';

export const AtmosphericBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Exact uploaded blue abstract background image: download (4).jpg / amaas-background.jpg */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-[center_top]"
        style={{
          backgroundImage: `url("${backgroundImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Subtle living atmospheric ambient light pulsation (10s gentle breath) */}
      <motion.div
        animate={{
          opacity: [0.18, 0.32, 0.18],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-[20%] -left-[10%] w-[140%] h-[140%] bg-radial from-[#38bdf8]/15 via-transparent to-transparent pointer-events-none"
      />

      {/* Subtle dark transparent overlay: rgba(2, 8, 20, 0.35) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(2, 8, 20, 0.35)',
        }}
      />
    </div>
  );
};


