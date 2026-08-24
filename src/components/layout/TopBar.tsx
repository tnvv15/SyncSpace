import React from 'react';
import { Cloud, Activity } from 'lucide-react';
import { MOCK_USERS, CURRENT_USER_ID } from '../../data/mockData';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useAuth } from '../../auth/AuthContext';

type TopBarProps = {
  workspaceState: ReturnType<typeof useWorkspace>;
};

export function TopBar({ workspaceState }: TopBarProps) {
  const { setIsSyncPanelOpen, documents, currentDocId } = workspaceState;
  const { user } = useAuth();
  
  const activeCollaborators = Object.values(MOCK_USERS).filter(u => u.id !== CURRENT_USER_ID && u.isOnline);

  const docTitle = currentDocId && documents[currentDocId] ? documents[currentDocId].title : 'Workspace';

  return (
    <div className="h-12 border-b border-workspace-200 flex items-center justify-between px-4 bg-white/50 backdrop-blur-sm z-10 sticky top-0">
      <div className="flex items-center space-x-2 text-sm text-workspace-500">
        <span className="hover:bg-workspace-100 px-2 py-1 rounded cursor-pointer transition-colors">SyncSpace</span>
        <span>/</span>
        <span className="font-medium text-workspace-800">{docTitle}</span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Offline / Sync Status */}
        <div 
          className="flex items-center space-x-2 text-xs font-medium px-2 py-1 rounded-md transition-colors"
        >
          <Cloud size={14} className="text-status-synced" />
          <span className="text-workspace-600">Saved locally</span>
        </div>

        {/* Sync Panel Toggle */}
        <button 
          onClick={() => setIsSyncPanelOpen(true)}
          className="p-1.5 text-workspace-500 hover:text-primary-600 hover:bg-workspace-100 rounded-md transition-colors relative"
          title="Open Sync Engine Panel"
        >
          <Activity size={18} />
          <span className="absolute -top-1 -right-1 bg-amber-100 text-amber-700 text-[9px] font-bold px-1 rounded">Demo</span>
        </button>

        {/* Collaborators */}
        <div className="flex items-center -space-x-2 relative" title="Demo: Real-time collaboration in Phase 2">
          {activeCollaborators.map(user => (
            <div key={user.id} className="relative group cursor-pointer z-10 hover:z-20">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-7 h-7 rounded-full border-2 border-white bg-workspace-200 object-cover shadow-sm opacity-50 grayscale"
              />
              <div 
                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-gray-400"
              />
            </div>
          ))}
          <div className="relative group cursor-pointer z-10 hover:z-20 ml-2">
             <img 
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}&backgroundColor=c0aede`} 
                alt={user?.name || 'User'} 
                className="w-7 h-7 rounded-full border-2 border-white bg-workspace-200 object-cover shadow-sm"
              />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-700 text-[9px] font-bold px-1 rounded shadow-sm">Demo</div>
        </div>
      </div>
    </div>
  );
}
