import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  icon: Icon,
  className = '',
  pulse = false,
}) {
  const variants = {
    default: "bg-carbon-850/90 text-carbon-200 border-white/10",
    red: "bg-brand-red/15 text-brand-red border-brand-red/40 shadow-[0_0_15px_rgba(225,6,0,0.25)]",
    white: "bg-white/10 text-white border-white/20",
    glass: "glass-panel text-white border-white/15",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase border backdrop-blur-md transition-all duration-300 ${variants[variant] || variants.default} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red" />
        </span>
      )}
      {Icon && <Icon className="w-3.5 h-3.5 text-brand-red" />}
      <span>{children}</span>
    </span>
  );
}
