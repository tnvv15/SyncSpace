import React, { useState } from 'react';
import { UserPresence } from '../types/canvas';
import { USER_COLORS } from '../utils/constants';
import { UserCheck, Sparkles } from 'lucide-react';

interface PresenceAvatarsProps {
  currentUser: { name: string; color: string };
  onUpdateCurrentUser: (user: { name: string; color: string }) => void;
  remoteUsers: UserPresence[];
}

export const PresenceAvatars: React.FC<PresenceAvatarsProps> = ({
  currentUser,
  onUpdateCurrentUser,
  remoteUsers,
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(currentUser.name);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateCurrentUser({
        ...currentUser,
        name: tempName.trim(),
      });
    }
    setIsEditingProfile(false);
  };

  return (
    <div className="relative flex items-center gap-1.5 select-none">
      {/* Remote Peer Avatars */}
      {remoteUsers.map((user) => (
        <div
          key={user.clientId}
          className="relative group"
          title={`${user.name} (${user.tool || 'viewing'})`}
        >
          <div
            className="w-8 h-8 rounded-full border-2 border-stone-900 flex items-center justify-center font-mono font-bold text-xs text-white shadow-paper-sm transition-transform group-hover:scale-110"
            style={{ backgroundColor: user.color }}
          >
            {getInitials(user.name)}
          </div>
          {/* Tooltip */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-stone-900 text-white text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap z-50">
            {user.name}
          </div>
        </div>
      ))}

      {/* Local User Avatar & Profile Toggle */}
      <button
        onClick={() => {
          setTempName(currentUser.name);
          setIsEditingProfile(!isEditingProfile);
        }}
        className="relative group flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full border-2 border-stone-800 bg-[#FFFDF8] hover:bg-parchment-100 shadow-paper-sm transition-all"
        title="Customize your Artisan Name & Ink Color"
      >
        <div
          className="w-6 h-6 rounded-full border border-stone-800 flex items-center justify-center font-mono font-bold text-[10px] text-white"
          style={{ backgroundColor: currentUser.color }}
        >
          {getInitials(currentUser.name)}
        </div>
        <span className="text-xs font-mono font-bold text-stone-800 hidden sm:inline max-w-[120px] truncate">
          {currentUser.name} (You)
        </span>
      </button>

      {/* Profile Modal Popover */}
      {isEditingProfile && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsEditingProfile(false)}
          />
          <div className="absolute right-0 top-12 w-72 bg-[#FFFDF8] border-stamp rounded p-4 shadow-paper-lg z-50 animate-fade-in font-sans">
            <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-riso-indigo border-b border-stone-200 pb-1.5 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-riso-coral" />
              Your Artisan Profile
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-stone-600 mb-1">
                  Artisan Name:
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  placeholder="e.g. Master Linocutter"
                  className="w-full px-2.5 py-1.5 bg-parchment-100 border border-stone-400 rounded text-xs font-mono font-bold text-stone-900 outline-none focus:border-riso-indigo"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-stone-600 mb-1.5">
                  Fountain Pen Ink Color:
                </label>
                <div className="flex flex-wrap gap-2">
                  {USER_COLORS.map((hex) => (
                    <button
                      key={hex}
                      onClick={() =>
                        onUpdateCurrentUser({
                          ...currentUser,
                          color: hex,
                        })
                      }
                      className={`w-6 h-6 rounded-full border-2 border-stone-800 transition-transform ${
                        currentUser.color === hex
                          ? 'scale-125 ring-2 ring-stone-900 ring-offset-1'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1 text-xs font-mono rounded hover:bg-stone-200 text-stone-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveName}
                  className="px-3 py-1 text-xs font-mono font-bold rounded bg-riso-indigo text-white hover:bg-slate-800 shadow-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
