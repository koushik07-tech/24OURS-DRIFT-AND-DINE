import React, { useState } from 'react';
import placeholderLogo from '../../assets/logo/logo-placeholder.svg';

export default function BrandLogo({
  className = '',
  size = 'md',
  showTagline = true,
  href = '#hero',
}) {
  const [imgError, setImgError] = useState(false);

  // Logo sizes
  const sizes = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-16 sm:h-20',
  };

  const logoContent = (
    <div className={`inline-flex items-center group cursor-pointer ${className}`}>
      {!imgError ? (
        <img
          src="/src/assets/logo/24ours-logo.png"
          alt="24OURS — Drift and Dine"
          className={`${sizes[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
          onError={() => setImgError(true)}
        />
      ) : (
        <img
          src={placeholderLogo}
          alt="24OURS — Drift and Dine"
          className={`${sizes[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
        />
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red rounded-lg"
        aria-label="24OURS — Drift and Dine Home"
      >
        {logoContent}
      </a>
    );
  }

  return logoContent;
}
