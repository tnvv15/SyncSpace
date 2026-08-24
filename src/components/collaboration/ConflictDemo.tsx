import React, { useState, useEffect } from 'react';
import { GitMerge } from 'lucide-react';

export function ConflictDemo() {
  const [step, setStep] = useState(0);

  // 0: Initial
  // 1: Client A edits
  // 2: Client B edits concurrently
  // 3: CRDT Merge (Converged)

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white border border-workspace-200 rounded-lg p-3 overflow-hidden shadow-sm">
      
      {/* State visualizer */}
      <div className="space-y-3">
        
        {/* Client A */}
        <div className={`transition-opacity duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-primary-600 uppercase">Client A (Local)</span>
            {step === 1 && <span className="text-[10px] bg-primary-100 text-primary-700 px-1 rounded animate-pulse">Typing...</span>}
          </div>
          <div className="bg-workspace-50 p-2 rounded border border-workspace-200 font-mono text-xs">
            <span className={step >= 1 ? 'bg-green-200 text-green-900' : ''}>"Hello"</span>
          </div>
        </div>

        {/* Client B */}
        <div className={`transition-opacity duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-amber-600 uppercase">Client B (Offline)</span>
            {step === 2 && <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded animate-pulse">Typing...</span>}
          </div>
          <div className="bg-workspace-50 p-2 rounded border border-workspace-200 font-mono text-xs">
            <span className={step >= 2 ? 'bg-yellow-200 text-yellow-900' : ''}>"World"</span>
          </div>
        </div>

        {/* Merge Result */}
        <div className={`transition-all duration-500 transform ${step === 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex items-center justify-center my-2 text-workspace-400">
            <GitMerge size={16} />
            <div className="w-px h-6 bg-workspace-200 mx-2"></div>
            <span className="text-[10px] font-bold text-workspace-500 uppercase">CRDT Merge</span>
          </div>
          
          <div className="bg-primary-50 p-2 rounded border border-primary-200 font-mono text-xs text-center shadow-sm">
            <span className="bg-green-200 text-green-900">"Hello"</span>
            {' '}
            <span className="bg-yellow-200 text-yellow-900">"World"</span>
          </div>
          <div className="text-center mt-1">
            <span className="text-[10px] text-status-synced font-medium">Converged State</span>
          </div>
        </div>

      </div>
    </div>
  );
}
