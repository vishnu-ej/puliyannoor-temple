import React from 'react';

interface MuralDividerProps {
  className?: string;
  variant?: 'gold-crimson' | 'dark' | 'simple';
}

export const MuralDivider: React.FC<MuralDividerProps> = ({
  className = '',
  variant = 'gold-crimson',
}) => {
  if (variant === 'simple') {
    return (
      <div className={`w-full flex items-center justify-center gap-3 py-4 ${className}`}>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C99738]" />
        <div className="w-2.5 h-2.5 rotate-45 border border-[#C99738] bg-[#FAF5E8]" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#610C1B]" />
        <div className="w-2.5 h-2.5 rotate-45 border border-[#C99738] bg-[#FAF5E8]" />
        <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C99738]" />
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden leading-none ${className}`}>
      <svg
        viewBox="0 0 1200 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-3.5 md:h-4.5 block"
        preserveAspectRatio="none"
      >
        <rect
          width="1200"
          height="18"
          fill={variant === 'dark' ? '#1A0409' : '#610C1B'}
        />
        {/* Top Gold Beading Line */}
        <line x1="0" y1="1.5" x2="1200" y2="1.5" stroke="#E6BE65" strokeWidth="1" strokeOpacity="0.8" />
        
        {/* Repeating Kerala Temple Motif */}
        {Array.from({ length: 60 }).map((_, i) => {
          const cx = i * 20 + 10;
          return (
            <g key={i}>
              <circle cx={cx} cy="9" r="3" fill="#C99738" />
              <circle cx={cx} cy="9" r="1.5" fill="#FAF5E8" />
              <path
                d={`M${cx - 6} 9 Q${cx} 3 ${cx + 6} 9 Q${cx} 15 ${cx - 6} 9Z`}
                stroke="#E6BE65"
                strokeWidth="0.8"
                fill="none"
                opacity="0.4"
              />
            </g>
          );
        })}

        {/* Bottom Gold Beading Line */}
        <line x1="0" y1="16.5" x2="1200" y2="16.5" stroke="#E6BE65" strokeWidth="1" strokeOpacity="0.8" />
      </svg>
    </div>
  );
};
