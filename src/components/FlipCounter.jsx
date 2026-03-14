import React, { useState, useEffect } from 'react';
import './FlipCounter.css';

function FlipCounter(props) {
  const { value, duration = 1500, className = '', prefix = '$' } = props;
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

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (targetValue - startValue) * easeOut);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formatted = displayValue.toLocaleString('en-US');

  return (
    <span className={`flip-counter ${className}`}>
      {prefix}{formatted}
    </span>
  );
}

export default FlipCounter;
