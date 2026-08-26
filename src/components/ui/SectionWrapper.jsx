import React from 'react';

export default function SectionWrapper({
  id,
  children,
  className = '',
  containerClassName = '',
  badge,
  title,
  subtitle,
  description,
  align = 'center', // 'left', 'center', 'right'
  hasGrid = false,
  glowColor = 'red', // 'red', 'white', 'none'
}) {
  const alignments = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  const glowColors = {
    red: 'bg-brand-red/10',
    white: 'bg-white/5',
    none: 'hidden',
  };

  return (
    <section
      id={id}
      className={`relative py-24 md:py-32 lg:py-40 overflow-hidden bg-brand-black ${hasGrid ? 'subtle-grid' : ''} ${className}`}
    >
      {/* Background atmospheric ambient lighting */}
      {glowColor !== 'none' && (
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] ${glowColors[glowColor]} rounded-full blur-[160px] pointer-events-none -z-10`}
        />
      )}

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${containerClassName}`}>
        {(badge || title || subtitle || description) && (
          <div className={`flex flex-col mb-16 md:mb-20 max-w-3xl ${alignments[align]}`}>
            {badge && (
              <div className="mb-4">
                {badge}
              </div>
            )}

            {subtitle && (
              <p className="text-xs md:text-sm font-mono tracking-[0.25em] text-brand-red uppercase font-semibold mb-2">
                {subtitle}
              </p>
            )}

            {title && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white leading-[1.1]">
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-4 text-base sm:text-lg text-carbon-400 font-sans leading-relaxed max-w-2xl">
                {description}
              </p>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
