'use client';

import { useState, useRef } from 'react';
import type { ProvinceRate } from '@/types/province';
import { CUBA_PROVINCE_PATHS } from '@/data/cubaPaths';

interface Props {
  provinces: ProvinceRate[];
}

// Real Cuba map paths from cuba.svg (professional map from SimpleMaps)

export default function ProvinceSVGMap({ provinces }: Props) {
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceRate | null>(
    null
  );
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const getProvinceColor = (variance: number): string => {
    if (variance < -10) return '#10B981'; // Green (Tailwind green-500)
    if (variance > 10) return '#6366F1'; // Indigo (Tailwind indigo-500)
    return '#3B82F6'; // Blue (Tailwind blue-500)
  };

  const handleMouseEnter = (
    province: ProvinceRate,
    event: React.MouseEvent<SVGPathElement>
  ) => {
    setHoveredProvince(province);
    updateTooltipPosition(event);
  };

  const updateTooltipPosition = (event: React.MouseEvent<SVGPathElement>) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const tooltipWidth = 200; // Approximate tooltip width
    const tooltipHeight = 80; // Approximate tooltip height
    const offset = 20; // Distance above cursor

    const mouseX = event.clientX - containerRect.left;
    const mouseY = event.clientY - containerRect.top;

    let left = mouseX;
    let top = mouseY - offset;

    // Horizontal boundary check
    // Center tooltip on cursor, but prevent overflow
    const halfWidth = tooltipWidth / 2;
    if (left - halfWidth < 0) {
      left = halfWidth; // Align to left edge
    } else if (left + halfWidth > containerRect.width) {
      left = containerRect.width - halfWidth; // Align to right edge
    }

    // Vertical boundary check
    // Keep tooltip above cursor, but prevent overflow at top
    if (top - tooltipHeight < 0) {
      top = tooltipHeight; // Minimum distance from top
    }

    setTooltipPosition({ left, top });
  };

  const handleMouseMove = (event: React.MouseEvent<SVGPathElement>) => {
    if (hoveredProvince) {
      updateTooltipPosition(event);
    }
  };

  const handleMouseLeave = () => {
    setHoveredProvince(null);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        viewBox="0 0 774.25848 264.93973"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect
          width="774.25848"
          height="264.93973"
          fill="#E0F2FE"
          opacity="0.3"
        />

        {/* Province paths */}
        {provinces.map((province) => (
          <path
            key={province.id}
            d={CUBA_PROVINCE_PATHS[province.id]}
            fill={getProvinceColor(province.variance)}
            stroke="#ffffff"
            strokeWidth="3"
            className="transition-all duration-200 hover:opacity-80 cursor-pointer"
            onMouseEnter={(e) => handleMouseEnter(province, e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            aria-label={`${province.name}: ${province.usdRate} CUP`}
          />
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredProvince && (
        <div
          className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none z-10 -translate-x-1/2 -translate-y-full"
          style={{
            left: `${tooltipPosition.left}px`,
            top: `${tooltipPosition.top}px`,
          }}
        >
          <p className="font-bold text-sm whitespace-nowrap">
            {hoveredProvince.name}
          </p>
          <p className="text-base font-semibold">
            {hoveredProvince.usdRate} CUP
          </p>
          <p className="text-xs text-gray-300">
            {hoveredProvince.variance > 0 ? '+' : ''}
            {hoveredProvince.variance.toFixed(1)}% vs nacional
          </p>
        </div>
      )}
    </div>
  );
}
