import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useWorkspace } from '../../hooks/useWorkspace';
import { SyncPanel } from '../collaboration/SyncPanel';

export function MainLayout() {
  const { id } = useParams<{ id?: string }>();
  const pathParts = window.location.pathname.split('/');
  const docId = id || (pathParts[1] === 'workspace' ? pathParts[2] : undefined);
  
  const workspaceState = useWorkspace(docId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-workspace-50 text-workspace-800 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 relative bg-white overflow-hidden">
        <Outlet context={workspaceState} />
        {workspaceState.isSyncPanelOpen && (
          <SyncPanel onClose={() => workspaceState.setIsSyncPanelOpen(false)} />
        )}
      </main>
    </div>
  );
}

export default MainLayout;
