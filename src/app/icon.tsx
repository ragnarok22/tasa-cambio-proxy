import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #a5f3fc 0%, #86efac 100%)',
        borderRadius: '6px',
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 6C8 6 6 8.5 6 12C6 15.5 8 18 8 18"
          stroke="#0e7490"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 6C16 6 18 8.5 18 12C18 15.5 16 18 16 18"
          stroke="#0e7490"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M10 8V16M10 8H8M10 16H12"
          stroke="#0e7490"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14 8V16M14 8H16M14 16H12"
          stroke="#0e7490"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="1.5" fill="#0e7490" />
      </svg>
    </div>,
    {
      ...size,
    }
  );
}
