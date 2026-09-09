import React, { useState } from 'react';
import { X, MessageSquare, Send, CheckCircle2, Trash2 } from 'lucide-react';

export interface CommentItem {
  id: string;
  author: string;
  avatarBg: string;
  timestamp: string;
  content: string;
  resolved: boolean;
}

export interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    author: 'Alex Rivera',
    avatarBg: 'bg-emerald-600',
    timestamp: '25m ago',
    content: 'Can we add a section outlining our offline sync fallback strategies here?',
    resolved: false,
  },
  {
    id: 'c2',
    author: 'Tanvi',
    avatarBg: 'bg-primary-600',
    timestamp: '10m ago',
    content: 'Yes, I am drafting the vector clock & Yjs CRDT breakdown right below CAP theorem.',
    resolved: false,
  }
];

export function CommentsDrawer({ isOpen, onClose }: CommentsDrawerProps) {
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');

  if (!isOpen) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      author: 'Tanvi',
      avatarBg: 'bg-primary-600',
      timestamp: 'Just now',
      content: newCommentText.trim(),
      resolved: false,
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
  };

  const handleToggleResolve = (id: string) => {
    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, resolved: !c.resolved } : c))
    );
  };

  const handleDelete = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const activeComments = comments.filter(c => !c.resolved);
  const resolvedComments = comments.filter(c => c.resolved);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 animate-fade-in" onClick={onClose} />
      <aside className="fixed top-0 right-0 bottom-0 w-80 sm:w-96 bg-white border-l border-workspace-200 shadow-2xl z-50 flex flex-col font-sans animate-slide-in">
        
        {/* Header */}
        <div className="h-14 px-5 border-b border-workspace-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <MessageSquare size={14} />
            </div>
            <h3 className="text-sm font-bold text-workspace-900">
              Comments ({activeComments.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-workspace-400 hover:text-workspace-700 hover:bg-workspace-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* New Comment Input Form */}
        <form onSubmit={handleAddComment} className="p-4 border-b border-workspace-100 bg-workspace-50/50 shrink-0">
          <textarea
            placeholder="Write a comment..."
            rows={2}
            value={newCommentText}
            onChange={e => setNewCommentText(e.target.value)}
            className="w-full p-2.5 text-xs bg-white border border-workspace-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder:text-workspace-400 resize-none transition-all"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="px-3.5 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send size={12} />
              <span>Comment</span>
            </button>
          </div>
        </form>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {activeComments.length === 0 && (
            <div className="text-center py-8 text-workspace-400 text-xs">
              No active comments. Start a conversation above!
            </div>
          )}

          {activeComments.map(c => (
            <div key={c.id} className="p-3.5 rounded-xl border border-workspace-200 bg-white shadow-xs space-y-2 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${c.avatarBg} text-white text-[11px] font-bold flex items-center justify-center`}>
                    {c.author.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-workspace-900">{c.author}</span>
                    <span className="text-[10px] text-workspace-400 ml-1.5">{c.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleToggleResolve(c.id)}
                    title="Mark as resolved"
                    className="p-1 text-workspace-400 hover:text-emerald-600 rounded transition-colors cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    title="Delete"
                    className="p-1 text-workspace-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-workspace-700 leading-relaxed">{c.content}</p>
            </div>
          ))}

          {/* Resolved comments section */}
          {resolvedComments.length > 0 && (
            <div className="pt-4 border-t border-workspace-100">
              <div className="text-[11px] font-semibold text-workspace-400 uppercase tracking-wider mb-2">
                Resolved ({resolvedComments.length})
              </div>
              <div className="space-y-2 opacity-60">
                {resolvedComments.map(c => (
                  <div key={c.id} className="p-2.5 rounded-lg border border-workspace-100 bg-workspace-50 text-xs text-workspace-500">
                    <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                      <span>{c.author}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleResolve(c.id)}
                        className="text-primary-600 hover:underline cursor-pointer"
                      >
                        Re-open
                      </button>
                    </div>
                    <p className="line-through">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}

export default CommentsDrawer;
