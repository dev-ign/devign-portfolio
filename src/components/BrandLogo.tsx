import React from 'react';

type BrandLogoProps = {
  markSize?: number;
  textSize?: number;
  gap?: number;
  className?: string;
};

const BrandLogo: React.FC<BrandLogoProps> = ({
  markSize = 28,
  textSize = 16,
  gap = 8,
  className,
}) => {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        lineHeight: 0,
        whiteSpace: 'nowrap',
      }}
    >
      <img
        src="/devign-logo.png"
        alt=""
        width={Math.round(markSize * 2.03)}
        height={markSize}
        style={{
          display: 'block',
          flex: '0 0 auto',
          height: markSize,
          objectFit: 'contain',
          width: 'auto',
        }}
      />
      <span
        aria-label="devignUX"
        style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontFamily: 'var(--font-disp)',
          fontSize: textSize,
          fontWeight: 800,
          letterSpacing: '1.5px',
          lineHeight: 1,
        }}
      >
        devignUX
      </span>
    </span>
  );
};

export default BrandLogo;
