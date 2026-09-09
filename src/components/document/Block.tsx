import React, { useRef, useState, useEffect } from 'react';
import { Block as BlockType } from '../../data/mockData';
import { GripVertical, Plus, Trash2, Type, Heading1, Heading2, List, ListOrdered, CheckSquare, Code, Minus } from 'lucide-react';

type BlockProps = {
  block: BlockType;
  onChange: (content: string) => void;
  onToggleCheck?: () => void;
  onAddBlock?: (type: BlockType['type']) => void;
  onDeleteBlock?: () => void;
};

export function Block({ block, onChange, onToggleCheck, onAddBlock, onDeleteBlock }: BlockProps) {
  const contentRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBlur = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerText);
    }
  };

  const renderContent = () => {
    switch (block.type) {
      case 'heading1':
        return (
          <h2
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            className="text-3xl font-semibold mt-6 mb-2 outline-none empty:before:content-['Heading_1'] empty:before:text-workspace-300"
          >
            {block.content}
          </h2>
        );
      case 'heading2':
        return (
          <h3
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            className="text-2xl font-medium mt-5 mb-1 outline-none empty:before:content-['Heading_2'] empty:before:text-workspace-300"
          >
            {block.content}
          </h3>
        );
      case 'bullet_list':
        return (
          <div className="flex items-start group">
            <span className="w-6 flex-shrink-0 text-center text-workspace-800 font-bold leading-relaxed">•</span>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur}
              className="flex-1 outline-none leading-relaxed empty:before:content-['List_item'] empty:before:text-workspace-300"
            >
              {block.content}
            </div>
          </div>
        );
      case 'numbered_list':
        return (
          <div className="flex items-start group">
            <span className="w-6 flex-shrink-0 text-right pr-2 text-workspace-500 leading-relaxed font-medium">1.</span>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur}
              className="flex-1 outline-none leading-relaxed empty:before:content-['List_item'] empty:before:text-workspace-300"
            >
              {block.content}
            </div>
          </div>
        );
      case 'checklist':
        return (
          <div className="flex items-start group mt-1 mb-1">
            <div className="w-6 flex-shrink-0 pt-1">
              <input
                type="checkbox"
                checked={block.checked}
                onChange={onToggleCheck}
                className="w-4 h-4 rounded border-workspace-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
            </div>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur}
              className={`flex-1 outline-none leading-relaxed empty:before:content-['To-do'] empty:before:text-workspace-300 ${block.checked ? 'line-through text-workspace-400' : ''}`}
            >
              {block.content}
            </div>
          </div>
        );
      case 'code':
        return (
          <div className="my-3 rounded-md bg-workspace-800 text-workspace-50 p-4 font-mono text-sm overflow-x-auto shadow-sm">
            <pre
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              onBlur={handleBlur}
              className="outline-none min-h-[1.5rem]"
            >
              {block.content}
            </pre>
          </div>
        );
      case 'divider':
        return (
          <div className="my-6">
            <hr className="border-workspace-200" />
          </div>
        );
      case 'paragraph':
      default:
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            className="outline-none leading-relaxed my-1 empty:before:content-['Type_\\'/_\\'_for_commands'] empty:before:text-workspace-300"
          >
            {block.content}
          </div>
        );
    }
  };

  return (
    <div
      className="relative flex items-center group -ml-12 pl-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMenuOpen(false); }}
    >
      {/* Block Drag Handle (Mock) */}
      <div className={`absolute left-0 flex items-center space-x-1 p-1 rounded transition-opacity ${isHovered || menuOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-workspace-300 hover:text-workspace-600 hover:bg-workspace-100 p-0.5 rounded transition-colors"
            title="Add block"
          >
            <Plus size={16} />
          </button>

          {menuOpen && (
            <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-md shadow-panel border border-workspace-200 z-50 py-1">
              <div className="px-2 py-1 text-xs font-semibold text-workspace-400">Add Block</div>
              <MenuButton icon={<Type size={14} />} label="Paragraph" onClick={() => { onAddBlock?.('paragraph'); setMenuOpen(false); }} />
              <MenuButton icon={<Heading1 size={14} />} label="Heading 1" onClick={() => { onAddBlock?.('heading1'); setMenuOpen(false); }} />
              <MenuButton icon={<Heading2 size={14} />} label="Heading 2" onClick={() => { onAddBlock?.('heading2'); setMenuOpen(false); }} />
              <MenuButton icon={<List size={14} />} label="Bullet List" onClick={() => { onAddBlock?.('bullet_list'); setMenuOpen(false); }} />
              <MenuButton icon={<ListOrdered size={14} />} label="Numbered List" onClick={() => { onAddBlock?.('numbered_list'); setMenuOpen(false); }} />
              <MenuButton icon={<CheckSquare size={14} />} label="Checklist" onClick={() => { onAddBlock?.('checklist'); setMenuOpen(false); }} />
              <MenuButton icon={<Code size={14} />} label="Code Block" onClick={() => { onAddBlock?.('code'); setMenuOpen(false); }} />
              <MenuButton icon={<Minus size={14} />} label="Divider" onClick={() => { onAddBlock?.('divider'); setMenuOpen(false); }} />
            </div>
          )}
        </div>

        <button className="text-workspace-300 hover:text-workspace-600 hover:bg-workspace-100 p-0.5 rounded cursor-grab transition-colors" title="Drag to move (Phase 2)">
          <GripVertical size={16} />
        </button>

        <button
          onClick={onDeleteBlock}
          className="text-workspace-300 hover:text-red-500 hover:bg-red-50 p-0.5 rounded transition-colors"
          title="Delete block"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="w-full flex-1">
        {renderContent()}
      </div>
    </div>
  );
}

function MenuButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center space-x-2 px-3 py-1.5 text-sm text-workspace-700 hover:bg-workspace-100 hover:text-workspace-900 transition-colors"
    >
      <span className="text-workspace-400">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
