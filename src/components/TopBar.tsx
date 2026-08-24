import React from 'react';
import { 
  Sparkles, 
  FolderSync, 
  Plus, 
  Trash2, 
  StickyNote, 
  BookOpen, 
  HelpCircle,
  Share2,
  Download
} from 'lucide-react';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';
import { PresenceAvatars } from './PresenceAvatars';
import { ConnectionStatus, UserPresence, PaperColor } from '../types/canvas';

interface TopBarProps {
  roomId: string;
  onOpenRoomModal: () => void;
  onOpenHelpModal: () => void;
  connectionStatus: ConnectionStatus;
  isIndexedDbSynced: boolean;
  remoteUsers: UserPresence[];
  currentUser: { name: string; color: string };
  onUpdateCurrentUser: (user: { name: string; color: string }) => void;
  onAddStickyNote: (color?: PaperColor) => void;
  onAddTextBlock: () => void;
  onClearCanvas: () => void;
  onExportJSON: () => void;
  clientId?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  roomId,
  onOpenRoomModal,
  onOpenHelpModal,
  connectionStatus,
  isIndexedDbSynced,
  remoteUsers,
  currentUser,
  onUpdateCurrentUser,
  onAddStickyNote,
  onAddTextBlock,
  onClearCanvas,
  onExportJSON,
  clientId,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 px-4 md:px-6 flex items-center justify-between pointer-events-none select-none">
      {/* Left: Studio Branding & Room Switcher */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-2.5 bg-[#FFFDF8] border-2 border-stone-800 px-3.5 py-1.5 rounded-lg shadow-paper-sm hover:shadow-paper-md transition-all">
          <div className="w-6 h-6 rounded bg-riso-coral flex items-center justify-center text-white shadow-xs font-mono font-bold text-xs">
            ✒️
          </div>
          <div>
            <h1 className="font-serif font-black text-sm text-stone-900 tracking-tight flex items-center gap-1.5 leading-none">
              PaperCraft <span className="font-mono text-[10px] text-riso-coral font-bold uppercase tracking-wider bg-red-100 px-1 py-0.5 rounded">CRDT</span>
            </h1>
            <button
              onClick={onOpenRoomModal}
              className="text-[11px] font-mono text-stone-500 hover:text-riso-indigo flex items-center gap-1 font-semibold transition-colors mt-0.5"
            >
              <span>Room: #{roomId}</span>
              <span className="text-[9px] opacity-60">▾</span>
            </button>
          </div>
        </div>

        {/* Quick Top Create Actions on Desktop */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#FFFDF8] border-2 border-stone-800 p-1 rounded-lg shadow-paper-sm">
          <button
            onClick={() => onAddStickyNote()}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#CA8A04] rounded text-xs font-mono font-bold transition-transform active:scale-95"
            title="Create Note"
          >
            <StickyNote className="w-3.5 h-3.5" />
            <span>+ Add Note</span>
          </button>
          <button
            onClick={() => onAddTextBlock()}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF9ED] hover:bg-stone-100 text-stone-800 border border-stone-300 rounded text-xs font-mono font-bold transition-transform active:scale-95"
            title="Create Index Card"
          >
            <BookOpen className="w-3.5 h-3.5 text-riso-coral" />
            <span>+ Text Block</span>
          </button>
          <button
            onClick={onClearCanvas}
            className="p-1 hover:bg-red-50 text-red-700 rounded transition-colors"
            title="Clear Board"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Multiplayer Avatars & Sync Pill Badge */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Active Presence Avatars */}
        <PresenceAvatars
          currentUser={currentUser}
          onUpdateCurrentUser={onUpdateCurrentUser}
          remoteUsers={remoteUsers}
        />

        {/* Connection & Local-First Sync Pill */}
        <ConnectionStatusBadge
          connectionStatus={connectionStatus}
          isIndexedDbSynced={isIndexedDbSynced}
          remotePeersCount={remoteUsers.length}
          clientId={clientId}
          roomId={roomId}
        />
      </div>
    </header>
  );
};
