import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Tasa de Cambio Cuba - USD, EUR, MLC al Peso Cubano (CUP)',
    template: '%s | Tasa de Cambio Cuba',
  },
  description:
    'Consulta las tasas de cambio actualizadas del mercado informal cubano (TRMI). Convierte USD, EUR y MLC a Peso Cubano (CUP) con datos de El Toque. Información referencial actualizada cada hora.',
  keywords: [
    'tasa de cambio cuba',
    'precio dolar cuba',
    'euro cuba',
    'mlc cuba',
    'peso cubano',
    'cup',
    'trmi',
    'el toque',
    'cambio moneda cuba',
    'divisas cuba',
    'mercado informal cuba',
    'tasa cambio informal',
    'usd cup',
    'eur cup',
    'mlc cup',
  ],
  authors: [{ name: 'Reinier Hernández' }],
  creator: 'Reinier Hernández',
  publisher: 'Reinier Hernández',
  metadataBase: new URL('https://tasa-cambio-cuba.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://tasa-cambio-cuba.vercel.app',
    title: 'Tasa de Cambio Cuba - USD, EUR, MLC al Peso Cubano',
    description:
      'Consulta las tasas de cambio actualizadas del mercado informal cubano (TRMI). Datos de El Toque actualizados cada hora.',
    siteName: 'Tasa de Cambio Cuba',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Tasa de Cambio Cuba - Conversión USD, EUR, MLC a CUP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tasa de Cambio Cuba - USD, EUR, MLC al Peso Cubano',
    description:
      'Consulta las tasas de cambio actualizadas del mercado informal cubano (TRMI).',
    images: ['/opengraph-image'],
    creator: '@ragnarokreinier',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token_here', // Add your Google Search Console verification token
  },
  category: 'finance',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [{ rel: 'icon', url: '/favicon.ico' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
