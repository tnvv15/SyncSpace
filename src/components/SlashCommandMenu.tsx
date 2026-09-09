import React, { useEffect, useRef } from 'react';
import {
  Heading1,
  Heading2,
  CheckSquare,
  List,
  ListOrdered,
  Quote,
  Type
} from 'lucide-react';
import { BlockType } from '../types/documentTheme';

export interface SlashCommandItem {
  id: string;
  type: BlockType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export const SLASH_COMMANDS: SlashCommandItem[] = [
  {
    id: 'paragraph',
    type: 'paragraph',
    label: 'Text',
    description: 'Just start writing with plain text.',
    icon: <Type size={16} className="text-workspace-500" />,
  },
  {
    id: 'heading1',
    type: 'heading1',
    label: 'Heading 1',
    description: 'Big section heading.',
    icon: <Heading1 size={16} className="text-workspace-700" />,
  },
  {
    id: 'heading2',
    type: 'heading2',
    label: 'Heading 2',
    description: 'Medium section heading.',
    icon: <Heading2 size={16} className="text-workspace-700" />,
  },
  {
    id: 'checklist',
    type: 'checklist',
    label: 'To-do list',
    description: 'Track tasks with a to-do list.',
    icon: <CheckSquare size={16} className="text-primary-600" />,
  },
  {
    id: 'bullet',
    type: 'bullet',
    label: 'Bulleted list',
    description: 'Create a simple bulleted list.',
    icon: <List size={16} className="text-workspace-600" />,
  },
  {
    id: 'numbered',
    type: 'numbered',
    label: 'Numbered list',
    description: 'Create a list with numbering.',
    icon: <ListOrdered size={16} className="text-workspace-600" />,
  },
  {
    id: 'quote',
    type: 'quote',
    label: 'Quote',
    description: 'Capture a quote or callout.',
    icon: <Quote size={16} className="text-primary-700" />,
  },
];

export interface SlashCommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: SlashCommandItem) => void;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  filterQuery?: string;
}

export function SlashCommandMenu({
  isOpen,
  onClose,
  onSelect,
  selectedIndex,
  setSelectedIndex,
  filterQuery = '',
}: SlashCommandMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredCommands = SLASH_COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onSelect(filteredCommands[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onSelect, onClose, setSelectedIndex]);

  if (!isOpen || filteredCommands.length === 0) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div
        ref={menuRef}
        className="absolute left-0 top-full mt-1.5 z-40 w-72 bg-white rounded-xl shadow-xl border border-workspace-200 py-1.5 overflow-hidden animate-fade-in font-sans"
      >
        <div className="px-3 py-1 text-[11px] font-semibold text-workspace-400 uppercase tracking-wider">
          Basic blocks
        </div>
        <div className="max-h-64 overflow-y-auto custom-scrollbar">
          {filteredCommands.map((cmd, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={cmd.id}
                type="button"
                onClick={() => onSelect(cmd)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full px-3 py-2 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-primary-50/80 text-primary-900' : 'text-workspace-700 hover:bg-workspace-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  isSelected ? 'bg-white border-primary-300 shadow-xs' : 'bg-workspace-50 border-workspace-200'
                }`}>
                  {cmd.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-workspace-800">{cmd.label}</div>
                  <div className="text-[11px] text-workspace-500 truncate">{cmd.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default SlashCommandMenu;
