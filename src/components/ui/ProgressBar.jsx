import { useEffect, useState } from "react";

const ProgressBar = ({ score }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= score) {
          clearInterval(interval);
          return score;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [score]);

  const getColor = () => {
    if (score >= 75) return "#22c55e"; // Green
    if (score >= 50) return "#eab308"; // Yellow
    return "#ef4444" // Red
  };

  // For the SVG circle:
  // - Container is 125px, so center is at 62.5, 62.5.
  // - We'll use a radius of 55px, leaving an 8px margin (approx) for the stroke.
  // - Stroke width is scaled to 16px (vs 20px in the original 160px container).
  // - Circumference = 2 * PI * 55 ≈ 345.6.
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (circumference * progress) / 100;

  return (
    <div className="grid place-items-start">
      <div className="relative w-[125px] h-[125px] flex items-center justify-center">
        {/* Outer shadow circle */}
        <div className="w-full h-full rounded-full shadow-[6px_6px_10px_-1px_rgba(0,0,0,0.15),-6px_-6px_10px_-1px_rgba(255,255,255,0.7)] p-4">
          {/* Inner shadow circle */}
          <div className="w-full h-full rounded-full shadow-[inset_4px_4px_6px_-1px_rgba(0,0,0,0.2),inset_-4px_-4px_6px_-1px_rgba(255,255,255,0.7),-0.5px_-0.5px_0_rgba(255,255,255,1),0.5px_0.5px_0_rgba(0,0,0,0.15),0px_12px_10px_-10px_rgba(0,0,0,0.05)] flex items-center justify-center">
            <span className="text-xl font-semibold text-gray-700">{progress}%</span>
          </div>
        </div>

        {/* SVG Progress Circle */}
        <svg className="absolute top-0 left-0" width="125" height="125">
          <circle
            cx="62.5"
            cy="62.5"
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-100"
          />
        </svg>
      </div>
    </div>
  );
};

export default ProgressBar;
