import { useState, useCallback, useContext } from 'react';
import { WorkspaceContext } from '../context/WorkspaceContext';

export function useWorkspace(docId?: string) {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }

  // Local UI state
  const [activeTab, setActiveTab] = useState<'document' | 'canvas'>('document');
  const [isSyncPanelOpen, setIsSyncPanelOpen] = useState(false);

  return {
    ...context,
    activeTab,
    setActiveTab,
    isSyncPanelOpen,
    setIsSyncPanelOpen,
    currentDocId: docId,
  };
}

