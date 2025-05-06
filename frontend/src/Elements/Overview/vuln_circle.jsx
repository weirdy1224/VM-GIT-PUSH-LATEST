  import React, { useState } from 'react';
import './Overview.css';

const severityConfig = {
  Critical: { color: 'hsl(0, 68%, 75%)', onHoverColor: '#9B0101BF' },
  High: { color: 'hsl(33, 100%, 75%)', onHoverColor: '#FF0606' },
  Medium: { color: 'hsl(47, 100%, 75%)', onHoverColor: '#F48800' },
  Low: { color: 'hsl(198, 94%, 75%)', onHoverColor: '#00ABF7' },
};

function Vuln_circle({ count, severity }) {
  const { color, onHoverColor } = severityConfig[severity];
  const [currentColor, setCurrentColor] = useState(color);

  return (
    <div
      className="flex flex-col items-center flex-grow"
      onMouseEnter={() => setCurrentColor(onHoverColor)}
      onMouseLeave={() => setCurrentColor(color)}
    >
      <div className="relative w-48 h-48">
        <svg className="w-270 h-270" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke={currentColor} strokeWidth="10" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-grow">
          <span className="text-4xl font-bold text-purple-700">{count}</span>
        </div>
      </div>
      <p className="mt-4 text-center text-sm font-medium text-gray-700">
        {severity}
      </p>
    </div>
  );
}

export default Vuln_circle;
