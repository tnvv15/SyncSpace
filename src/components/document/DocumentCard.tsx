import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FileText, LayoutGrid, FileIcon, Trash2, RotateCcw, Download, Star, Users, Clock, Edit2 } from 'lucide-react';
import { DocumentMeta, UserPresence } from '../../types/dashboard';

// Helpers
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function formatRelativeTime(dateMs: number) {
  const diffMs = Date.now() - dateMs;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

type DocumentCardProps = {
  doc: DocumentMeta;
  filter: string;
  activeUsers: UserPresence[];
  canvasItems?: any[]; // For future preview implementation
  selected: boolean;
  onToggleSelect: (id: string, selected: boolean) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onPermanentlyDelete: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  showSelection: boolean;
};

export function DocumentCard({
  doc,
  filter,
  activeUsers,
  canvasItems = [],
  selected,
  onToggleSelect,
  onToggleFavorite,
  onDelete,
  onRestore,
  onPermanentlyDelete,
  onUpdateTitle,
  showSelection
}: DocumentCardProps) {
  const isCanvas = doc.type === 'canvas';
  const isFile = doc.type === 'file';
  const isImage = isFile && doc.fileData?.mimeType.startsWith('image/');
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(doc.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== doc.title) {
      onUpdateTitle(doc.id, editedTitle.trim());
    } else {
      setEditedTitle(doc.title); // Reset if empty
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditedTitle(doc.title);
      setIsEditingTitle(false);
    }
  };

  // Previews
  const renderCanvasPreview = () => {
    if (canvasItems && canvasItems.length > 0) {
      // Mock rendering some items in future
      return (
        <div className="w-full h-full bg-workspace-100 p-2 opacity-60">
           <div className="w-1/2 h-1/2 bg-yellow-200 shadow-sm rounded-sm mb-1 ml-2 transform rotate-3"></div>
           <div className="w-1/3 h-1/4 border-2 border-primary-500 bg-white rounded shadow-sm ml-6 transform -rotate-2"></div>
        </div>
      );
    }
    // Empty state dotted grid
    return (
      <div 
        className="w-full h-full bg-workspace-50"
        style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '8px 8px' }}
      ></div>
    );
  };

  const renderDocPreview = () => {
    return (
      <div className="w-full h-full bg-workspace-50 p-4 flex flex-col justify-start items-start opacity-70 space-y-2">
        <div className="w-3/4 h-2 bg-workspace-200 rounded"></div>
        <div className="w-full h-1.5 bg-workspace-200 rounded"></div>
        <div className="w-5/6 h-1.5 bg-workspace-200 rounded"></div>
        <div className="w-full h-1.5 bg-workspace-200 rounded"></div>
        <div className="w-4/6 h-1.5 bg-workspace-200 rounded"></div>
      </div>
    );
  };

  return (
    <div className="group flex flex-col border border-workspace-200 rounded-xl hover:border-primary-300 hover:shadow-panel transition-all bg-white relative overflow-hidden">
      
      {/* Selection Checkbox */}
      <div className={`absolute top-3 left-3 z-20 transition-opacity ${selected || showSelection ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSelect(doc.id, !selected);
          }}
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selected ? 'bg-primary-500 border-primary-500 text-white' : 'bg-white border-workspace-300 text-transparent hover:border-workspace-400 shadow-sm'}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>

      {/* Preview Area */}
      <Link 
        to={filter === 'trash' ? '#' : `/workspace/${doc.id}`}
        onClick={(e) => { if (filter === 'trash') e.preventDefault(); }}
        className={`block h-32 bg-workspace-50 relative flex items-center justify-center border-b border-workspace-100 overflow-hidden ${filter === 'trash' ? 'opacity-75 cursor-default' : ''}`}
      >
        {/* Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-workspace-600 border border-workspace-200 flex items-center space-x-1 shadow-sm z-10">
          {isCanvas ? <LayoutGrid size={12} /> : isFile ? <FileIcon size={12} /> : <FileText size={12} />}
          <span className="capitalize">{isFile && doc.fileData ? doc.fileData.mimeType.split('/')[1] || 'File' : doc.type}</span>
        </div>

        {/* Quick Actions (Hover) */}
        <div className="absolute top-3 right-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {filter === 'trash' ? (
            <>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRestore(doc.id); }}
                className="p-1.5 rounded-md bg-white shadow-sm border border-workspace-200 text-workspace-600 hover:text-green-600 hover:bg-green-50"
                title="Restore"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (window.confirm('Delete this workspace forever?')) onPermanentlyDelete(doc.id);
                }}
                className="p-1.5 bg-white shadow-sm border border-workspace-200 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                title="Delete Forever"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <>
              {isFile && doc.fileData?.blobUrl && (
                <a
                  href={doc.fileData.blobUrl}
                  download={doc.fileData.name}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-md bg-white shadow-sm border border-workspace-200 text-workspace-600 hover:text-primary-600 hover:bg-primary-50"
                  title="Download File"
                >
                  <Download size={16} />
                </a>
              )}
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(doc.id); }}
                className={`p-1.5 rounded-md bg-white shadow-sm border border-workspace-200 transition-colors ${doc.isFavorite ? 'text-amber-400 hover:bg-amber-50' : 'text-neutral-400 hover:text-amber-400 hover:bg-amber-50'}`}
                title={doc.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star size={16} className={doc.isFavorite ? 'fill-amber-400' : ''} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(doc.id);
                }}
                className="p-1.5 bg-white shadow-sm border border-workspace-200 text-workspace-400 hover:text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>

        {/* Placeholder Icon / Thumbnail / Minimap */}
        {isImage && doc.fileData?.blobUrl ? (
          <img src={doc.fileData.blobUrl} alt={doc.title} className="w-full h-full object-cover" />
        ) : isCanvas ? (
          renderCanvasPreview()
        ) : isFile ? (
          <div className="p-4 rounded-xl bg-indigo-50 text-indigo-400">
            <FileIcon size={48} strokeWidth={1} />
          </div>
        ) : (
          renderDocPreview()
        )}
      </Link>

      {/* Meta Area */}
      <div className="p-4 flex flex-col justify-between flex-1 relative">
        <div>
          {isEditingTitle ? (
            <input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="w-full font-medium mb-1 px-1.5 py-0.5 -ml-1.5 border border-primary-400 rounded outline-none shadow-sm text-workspace-900 bg-white"
            />
          ) : (
            <div className="flex items-center group/title mb-1">
              <Link 
                to={filter === 'trash' ? '#' : `/workspace/${doc.id}`}
                onClick={(e) => { 
                  if (filter === 'trash') e.preventDefault(); 
                }}
                className={`flex-1 min-w-0 transition-colors ${filter === 'trash' ? 'cursor-default' : 'hover:text-primary-600'}`}
              >
                <h3 className={`font-medium truncate ${filter === 'trash' ? 'text-workspace-500' : 'text-workspace-900'}`}>
                  {doc.title}
                </h3>
              </Link>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
                className="ml-2 opacity-0 group-hover/title:opacity-100 text-workspace-400 hover:text-primary-600 p-1 rounded hover:bg-workspace-100"
                title="Rename"
              >
                <Edit2 size={14} />
              </button>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-xs text-workspace-500 mt-1">
            {doc.lastModifiedBy ? (
              <span className="flex items-center">
                <Clock size={12} className="mr-1"/> 
                Edited by {doc.lastModifiedBy.name} &bull; {formatRelativeTime(doc.updatedAt)}
              </span>
            ) : (
              <span className="flex items-center">
                <Clock size={12} className="mr-1"/> 
                {filter === 'recent' ? formatRelativeTime(doc.updatedAt) : `Edited ${new Date(doc.updatedAt).toLocaleDateString()}`}
              </span>
            )}
            {isFile && doc.fileData && (
              <>
                <span>&bull;</span>
                <span>{formatBytes(doc.fileData.size)}</span>
              </>
            )}
          </div>
        </div>

        {/* Live Presence */}
        <div className="mt-4 flex items-center h-6">
          {activeUsers.length > 0 ? (
            <div className="flex items-center -space-x-2">
              {activeUsers.slice(0, 3).map((u, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xs group/avatar relative"
                  style={{ backgroundColor: u.userColor }}
                >
                  {u.userName.charAt(0).toUpperCase()}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-workspace-900 text-white text-[10px] rounded opacity-0 group-hover/avatar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {u.userName} is currently active
                  </div>
                </div>
              ))}
              {activeUsers.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-workspace-100 flex items-center justify-center text-[10px] font-medium text-workspace-600 shadow-xs z-10">
                  +{activeUsers.length - 3}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-xs text-workspace-400">
              <span>No active editors</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
