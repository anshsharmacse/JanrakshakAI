import { ImageResponse } from 'next/og';
 
export const alt = 'JalRakshak AI - Water Crisis Intelligence Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
 
export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #0284c7 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 120,
              marginRight: 30,
            }}
          >
            💧
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #5eead4, #22d3ee)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              JalRakshak AI
            </div>
            <div
              style={{
                fontSize: 28,
                opacity: 0.9,
                marginTop: 10,
              }}
            >
              Water Crisis Intelligence Platform
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 24,
              opacity: 0.9,
            }}
          >
            🧠 AI-Powered
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 24,
              opacity: 0.9,
            }}
          >
            📊 Research-Backed
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 24,
              opacity: 0.9,
            }}
          >
            🇮🇳 Made for India
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 80,
            fontSize: 20,
            opacity: 0.7,
          }}
        >
          Created by Ansh Sharma
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
