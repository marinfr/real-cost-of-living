import React, { useState, useEffect } from 'react';
import './FlipCounter.css';

/**
 * Animated flip counter component
 * Animates from 0 to a target number with visual flip effect
 */
function FlipCounter({ value, duration = 1500, className = '' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    const startTime = Date.now();
    const startValue = 0;
    const targetValue = value;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (targetValue - startValue) * easeOut);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  // Format number with commas
  const formatted = displayValue.toLocaleString('en-US');

  return (
    <span className={`flip-counter ${className}`}>
      ${formatted}
    </span>
  );
}

export default FlipCounter;
