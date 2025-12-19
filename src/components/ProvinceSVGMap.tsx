'use client';

import { useState } from 'react';
import type { ProvinceRate } from '@/types/province';

interface Props {
  provinces: ProvinceRate[];
}

// Realistic SVG paths representing Cuba's actual shape
// Cuba has a distinctive elongated crocodile-like shape
// Coordinates based on real geography, simplified for web use
const PROVINCE_PATHS: Record<string, string> = {
  // Western provinces (head of the crocodile)
  'pinar-del-rio':
    'M 10,100 L 15,85 L 25,75 L 40,72 L 60,70 L 80,72 L 95,78 L 105,88 L 110,100 L 112,115 L 110,130 L 105,142 L 95,150 L 80,155 L 60,157 L 40,155 L 25,148 L 15,135 L 12,120 Z',

  artemisa:
    'M 95,78 L 115,75 L 135,74 L 152,76 L 165,82 L 172,92 L 175,105 L 175,120 L 172,133 L 165,142 L 152,147 L 135,148 L 115,146 L 105,142 L 105,88 Z',

  'la-habana':
    'M 152,76 L 170,74 L 185,75 L 195,80 L 200,88 Q 203,92 205,100 L 205,115 L 203,128 L 198,138 L 190,144 L 180,147 L 165,147 L 165,82 Z',

  mayabeque:
    'M 185,75 L 205,74 L 222,76 L 235,82 L 242,92 L 245,105 L 245,120 L 242,133 L 235,143 L 222,148 L 205,150 L 190,148 L 180,147 L 180,80 Z',

  // Central-western provinces
  matanzas:
    'M 222,76 L 245,75 L 270,75 L 295,77 L 315,83 L 328,92 L 335,105 L 337,118 L 335,132 L 328,143 L 315,150 L 295,154 L 270,155 L 245,154 L 235,150 L 235,82 Z',

  cienfuegos:
    'M 295,77 L 320,76 L 345,77 L 365,82 L 378,91 L 385,103 L 387,117 L 385,130 L 378,141 L 365,148 L 345,152 L 320,153 L 315,152 L 315,83 Z',

  'villa-clara':
    'M 345,77 L 372,76 L 400,77 L 422,82 L 435,91 L 442,103 L 444,117 L 442,130 L 435,141 L 422,148 L 400,152 L 372,153 L 365,152 L 365,82 Z',

  'sancti-spiritus':
    'M 400,77 L 430,76 L 460,77 L 482,82 L 495,91 L 502,103 L 504,117 L 502,130 L 495,141 L 482,148 L 460,152 L 430,153 L 422,152 L 422,82 Z',

  // Central provinces (narrowest part - waist of Cuba)
  'ciego-de-avila':
    'M 460,77 L 492,76 L 524,77 L 544,82 L 555,90 L 560,102 L 561,116 L 560,129 L 555,140 L 544,147 L 524,151 L 492,152 L 482,151 L 482,82 Z',

  camaguey:
    'M 524,77 L 560,76 L 600,77 L 635,80 L 660,86 L 678,94 L 688,105 L 692,118 L 690,132 L 682,143 L 665,150 L 642,154 L 615,155 L 585,154 L 560,152 L 555,151 L 555,82 Z',

  // Eastern provinces (getting wider again)
  'las-tunas':
    'M 600,77 L 642,76 L 680,78 L 708,83 L 728,91 L 740,102 L 745,115 L 745,128 L 740,140 L 728,149 L 708,155 L 680,158 L 660,158 L 642,157 L 635,156 L 635,80 Z',

  holguin:
    'M 680,78 L 720,77 L 760,79 L 795,84 L 820,92 L 838,103 L 848,116 L 852,130 L 850,143 L 842,154 L 825,162 L 802,167 L 775,169 L 745,168 L 728,165 L 715,160 L 708,155 L 708,83 Z',

  granma:
    'M 745,128 L 750,145 L 755,162 L 762,178 L 772,192 L 785,202 L 802,210 L 822,215 L 842,217 L 860,216 L 875,212 L 885,205 L 892,195 L 895,183 L 895,168 L 890,155 L 880,145 L 865,138 L 850,135 L 840,134 L 828,135 L 820,138 L 810,143 L 802,150 L 795,157 L 788,164 L 780,169 L 770,171 L 758,170 L 750,165 L 745,155 Z',

  'santiago-de-cuba':
    'M 842,154 L 860,152 L 885,152 L 912,155 L 935,161 L 953,170 L 965,182 L 972,196 L 975,210 L 973,223 L 966,234 L 954,242 L 937,247 L 917,249 L 895,248 L 875,244 L 860,237 L 850,228 L 845,218 L 842,207 L 842,195 L 845,183 L 850,172 L 857,163 Z',

  guantanamo:
    'M 912,155 L 940,154 L 970,156 L 995,161 L 1015,169 L 1030,180 L 1040,194 L 1045,210 L 1046,225 L 1043,238 L 1036,248 L 1024,255 L 1008,259 L 988,260 L 965,258 L 945,253 L 930,246 L 920,237 L 915,226 L 913,214 L 914,201 L 918,188 L 925,176 L 933,167 L 942,161 Z',

  // Special municipality (Isla de la Juventud - southwest island)
  'isla-de-la-juventud':
    'M 55,185 L 70,182 L 88,181 L 105,183 L 118,188 L 127,196 L 132,206 L 133,218 L 131,230 L 125,240 L 115,247 L 102,251 L 87,252 L 72,250 L 58,245 L 48,237 L 42,226 L 40,214 L 41,202 L 46,192 Z',
};

export default function ProvinceSVGMap({ provinces }: Props) {
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceRate | null>(
    null
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseMove = (event: React.MouseEvent<SVGPathElement>) => {
    if (hoveredProvince) {
      const rect = event.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredProvince(null);
  };

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 1060 280"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <rect width="1060" height="280" fill="#E0F2FE" opacity="0.3" />

        {/* Province paths */}
        {provinces.map((province) => (
          <path
            key={province.id}
            d={PROVINCE_PATHS[province.id]}
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
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y - 10}px`,
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
