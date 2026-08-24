import React from 'react';
import { UserPresence } from '../types/canvas';

interface RemoteCursorProps {
  user: UserPresence;
  zoom: number;
}

export const RemoteCursor: React.FC<RemoteCursorProps> = ({ user }) => {
  if (!user.cursor) return null;

  return (
    <div
      className="absolute top-0 left-0 pointer-events-none z-[1000] transition-all duration-75 ease-out"
      style={{
        transform: `translate(${user.cursor.x}px, ${user.cursor.y}px)`,
      }}
    >
      {/* Vintage Fountain Pen Nib SVG */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-md -translate-x-1 -translate-y-1"
      >
        {/* Pen Nib Body */}
        <path
          d="M3 3 L15 15 L12 21 L10 20 L7 23 L3 19 L6 16 L5 14 Z"
          fill={user.color || '#E05A47'}
          stroke="#1E293B"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Nib Split / Ink Hole */}
        <circle cx="9" cy="9" r="1.5" fill="#FFFDF8" stroke="#1E293B" strokeWidth="0.8" />
        <line x1="3" y1="3" x2="8" y2="8" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

      {/* Hand-Stamped Peer Label */}
      <div
        className="absolute top-5 left-4 flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-stone-800 shadow-paper-sm whitespace-nowrap text-[11px] font-mono font-bold animate-fade-in"
        style={{
          backgroundColor: '#FFFDF8',
          color: user.color || '#1E293B',
          borderColor: '#1E293B',
        }}
      >
        <span
          className="w-2 h-2 rounded-full border border-black/30 animate-pulse-subtle"
          style={{ backgroundColor: user.color }}
        />
        <span>{user.name}</span>
        {user.tool && user.tool !== 'select' && (
          <span className="text-[9px] opacity-70 border-l border-stone-300 pl-1">
            [{user.tool}]
          </span>
        )}
      </div>
    </div>
  );
};
