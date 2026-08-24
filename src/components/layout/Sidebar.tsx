import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Home, 
  Clock, 
  Star, 
  Users, 
  Settings, 
  Trash2,
  FileText,
  PlusCircle,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useAuth } from '../../auth/AuthContext';

export function Sidebar() {
  const { user, logout } = useAuth();
  const { documents, createDocument } = useWorkspace();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const allDocs = Object.values(documents);
  const activeDocs = allDocs.filter(d => !d.isDeleted);
  const favorites = activeDocs.filter(d => d.isFavorite);
  const recent = [...activeDocs].reverse().slice(0, 5); // Mock recent logic
  const trashed = allDocs.filter(d => d.isDeleted);

  const handleCreate = () => {
    const id = createDocument();
    navigate(`/workspace/${id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-workspace-50 border-r border-workspace-200 flex flex-col h-full overflow-y-auto relative">
      {/* Workspace Switcher */}
      <div 
        className="p-4 flex items-center justify-between hover:bg-workspace-100 cursor-pointer transition-colors relative"
        onClick={() => setShowProfileMenu(!showProfileMenu)}
      >
        <div className="flex items-center space-x-3">
          <img src={user?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}&backgroundColor=c0aede`} alt="Avatar" className="w-6 h-6 rounded-md bg-workspace-200" />
          <span className="font-semibold text-sm truncate">{user?.name || 'Guest'}'s Workspace</span>
        </div>
        <ChevronDown size={16} className="text-workspace-400" />
      </div>

      {showProfileMenu && (
        <div className="absolute top-14 left-4 right-4 bg-white border border-workspace-200 rounded-md shadow-panel z-50 py-1">
          <div className="px-3 py-2 border-b border-workspace-100">
            <p className="text-sm font-medium text-workspace-900">{user?.name}</p>
            <p className="text-xs text-workspace-500 truncate">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      )}

      <div className="px-3 pb-2 flex-1 flex flex-col">
        <div className="space-y-1 mb-6">
          <SidebarItem icon={<Search size={18} />} label="Search" />
          <SidebarItem icon={<Home size={18} />} label="Dashboard" to="/dashboard" />
          <SidebarItem icon={<Settings size={18} />} label="Settings" to="/settings" />
        </div>

        {favorites.length > 0 && (
          <div className="mb-6">
            <div className="text-xs font-semibold text-workspace-400 uppercase tracking-wider mb-2 px-2">
              Favorites
            </div>
            <div className="space-y-1">
              {favorites.map(doc => (
                <SidebarItem 
                  key={doc.id} 
                  icon={<FileText size={18} />} 
                  label={doc.title} 
                  to={`/workspace/${doc.id}`} 
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="text-xs font-semibold text-workspace-400 uppercase tracking-wider mb-2 px-2 flex justify-between items-center group cursor-pointer" onClick={handleCreate}>
            <span>Recent</span>
            <PlusCircle size={14} className="opacity-0 group-hover:opacity-100 hover:text-primary-600 transition-all" />
          </div>
          <div className="space-y-1">
            {recent.map(doc => (
              <SidebarItem 
                key={doc.id} 
                icon={<FileText size={18} />} 
                label={doc.title} 
                to={`/workspace/${doc.id}`} 
              />
            ))}
          </div>
        </div>

        <div className="space-y-1 mt-auto">
          {trashed.length > 0 && (
            <div className="mb-2">
               <div className="text-xs font-semibold text-workspace-400 uppercase tracking-wider mb-2 px-2">Trash</div>
               <div className="space-y-1 max-h-32 overflow-y-auto">
                 {trashed.map(doc => (
                    <SidebarItem 
                      key={doc.id} 
                      icon={<Trash2 size={18} />} 
                      label={doc.title} 
                      to={`/workspace/${doc.id}`} 
                    />
                 ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, to }: { icon: React.ReactNode, label: string, to?: string }) {
  if (to) {
    return (
      <NavLink 
        to={to}
        className={({ isActive }) => `
          flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm transition-colors
          ${isActive ? 'bg-workspace-200 text-workspace-900 font-medium' : 'text-workspace-600 hover:bg-workspace-100 hover:text-workspace-900'}
        `}
      >
        <span className="text-workspace-400">{icon}</span>
        <span className="truncate">{label}</span>
      </NavLink>
    );
  }

  return (
    <div className="flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm text-workspace-600 hover:bg-workspace-100 hover:text-workspace-900 cursor-pointer transition-colors">
      <span className="text-workspace-400">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}
