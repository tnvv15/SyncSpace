import React, { useState } from 'react';
import { X, Copy, Check, Globe, Lock, Users, Send } from 'lucide-react';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle?: string;
}

export function ShareModal({ isOpen, onClose, documentTitle = 'Untitled Document' }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('edit');
  const [isPublic, setIsPublic] = useState(true);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    alert(`Invitation sent to ${emailInput} as ${permission === 'edit' ? 'Editor' : 'Viewer'}`);
    setEmailInput('');
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-fade-in" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-workspace-200 p-6 z-50 font-sans animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-workspace-100">
          <div>
            <h3 className="text-base font-bold text-workspace-900">Share Document</h3>
            <p className="text-xs text-workspace-500 mt-0.5 truncate max-w-xs">{documentTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-workspace-400 hover:text-workspace-700 hover:bg-workspace-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Invite by Email */}
        <form onSubmit={handleInvite} className="mt-4">
          <label className="block text-xs font-semibold text-workspace-700 mb-1.5">
            Invite collaborators
          </label>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter email address..."
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-workspace-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-workspace-400"
            />
            <select
              value={permission}
              onChange={e => setPermission(e.target.value as any)}
              className="px-2.5 py-2 text-xs border border-workspace-200 rounded-xl bg-white focus:outline-none text-workspace-700 cursor-pointer font-medium"
            >
              <option value="edit">Can edit</option>
              <option value="view">Can view</option>
            </select>
            <button
              type="submit"
              className="px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-medium transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Send size={12} />
              <span>Invite</span>
            </button>
          </div>
        </form>

        {/* People with Access */}
        <div className="mt-5">
          <div className="text-xs font-semibold text-workspace-700 mb-2">People with access</div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
                  T
                </div>
                <div>
                  <div className="text-xs font-semibold text-workspace-900">Tanvi (You)</div>
                  <div className="text-[11px] text-workspace-500">tanvi@syncspace.io</div>
                </div>
              </div>
              <span className="text-xs font-medium text-workspace-400">Owner</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  A
                </div>
                <div>
                  <div className="text-xs font-semibold text-workspace-900">Alex Rivera</div>
                  <div className="text-[11px] text-workspace-500">alex@syncspace.io</div>
                </div>
              </div>
              <span className="text-xs font-medium text-workspace-600">Can edit</span>
            </div>
          </div>
        </div>

        {/* General Link Access */}
        <div className="mt-5 pt-4 border-t border-workspace-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs">
              {isPublic ? (
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Globe size={14} />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-lg bg-workspace-100 text-workspace-600 flex items-center justify-center">
                  <Lock size={14} />
                </div>
              )}
              <div>
                <div className="font-semibold text-workspace-800">
                  {isPublic ? 'Anyone with the link' : 'Restricted'}
                </div>
                <div className="text-[11px] text-workspace-500">
                  {isPublic ? 'Anyone on the internet with this link can view' : 'Only invited members can access'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
            >
              {isPublic ? 'Make private' : 'Make public'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={window.location.href}
              className="flex-1 px-3 py-2 text-xs bg-workspace-50 border border-workspace-200 rounded-xl text-workspace-600 outline-none select-all truncate"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy link'}</span>
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

export default ShareModal;
