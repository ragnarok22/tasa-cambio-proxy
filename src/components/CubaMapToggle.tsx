'use client';

import { useState } from 'react';
import CubaMapOverlay from './CubaMapOverlay';

interface Props {
  nationalUsdRate: number;
}

export default function CubaMapToggle({ nationalUsdRate }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Ver tasas por provincia"
      >
        <span className="text-2xl">🗺️</span>
        <span className="font-semibold text-sm md:text-base hidden sm:inline">
          Tasas por Provincia
        </span>
      </button>

      {/* Overlay */}
      <CubaMapOverlay
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        nationalUsdRate={nationalUsdRate}
      />
    </>
  );
}
