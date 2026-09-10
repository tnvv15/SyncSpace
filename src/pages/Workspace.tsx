import React from 'react';
import { useOutletContext, useParams, Navigate } from 'react-router-dom';
import { TopBar } from '../components/layout/TopBar';
import { Editor } from '../components/document/Editor';
import { CanvasBoard } from '../components/canvas/CanvasBoard';
import { useWorkspace } from '../hooks/useWorkspace';
import { FileText, Maximize, Download, FileIcon } from 'lucide-react';

export function Workspace() {
  const { id } = useParams<{ id: string }>();
  const workspaceState = useOutletContext<ReturnType<typeof useWorkspace>>();
  const { documents, setCurrentDocId } = workspaceState;
  const doc = id ? documents[id] : undefined;
  const type = doc?.type || 'doc'; // Default to doc if not found

  React.useEffect(() => {
    if (id) {
      setCurrentDocId(id);
    }
    return () => {
      setCurrentDocId(null);
    };
  }, [id, setCurrentDocId]);

  if (!id) return <Navigate to="/dashboard" replace />;
  if (!doc) return <div className="flex items-center justify-center h-full text-workspace-500">Loading document...</div>;

  return (
    <div className="flex flex-col h-full bg-white relative">
      {type !== 'doc' && type!=='canvas' &&(
      <TopBar workspaceState={workspaceState} />
)}
      
      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {type === 'file' ? (
          <div className="flex flex-col items-center justify-center h-full bg-workspace-50 p-8">
            <div className="bg-white p-8 rounded-xl border border-workspace-200 shadow-sm max-w-2xl w-full text-center">
              {doc.fileData?.mimeType.startsWith('image/') && doc.fileData.blobUrl ? (
                <img src={doc.fileData.blobUrl} alt={doc.title} className="max-h-96 mx-auto rounded-lg mb-6 shadow-sm border border-workspace-100" />
              ) : (
                <div className="w-24 h-24 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileIcon size={48} />
                </div>
              )}
              <h2 className="text-2xl font-bold text-workspace-900 mb-2">{doc.title}</h2>
              <p className="text-workspace-500 mb-8">
                {doc.fileData?.mimeType || 'Unknown format'} &bull; {doc.fileData?.size ? (doc.fileData.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'}
              </p>
              
              {doc.fileData?.blobUrl && (
                <a 
                  href={doc.fileData.blobUrl}
                  download={doc.fileData.name}
                  className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  <Download size={20} />
                  <span>Download File</span>
                </a>
              )}
            </div>
          </div>
        ) : type === 'doc' ? (
          <Editor workspaceState={workspaceState} />
        ) : (
          <CanvasBoard workspaceState={workspaceState} />
        )}
      </div>
    </div>
  );
}
