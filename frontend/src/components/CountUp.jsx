import { useEffect, useState } from 'react';

function CountUp({ end = 0, duration = 1.2 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const safeEnd = Number.isFinite(end) ? end : 0;
    const totalMs = Math.max(1, Math.floor(duration * 1000));
    const stepMs = 30;
    const steps = Math.max(1, Math.floor(totalMs / stepMs));
    const increment = safeEnd / steps;
    let current = 0;
    let count = 0;

    const timer = setInterval(() => {
      count += 1;
      current += increment;
      if (count >= steps) {
        setValue(safeEnd);
        clearInterval(timer);
        return;
      }
      setValue(Math.round(current));
    }, stepMs);

    return () => {
      clearInterval(timer);
    };
  }, [end, duration]);

  return value;
}

export default CountUp;
