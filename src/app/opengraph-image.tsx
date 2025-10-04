import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Tasa de Cambio Cuba - USD, EUR, MLC a CUP';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0,
            }}
          >
            🇨🇺 Tasa de Cambio Cuba
          </h1>
          <p
            style={{
              fontSize: '36px',
              color: '#4b5563',
              margin: 0,
            }}
          >
            USD • EUR • MLC → CUP
          </p>
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: '48px',
            }}
          >
            <div
              style={{
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🇺🇸</div>
              <div
                style={{ fontSize: '24px', color: '#6b7280', marginBottom: 8 }}
              >
                USD
              </div>
              <div style={{ fontSize: '48px', fontWeight: 'bold' }}>TRMI</div>
            </div>
            <div
              style={{
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🇪🇺</div>
              <div
                style={{ fontSize: '24px', color: '#6b7280', marginBottom: 8 }}
              >
                EUR
              </div>
              <div style={{ fontSize: '48px', fontWeight: 'bold' }}>TRMI</div>
            </div>
            <div
              style={{
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🇨🇺</div>
              <div
                style={{ fontSize: '24px', color: '#6b7280', marginBottom: 8 }}
              >
                MLC
              </div>
              <div style={{ fontSize: '48px', fontWeight: 'bold' }}>TRMI</div>
            </div>
          </div>
          <p
            style={{
              fontSize: '20px',
              color: '#9ca3af',
              marginTop: '48px',
            }}
          >
            Datos de El Toque • Actualizados cada hora
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
