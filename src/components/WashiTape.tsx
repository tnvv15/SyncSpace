import React from 'react';

interface WashiTapeProps {
  color?: string;
  className?: string;
  variant?: 'tape' | 'staple' | 'paperclip' | 'pin';
  angle?: number;
}

export const WashiTape: React.FC<WashiTapeProps> = ({
  color = 'rgba(234, 179, 8, 0.45)',
  className = '',
  variant = 'tape',
  angle = 0,
}) => {
  if (variant === 'staple') {
    return (
      <div 
        className={`absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-[#475569] shadow-[0_1px_2px_rgba(0,0,0,0.3)] rounded-sm z-20 ${className}`}
        style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>
    );
  }

  if (variant === 'paperclip') {
    return (
      <div 
        className={`absolute -top-3 left-6 z-20 pointer-events-none ${className}`}
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M7 12V6C7 3.23858 9.23858 1 12 1C14.7614 1 17 3.23858 17 6V26C17 30.4183 13.4183 34 9 34C4.58172 34 1 30.4183 1 26V9C1 6.79086 2.79086 5 5 5C7.20914 5 9 6.79086 9 9V24C9 25.6569 10.3431 27 12 27C13.6569 27 15 25.6569 15 24V11" 
            stroke="#94A3B8" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            className="drop-shadow-sm"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'pin') {
    return (
      <div 
        className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 z-20 pointer-events-none drop-shadow-md ${className}`}
        style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
      >
        <div className="w-4 h-4 rounded-full bg-riso-coral border-2 border-white/60 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
        </div>
      </div>
    );
  }

  // Default Washi Tape Strip
  return (
    <div
      className={`absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-28 rounded-xs backdrop-blur-[0.5px] z-20 pointer-events-none select-none ${className}`}
      style={{
        backgroundColor: color,
        transform: `translateX(-50%) rotate(${angle}deg)`,
        clipPath: 'polygon(0% 0%, 5% 40%, 0% 100%, 95% 100%, 100% 60%, 95% 0%)',
        boxShadow: '0 2px 4px rgba(44, 34, 25, 0.15), inset 0 1px 0 rgba(255,255,255,0.4)',
      }}
    >
      {/* Subtle paper grain texture inside tape */}
      <div className="w-full h-full opacity-30 bg-repeat bg-[radial-gradient(#000_0.75px,transparent_0.75px)] [background-size:4px_4px]" />
    </div>
  );
};
