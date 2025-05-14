import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface IFinish {
    onFinish : () => void;
}

function SplashScreen({ onFinish }: IFinish) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500); 
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-light-background dark:bg-dark-background">
      <motion.img
        src="/assets/logo.png" 
        alt="Logo"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        width={80}
      />
    </div>
  );
}

export default SplashScreen;