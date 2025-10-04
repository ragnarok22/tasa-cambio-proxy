import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tasa de Cambio Cuba - USD, EUR, MLC a CUP',
    short_name: 'Tasa Cuba',
    description:
      'Consulta las tasas de cambio del mercado informal cubano actualizadas cada hora',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    categories: ['finance', 'business'],
    lang: 'es',
    orientation: 'portrait',
  };
}
