import React from 'react';
import { useOutletContext, useParams, Navigate } from 'react-router-dom';
import { TopBar } from '../components/layout/TopBar';
import { Editor } from '../components/document/Editor';
import { CanvasBoard } from '../components/canvas/CanvasBoard';
import { useWorkspace } from '../hooks/useWorkspace';
import { FileText, Maximize } from 'lucide-react';

export function Workspace() {
  const { id } = useParams<{ id: string }>();
  const workspaceState = useOutletContext<ReturnType<typeof useWorkspace>>();
  const { activeTab, setActiveTab } = workspaceState;

  if (!id) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex flex-col h-full bg-white relative">
      <TopBar workspaceState={workspaceState} />
      
      {/* Mode Toggle */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 flex bg-white border border-workspace-200 rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setActiveTab('document')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'document' ? 'bg-workspace-100 text-workspace-900 shadow-sm' : 'text-workspace-500 hover:text-workspace-800 hover:bg-workspace-50'
          }`}
        >
          <FileText size={16} />
          <span>Document</span>
        </button>
        <button
          onClick={() => setActiveTab('canvas')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'canvas' ? 'bg-workspace-100 text-workspace-900 shadow-sm' : 'text-workspace-500 hover:text-workspace-800 hover:bg-workspace-50'
          }`}
        >
          <Maximize size={16} />
          <span>Canvas</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'document' ? (
          <Editor workspaceState={workspaceState} />
        ) : (
          <CanvasBoard workspaceState={workspaceState} />
        )}
      </div>
    </div>
  );
}
