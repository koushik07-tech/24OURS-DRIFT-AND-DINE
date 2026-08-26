import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Button({
  children,
  variant = 'primary', // 'primary' (Racing Red), 'secondary', 'outline', 'ghost', 'glass'
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'right',
  href,
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) {
  const baseStyles = "relative inline-flex items-center justify-center font-heading font-semibold uppercase tracking-wider transition-all duration-300 rounded-lg overflow-hidden group select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black";

  const variants = {
    primary: "bg-brand-red text-white hover:bg-brand-red-hover shadow-glow-red hover:shadow-glow-red-lg border border-red-500/40",
    secondary: "bg-carbon-850 text-white hover:bg-carbon-800 border border-white/10 hover:border-brand-red/50 text-carbon-100 hover:text-white shadow-card-elevated",
    outline: "bg-transparent text-white border border-brand-red/60 hover:bg-brand-red/10 hover:border-brand-red text-brand-red hover:text-white",
    ghost: "bg-transparent text-carbon-400 hover:text-white hover:bg-white/5",
    glass: "glass-panel text-white hover:border-brand-red/50 hover:bg-carbon-850/80 shadow-card-elevated",
  };

  const sizes = {
    sm: "text-xs px-3.5 py-1.5 gap-1.5",
    md: "text-xs md:text-sm px-5 py-2.5 gap-2",
    lg: "text-sm md:text-base px-7 py-3.5 gap-2.5",
    xl: "text-base md:text-lg px-8 py-4 gap-3",
  };

  const content = (
    <>
      {/* Light sheen hover animation effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

      {Icon && iconPosition === 'left' && (
        <Icon className={cn(
          "transition-transform duration-300 group-hover:-translate-x-0.5",
          size === 'sm' ? "w-3.5 h-3.5" : size === 'lg' || size === 'xl' ? "w-5 h-5" : "w-4 h-4"
        )} />
      )}

      <span className="relative z-10">{children}</span>

      {Icon && iconPosition === 'right' && (
        <Icon className={cn(
          "transition-transform duration-300 group-hover:translate-x-1",
          size === 'sm' ? "w-3.5 h-3.5" : size === 'lg' || size === 'xl' ? "w-5 h-5" : "w-4 h-4"
        )} />
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {content}
    </button>
  );
}
