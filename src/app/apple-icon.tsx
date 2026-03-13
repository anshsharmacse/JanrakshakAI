import { ImageResponse } from 'next/og';
 
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';
 
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 50%, #0ea5e9 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '40px',
        }}
      >
        💧
      </div>
    ),
    {
      ...size,
    }
  );
}
