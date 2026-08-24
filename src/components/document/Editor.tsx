import React, { useRef, useState } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { Block as BlockType } from '../../data/mockData';
import { Block } from './Block';
import { VersionHistory } from './VersionHistory';

type EditorProps = {
  workspaceState: ReturnType<typeof useWorkspace>;
};

export function Editor({ workspaceState }: EditorProps) {
  const { 
    blocks, 
    documents, 
    currentDocId, 
    updateDocumentTitle, 
    updateBlock, 
    toggleChecklist,
    addBlock,
    deleteBlock
  } = workspaceState;

  const titleRef = useRef<HTMLHeadingElement>(null);
  const [showHistory, setShowHistory] = useState(false);

  const docBlocks = currentDocId ? blocks[currentDocId] || [] : [];
  const docTitle = currentDocId && documents[currentDocId] ? documents[currentDocId].title : 'Untitled';

  const handleTitleChange = (e: React.FocusEvent<HTMLHeadingElement>) => {
    if (currentDocId) {
      updateDocumentTitle(currentDocId, e.currentTarget.textContent || 'Untitled Document');
    }
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Main Editor Area */}
      <div className="flex-1 overflow-y-auto px-12 py-16 custom-scrollbar">
        <div className="max-w-3xl mx-auto relative">
          
          <div className="flex justify-between items-start mb-8">
            <h1 
              ref={titleRef}
              contentEditable
              suppressContentEditableWarning
              onBlur={handleTitleChange}
              className="text-4xl font-bold text-workspace-900 outline-none flex-1 break-words placeholder-workspace-300"
              data-placeholder="Document Title"
            >
              {docTitle}
            </h1>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`ml-4 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                showHistory ? 'bg-primary-100 text-primary-700' : 'bg-workspace-100 text-workspace-600 hover:bg-workspace-200'
              }`}
            >
              History
            </button>
          </div>

          <div className="space-y-1 pb-32">
            {docBlocks.map(block => (
              <Block 
                key={block.id} 
                block={block} 
                onChange={(content) => currentDocId && updateBlock(currentDocId, block.id, content)}
                onToggleCheck={() => currentDocId && toggleChecklist(currentDocId, block.id)}
                onAddBlock={(type) => currentDocId && addBlock(currentDocId, type, block.id)}
                onDeleteBlock={() => currentDocId && deleteBlock(currentDocId, block.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Version History Sidebar */}
      {showHistory && (
        <div className="w-80 border-l border-workspace-200 bg-workspace-50 flex flex-col">
          <VersionHistory onClose={() => setShowHistory(false)} />
        </div>
      )}
    </div>
  );
}
