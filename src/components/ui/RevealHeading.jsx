import React from 'react';

export default function RevealHeading({
  children,
  as: Component = 'h2',
  className = '',
  highlight = '',
  highlightColor = 'text-brand-red',
}) {
  return (
    <Component
      className={`font-display font-bold tracking-tight text-white ${className}`}
    >
      {children}
      {highlight && (
        <span className={`block mt-1 ${highlightColor} text-glow-red`}>
          {highlight}
        </span>
      )}
    </Component>
  );
}
