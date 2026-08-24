import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { MOCK_HISTORY, MOCK_USERS } from '../../data/mockData';

export function VersionHistory({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-workspace-200 flex justify-between items-center bg-white">
        <h2 className="font-semibold text-workspace-800">Version History</h2>
        <button onClick={onClose} className="text-workspace-400 hover:text-workspace-700">
          <X size={18} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="relative border-l-2 border-workspace-200 ml-3 space-y-6">
          {MOCK_HISTORY.map((entry, idx) => {
            const user = MOCK_USERS[entry.userId];
            const isFirst = idx === 0;

            return (
              <div key={entry.id} className="relative pl-6 group">
                <div 
                  className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${isFirst ? 'bg-primary-500' : 'bg-workspace-300'}`} 
                />
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isFirst ? 'text-workspace-900' : 'text-workspace-700'}`}>
                      {entry.timestamp}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 text-workspace-400 hover:text-primary-600 transition-opacity" title="Restore this version">
                      <RotateCcw size={14} />
                    </button>
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <img src={user.avatarUrl} alt={user.name} className="w-5 h-5 rounded-full bg-workspace-200" />
                    <span className="text-xs text-workspace-600">{user.name}</span>
                  </div>
                  <p className="mt-2 text-sm text-workspace-500">
                    {entry.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
