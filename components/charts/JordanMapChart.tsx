import React, { useState, useRef, useEffect } from 'react';
import Card from '../ui/Card';
import { GovernorateData, Indicator } from '../../types';

interface JordanMapChartProps {
  data: GovernorateData[];
  indicators: Indicator[];
  title: string;
}

// New, more robust SVG path data and label coordinates for Jordan's governorates
const jordanGovernorateShapes = [
  { name: 'Irbid', path: "M 86.8,6.3 L 122.6,23.3 L 118,41.6 L 98.4,49.5 L 90.3,44 L 86.8,6.3 Z", labelCoords: { x: 103, y: 32 } },
  { name: 'Mafraq', path: "M 122.6,23.3 L 225.4,66.4 L 219.1,105.7 L 165.2,85.2 L 118,41.6 L 122.6,23.3 Z", labelCoords: { x: 170, y: 65 } },
  { name: 'Jarash', path: "M 118,41.6 L 129.5,60.8 L 123.2,74.5 L 105.2,69.1 L 98.4,49.5 L 118,41.6 Z", labelCoords: { x: 114, y: 60 } },
  { name: 'Ajloun', path: "M 98.4,49.5 L 105.2,69.1 L 96.1,74.5 L 90.3,60 L 90.3,44 L 98.4,49.5 Z", labelCoords: { x: 95, y: 58 } },
  { name: 'Zarqa', path: "M 129.5,60.8 L 165.2,85.2 L 219.1,105.7 L 193,124.8 L 149.2,100.9 L 123.2,74.5 L 129.5,60.8 Z", labelCoords: { x: 160, y: 98 } },
  { name: 'Balqa', path: "M 90.3,60 L 96.1,74.5 L 100.7,92.8 L 86.8,105.7 L 76.5,91.8 L 78.8,75.4 L 90.3,60 Z", labelCoords: { x: 88, y: 83 } },
  { name: 'Amman', path: "M 100.7,92.8 L 149.2,100.9 L 193,124.8 L 181.5,159.2 L 100.7,133.9 L 86.8,105.7 L 100.7,92.8 Z", labelCoords: { x: 140, y: 125 } },
  { name: 'Madaba', path: "M 86.8,105.7 L 100.7,133.9 L 86.8,154.6 L 75.3,141.6 L 76.5,91.8 L 86.8,105.7 Z", labelCoords: { x: 86, y: 125 } },
  { name: 'Karak', path: "M 75.3,141.6 L 86.8,154.6 L 93.9,211.5 L 75.3,222 L 56.6,193.6 L 62,165 L 75.3,141.6 Z", labelCoords: { x: 78, y: 180 } },
  { name: 'Tafilah', path: "M 62,165 L 56.6,193.6 L 75.3,222 L 73,248.8 L 52,243 L 49.6,198.2 L 62,165 Z", labelCoords: { x: 62, y: 210 } },
  { name: 'Maan', path: "M 93.9,211.5 L 181.5,159.2 L 219.1,105.7 L 225.4,66.4 L 235,120 L 235,320 L 103,420 L 93.9,211.5 Z", labelCoords: { x: 160, y: 280 } },
  { name: 'Aqaba', path: "M 52,243 L 73,248.8 L 103,420 L 70,500 L 20,450 L 52,243 Z", labelCoords: { x: 65, y: 350 } },
];


const JordanMapChart: React.FC<JordanMapChartProps> = ({ data, indicators, title }) => {
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator>(indicators[0]);
  const [hoveredGovernorate, setHoveredGovernorate] = useState<{ name: string; value: string; } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const dataMap = new Map(data.map(item => [item.name, item]));
  
  const values = data.map(g => g[selectedIndicator.key] as number).filter(v => typeof v === 'number');
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  
  const getColor = (value: number | undefined) => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '#a0aec0'; // Default gray for missing data
    }
    const percentage = (maxVal - minVal) > 0 ? (value - minVal) / (maxVal - minVal) : 0;
    
    // Green (good) to Red (bad) scale
    const hue = selectedIndicator.direction === 'lower-is-better' ? (1 - percentage) * 120 : percentage * 120;
    return `hsl(${hue}, 85%, 50%)`;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${mousePosition.x + 15}px`,
    top: `${mousePosition.y + 15}px`,
    opacity: hoveredGovernorate ? 1 : 0,
  };


  return (
    <Card className="relative overflow-hidden">
      <div 
        ref={tooltipRef} 
        className="map-tooltip" 
        style={tooltipStyle}
      >
        {hoveredGovernorate && (
          <>
            <div className="font-bold">{hoveredGovernorate.name}</div>
            <div>{selectedIndicator.name}: {hoveredGovernorate.value}</div>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 sm:mb-0">{title}</h3>
        <select
          value={selectedIndicator.key}
          onChange={(e) => setSelectedIndicator(indicators.find(i => i.key === e.target.value)!)}
          className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm w-full sm:w-auto"
        >
          {indicators.map(ind => <option key={ind.key} value={ind.key}>{ind.name}</option>)}
        </select>
      </div>

      <div className="w-full aspect-[2/3] max-h-[600px] mx-auto">
        <svg viewBox="0 0 250 520" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {jordanGovernorateShapes.map((shape) => {
            const govData = dataMap.get(shape.name);
            const value = govData?.[selectedIndicator.key] as number | undefined;
            const color = getColor(value);
            const isHovered = hoveredGovernorate?.name === govData?.name_ar;

            return (
              <g
                key={shape.name}
                onMouseEnter={() => {
                    if(govData && typeof value === 'number') {
                        setHoveredGovernorate({ 
                            name: govData.name_ar, 
                            value: `${value.toFixed(1)}${selectedIndicator.unit}`,
                        });
                    }
                }}
                onMouseLeave={() => setHoveredGovernorate(null)}
                className="cursor-pointer"
                style={{ transition: 'opacity 0.2s ease-in-out', opacity: hoveredGovernorate && !isHovered ? 0.4 : 1 }}
              >
                <path
                  d={shape.path}
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeLinejoin='round'
                />
                <text
                    x={shape.labelCoords.x}
                    y={shape.labelCoords.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="10"
                    fill="white"
                    className="pointer-events-none font-bold"
                    stroke="#000"
                    strokeWidth="0.4px"
                    paintOrder="stroke"
                >
                    {govData?.name_ar}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex items-center justify-center mt-4 space-x-4 rtl:space-x-reverse">
        <span className="text-sm text-gray-500 dark:text-gray-400">{selectedIndicator.direction === 'lower-is-better' ? 'الأفضل' : 'الأسوأ'}</span>
        <div className="w-48 h-4 rounded-full" style={{ background: `linear-gradient(to right, hsl(120, 85%, 50%), hsl(60, 85%, 50%), hsl(0, 85%, 50%))`}}></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{selectedIndicator.direction === 'lower-is-better' ? 'الأسوأ' : 'الأفضل'}</span>
      </div>
    </Card>
  );
};

export default JordanMapChart;