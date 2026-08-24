import React from 'react';
import { X, Server, HardDrive, Zap, Clock, GitMerge } from 'lucide-react';
import { ConflictDemo } from './ConflictDemo';

export function SyncPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-96 bg-white border-l border-workspace-200 shadow-xl flex flex-col z-50 animate-slide-in">
      <div className="p-4 border-b border-workspace-200 flex justify-between items-center bg-workspace-50">
        <div className="flex items-center space-x-2">
          <Zap size={18} className="text-primary-600" />
          <h2 className="font-semibold text-workspace-800">Sync Engine</h2>
          <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-2">Demo</span>
        </div>
        <button onClick={onClose} className="text-workspace-400 hover:text-workspace-700 p-1 rounded-md hover:bg-workspace-200">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Status Overview */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-workspace-500">Status Overview</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-workspace-50 p-3 rounded-lg border border-workspace-200 relative">
              <div className="flex items-center space-x-2 mb-1">
                <HardDrive size={14} className="text-workspace-500" />
                <span className="text-xs font-medium text-workspace-600">Local State</span>
              </div>
              <div className="text-lg font-semibold text-workspace-900">Saved</div>
            </div>
            
            <div className="bg-workspace-50 p-3 rounded-lg border border-workspace-200 relative">
              <span className="absolute -top-2 -right-2 bg-amber-100 text-amber-700 text-[9px] font-bold px-1 rounded">Phase 2</span>
              <div className="flex items-center space-x-2 mb-1">
                <Server size={14} className="text-workspace-500" />
                <span className="text-xs font-medium text-workspace-600">Server State</span>
              </div>
              <div className="text-sm font-semibold text-workspace-500">Not Connected</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm py-2 border-b border-workspace-100 relative">
            <span className="text-workspace-600">Connection</span>
            <span className="flex items-center text-workspace-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-workspace-300 mr-2"></span>
              Local Only
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm py-2 border-b border-workspace-100">
            <span className="text-workspace-600">Last Sync</span>
            <span className="flex items-center text-workspace-900 font-medium">
              <Clock size={14} className="mr-1 text-workspace-400" /> Just now
            </span>
          </div>

          <div className="flex items-center justify-between text-sm py-2 border-b border-workspace-100 relative">
            <span className="text-workspace-600">Sync Engine</span>
            <span className="text-workspace-500 font-medium">None (Phase 1)</span>
          </div>
        </div>

        {/* Architecture Diagram */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-workspace-500 relative">
            Data Flow
            <span className="absolute -top-1 ml-2 bg-amber-100 text-amber-700 text-[9px] font-bold px-1 rounded">Phase 2</span>
          </h3>
          <div className="bg-workspace-50 p-4 rounded-lg border border-workspace-200 text-xs font-mono text-workspace-600 opacity-60">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-full bg-white p-2 text-center rounded border border-workspace-200 font-medium text-workspace-800">Frontend (Local CRDT)</div>
              <div className="text-workspace-400">↓</div>
              <div className="w-full bg-white p-2 text-center rounded border border-workspace-200">IndexedDB (Offline)</div>
              <div className="text-workspace-400">↓ WebSocket</div>
              <div className="w-full bg-white p-2 text-center rounded border border-primary-200 bg-primary-50 text-primary-800 font-medium">Sync Service (Node.js)</div>
              <div className="text-workspace-400">↓</div>
              <div className="w-full bg-white p-2 text-center rounded border border-workspace-200">MongoDB</div>
            </div>
          </div>
        </div>

        {/* Conflict Resolution Demo */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-workspace-500">Conflict Resolution</h3>
            <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Demo</span>
          </div>
          <p className="text-xs text-workspace-600 mb-2">Watch how CRDT automatically resolves concurrent edits without locking. (Simulated)</p>
          <ConflictDemo />
        </div>

      </div>
    </div>
  );
}
