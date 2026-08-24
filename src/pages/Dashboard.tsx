import React, { useState } from 'react';
import { MOCK_USERS, CURRENT_USER_ID } from '../data/mockData';
import { FileText, Plus, Search, MoreHorizontal, Star, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../hooks/useWorkspace';

export function Dashboard() {
  const currentUser = MOCK_USERS[CURRENT_USER_ID];
  const { documents, createDocument, deleteDocument, toggleFavorite } = useWorkspace();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateDocument = () => {
    const id = createDocument();
    navigate(`/workspace/${id}`);
  };

  const activeDocs = Object.values(documents).filter(doc => !doc.isDeleted);
  
  const filteredDocs = activeDocs.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort recent docs by a mock heuristic (just reversed for now to show latest)
  const recentDocs = [...filteredDocs].reverse();

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-semibold mb-8">Good afternoon, {currentUser.name}</h1>
        
        {/* Actions */}
        <div className="flex items-center space-x-4 mb-12">
          <button 
            onClick={handleCreateDocument}
            className="flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>New Document</span>
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-workspace-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..." 
              className="w-full pl-10 pr-4 py-2 border border-workspace-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 bg-workspace-50 hover:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Recent Documents */}
        <div>
          <h2 className="text-sm font-semibold text-workspace-500 uppercase tracking-wider mb-4">
            {searchQuery ? 'Search Results' : 'Recent Documents'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentDocs.length === 0 && (
              <div className="text-workspace-500 text-sm py-4">No documents found.</div>
            )}
            {recentDocs.map(doc => (
              <div 
                key={doc.id} 
                className="group block p-4 border border-workspace-200 rounded-lg hover:border-primary-300 hover:shadow-panel transition-all bg-white relative"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-workspace-100 rounded text-workspace-600 group-hover:text-primary-600 group-hover:bg-primary-50 transition-colors">
                    <FileText size={24} />
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(doc.id); }}
                      className={`p-1.5 rounded hover:bg-workspace-100 ${doc.isFavorite ? 'text-amber-400' : 'text-workspace-300 hover:text-workspace-700'}`}
                    >
                      <Star size={16} fill={doc.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteDocument(doc.id); }}
                      className="p-1.5 text-workspace-300 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <Link to={`/workspace/${doc.id}`} className="block">
                  <h3 className="font-medium text-workspace-900 mb-1 truncate">{doc.title}</h3>
                  <p className="text-xs text-workspace-500">Edited {doc.updatedAt}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
