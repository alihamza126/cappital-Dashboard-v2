import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const AnimatedNumber = ({ endValue }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 2 },
      // Animate number from 0 to endValue
      x: [0, endValue],
      // Ensure smooth animation
      type: "tween"
    });
  }, [controls, endValue]);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={controls}
    >
      {endValue}
    </motion.span>
  );
};

export default AnimatedNumber;
