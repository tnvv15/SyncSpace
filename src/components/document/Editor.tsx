import React from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { DocumentWorkspace } from '../../pages/DocumentWorkspace';

export interface EditorProps {
  workspaceState: ReturnType<typeof useWorkspace>;
}

export function Editor({ workspaceState }: EditorProps) {
  return <DocumentWorkspace workspaceState={workspaceState} />;
}

export default Editor;
