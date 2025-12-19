'use client';

import { useEffect } from 'react';
import ProvinceSVGMap from './ProvinceSVGMap';
import { generateProvinceRates } from '@/data/provinceRates';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  nationalUsdRate: number;
}

export default function CubaMapOverlay({
  isOpen,
  onClose,
  nationalUsdRate,
}: Props) {
  const provinceData = generateProvinceRates(nationalUsdRate);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[85vh] overflow-auto relative p-6 md:p-8 transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors text-3xl font-bold p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-300"
          aria-label="Cerrar"
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Tasas de Cambio por Provincia
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Tasa nacional:{' '}
            <span className="font-semibold text-green-600">
              {nationalUsdRate} CUP/USD
            </span>
          </p>
          <p className="text-gray-500 text-xs md:text-sm italic mt-1">
            Valores referenciales - Las tasas provinciales son estimaciones
          </p>
        </div>

        {/* SVG Map */}
        <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
          <ProvinceSVGMap provinces={provinceData.provinces} />
        </div>

        {/* Legend */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
            Leyenda de colores
          </h3>
          <div className="flex flex-wrap gap-4 justify-center text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-gray-700">
                Menor que nacional ({'<'} -10%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="text-gray-700">
                Similar a nacional (-10% a +10%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-500 rounded" />
              <span className="text-gray-700">
                Mayor que nacional ({'>'} +10%)
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            💡 Pasa el cursor sobre cada provincia para ver su tasa de cambio
          </p>
        </div>
      </div>
    </div>
  );
}
