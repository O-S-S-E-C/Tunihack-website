import React from 'react';

export const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-12">
    <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-[-0.07em] uppercase">
      {title}
    </h2>
    {subtitle && (
      <p className="text-muted max-w-2xl text-base leading-relaxed">
        {subtitle}
      </p>
    )}
    <div className="cyan-rule max-w-xs mt-6" />
  </div>
);

export const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-white/[0.03] border border-white/15 p-6 text-left hover:border-secondary/60 transition-colors group">
    <span className="block text-4xl md:text-5xl font-extrabold text-foreground mb-2 group-hover:text-primary transition-colors">
      {value}
    </span>
    <span className="text-sm text-muted uppercase tracking-wider font-medium">
      {label}
    </span>
  </div>
);

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30',
    secondary: 'bg-transparent hover:bg-white/10 text-foreground border border-white/20',
  };

  return (
    <button
      className={`px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
