import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, Database, Server, Users, Info } from 'lucide-react';
import { ConnectionStatus } from '../types/canvas';

interface ConnectionStatusBadgeProps {
  connectionStatus: ConnectionStatus;
  isIndexedDbSynced: boolean;
  remotePeersCount: number;
  clientId?: number;
  roomId: string;
}

export const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({
  connectionStatus,
  isIndexedDbSynced,
  remotePeersCount,
  clientId,
  roomId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusBadge = () => {
    if (connectionStatus === 'connected') {
      return {
        label: 'Live Ink Sync',
        sublabel: 'Connected',
        bg: 'bg-emerald-50 text-emerald-900 border-emerald-600',
        dot: 'bg-emerald-500',
        icon: Wifi,
      };
    }
    if (connectionStatus === 'connecting') {
      return {
        label: 'Connecting...',
        sublabel: 'Syncing',
        bg: 'bg-amber-50 text-amber-900 border-amber-500',
        dot: 'bg-amber-500 animate-ping',
        icon: RefreshCw,
      };
    }
    return {
      label: 'Local Parchment',
      sublabel: 'Offline-First Cache',
      bg: 'bg-[#F4EBE1] text-[#633B1E] border-[#A87B51]',
      dot: 'bg-[#A87B51]',
      icon: WifiOff,
    };
  };

  const status = getStatusBadge();
  const Icon = status.icon;

  return (
    <div className="relative select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 text-xs font-mono font-bold shadow-paper-sm hover:shadow-paper-md transition-all ${status.bg}`}
        title="Click to view Local-First CRDT Status"
      >
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.dot}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${status.dot}`} />
        </span>

        <span className="tracking-wide">{status.label}</span>
      </button>

      {/* Detailed Status Popover */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-11 w-80 bg-[#FFFDF8] border-2 border-stone-800 rounded p-4 shadow-paper-lg z-50 animate-fade-in text-stone-800 font-sans">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2 mb-3">
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-riso-indigo flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-riso-coral" />
                CRDT & Sync Inspector
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-100 rounded border border-stone-300">
                Doc: #{roomId}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* IndexedDB Status */}
              <div className="flex items-start gap-2.5 p-2 bg-parchment-100 rounded border border-stone-300/80">
                <Database className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">Local-First Storage</div>
                  <div className="text-[11px] text-stone-600">
                    {isIndexedDbSynced 
                      ? 'IndexedDB active. All changes persist locally and survive browser reloads.'
                      : 'Initializing local parchment cache...'}
                  </div>
                </div>
              </div>

              {/* WebSocket Status */}
              <div className="flex items-start gap-2.5 p-2 bg-stone-50 rounded border border-stone-300/80">
                <Server className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">WebSocket Peer Relay</div>
                  <div className="text-[11px] text-stone-600 font-mono">
                    ws://localhost:1234
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">
                    {connectionStatus === 'connected'
                      ? '🟢 Real-time sync with peer clients active.'
                      : '🍂 Offline mode active. Edits are recorded locally in CRDT and will auto-merge when online.'}
                  </div>
                </div>
              </div>

              {/* Awareness Peers */}
              <div className="flex items-center justify-between p-2 bg-stone-50 rounded border border-stone-300/80">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-riso-sage" />
                  <span className="font-semibold text-stone-800">Active Peers</span>
                </div>
                <span className="font-mono font-bold text-xs bg-stone-200 px-2 py-0.5 rounded">
                  {remotePeersCount} remote user{remotePeersCount !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Client ID */}
              {clientId && (
                <div className="text-[10px] font-mono text-stone-500 flex justify-between pt-1 border-t border-stone-200">
                  <span>Yjs Client ID:</span>
                  <span className="font-bold text-stone-700">{clientId}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
