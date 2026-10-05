import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Copy,
  Check,
  Send,
  Loader2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import {
  shareDocumentApi,
  getDocumentSharesApi,
  updateSharePermissionApi,
  removeShareApi,
} from '../../lib/api/documents';
import type { DocumentPermission, DocumentShareInfo } from '../../types/dashboard';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId?: string;
  documentTitle?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  documentId,
  documentTitle = 'Untitled Document',
}: ShareModalProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [permission, setPermission] = useState<DocumentPermission>('VIEWER');
  const [shares, setShares] = useState<DocumentShareInfo[]>([]);
  const [isLoadingShares, setIsLoadingShares] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadShares = useCallback(async () => {
    if (!documentId) return;
    setIsLoadingShares(true);
    try {
      const data = await getDocumentSharesApi(documentId);
      setShares(data);
    } catch (err: any) {
      // If 403, current user is not owner
      console.warn('Could not load document shares:', err.message);
    } finally {
      setIsLoadingShares(false);
    }
  }, [documentId]);

  useEffect(() => {
    if (isOpen && documentId) {
      setEmailInput('');
      setError(null);
      setSuccess(null);
      void loadShares();
    }
  }, [isOpen, documentId, loadShares]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentId) return;
    const trimmedEmail = emailInput.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Please enter a recipient email address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await shareDocumentApi(documentId, trimmedEmail, permission);
      setSuccess(`Document shared with ${trimmedEmail} as ${permission === 'EDITOR' ? 'Editor' : 'Viewer'}.`);
      setEmailInput('');
      await loadShares();
    } catch (err: any) {
      setError(err.message || 'Failed to share document.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePermissionChange = async (targetUserId: string, newPermission: DocumentPermission) => {
    if (!documentId) return;
    setActionUserId(targetUserId);
    setError(null);
    setSuccess(null);
    try {
      await updateSharePermissionApi(documentId, targetUserId, newPermission);
      setShares((prev) =>
        prev.map((s) => (s.userId === targetUserId ? { ...s, permission: newPermission } : s))
      );
      setSuccess('Permission updated.');
    } catch (err: any) {
      setError(err.message || 'Failed to update permission.');
      await loadShares();
    } finally {
      setActionUserId(null);
    }
  };

  const handleRemoveShare = async (targetUserId: string, targetName: string) => {
    if (!documentId) return;
    if (!window.confirm(`Revoke access for ${targetName}?`)) return;

    setActionUserId(targetUserId);
    setError(null);
    setSuccess(null);
    try {
      await removeShareApi(documentId, targetUserId);
      setShares((prev) => prev.filter((s) => s.userId !== targetUserId));
      setSuccess(`Removed access for ${targetName}.`);
    } catch (err: any) {
      setError(err.message || 'Failed to remove share.');
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-fade-in"
        onClick={onClose}
      />
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

        {/* Feedback Alerts */}
        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 size={15} className="shrink-0" />
            <span className="flex-1">{success}</span>
          </div>
        )}

        {/* Share by Registered Email */}
        <form onSubmit={handleShare} className="mt-4">
          <label className="block text-xs font-semibold text-workspace-700 mb-1.5">
            Share with registered user
          </label>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="user@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              disabled={isSubmitting}
              className="flex-1 px-3 py-2 text-xs border border-workspace-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-workspace-400 disabled:opacity-60"
            />
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as DocumentPermission)}
              disabled={isSubmitting}
              className="px-2.5 py-2 text-xs border border-workspace-200 rounded-xl bg-white focus:outline-none text-workspace-700 cursor-pointer font-medium disabled:opacity-60"
            >
              <option value="VIEWER">Viewer</option>
              <option value="EDITOR">Editor</option>
            </select>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Send size={12} />
              )}
              <span>Share</span>
            </button>
          </div>
        </form>

        {/* People with Access */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-semibold text-workspace-700 mb-2">
            <span>People with access</span>
            {isLoadingShares && <Loader2 size={12} className="animate-spin text-workspace-400" />}
          </div>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {/* Owner Entry */}
            <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-workspace-50">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-workspace-900 truncate">
                    {user?.name || 'Owner'} (You)
                  </div>
                  <div className="text-[11px] text-workspace-500 truncate">{user?.email}</div>
                </div>
              </div>
              <span className="text-xs font-medium text-workspace-400 px-2 py-0.5 bg-workspace-100 rounded-md">
                Owner
              </span>
            </div>

            {/* Shared Users */}
            {shares.map((s) => {
              const isPending = actionUserId === s.userId;
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-workspace-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {s.user.name ? s.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-workspace-900 truncate">
                        {s.user.name}
                      </div>
                      <div className="text-[11px] text-workspace-500 truncate">{s.user.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <select
                      value={s.permission}
                      disabled={isPending}
                      onChange={(e) =>
                        handlePermissionChange(s.userId, e.target.value as DocumentPermission)
                      }
                      className="text-xs py-1 px-2 border border-workspace-200 rounded-lg bg-white text-workspace-700 font-medium cursor-pointer hover:border-workspace-300 disabled:opacity-50"
                    >
                      <option value="VIEWER">Viewer</option>
                      <option value="EDITOR">Editor</option>
                    </select>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleRemoveShare(s.userId, s.user.name)}
                      title="Remove access"
                      className="p-1.5 rounded-lg text-workspace-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isPending ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {shares.length === 0 && !isLoadingShares && (
              <p className="text-xs text-workspace-400 italic py-1 px-1.5">
                No other users have been granted access yet.
              </p>
            )}
          </div>
        </div>

        {/* General Link Copy */}
        <div className="mt-5 pt-4 border-t border-workspace-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-workspace-700 font-semibold">
              <Lock size={12} className="text-workspace-400" />
              <span>Workspace link</span>
            </div>
            <span className="text-[11px] text-workspace-400">Only invited users can access</span>
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
