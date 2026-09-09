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
  LayoutGrid,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useAuth } from '../../auth/AuthContext';

export function Sidebar() {
  const { user, logout } = useAuth();
  const { documents } = useWorkspace();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const allDocs = Object.values(documents);
  const activeDocs = allDocs.filter(d => !d.isDeleted);
  const favorites = activeDocs.filter(d => d.isFavorite);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-workspace-50 border-r border-workspace-200 flex flex-col h-full overflow-y-auto relative select-none font-sans shrink-0">
      {/* Workspace Switcher */}
      <div
        className="p-4 flex items-center justify-between hover:bg-workspace-100 cursor-pointer transition-colors relative"
        onClick={() => setShowProfileMenu(!showProfileMenu)}
      >
        <div className="flex items-center space-x-3 min-w-0">
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'Tanvi'}&backgroundColor=c0aede`}
            alt="Avatar"
            className="w-7 h-7 rounded-md bg-workspace-200 shrink-0"
          />
          <span className="font-semibold text-sm truncate text-workspace-900">
            {user?.name || 'Tanvi'}'s Workspace
          </span>
        </div>
        <ChevronDown size={16} className="text-workspace-400 shrink-0" />
      </div>

      {showProfileMenu && (
        <div className="absolute top-14 left-4 right-4 bg-white border border-workspace-200 rounded-xl shadow-dropdown z-50 py-1 animate-fade-in">
          <div className="px-3 py-2 border-b border-workspace-100">
            <p className="text-sm font-medium text-workspace-900">{user?.name || 'Tanvi'}</p>
            <p className="text-xs text-workspace-500 truncate">{user?.email || 'tanvi@syncspace.io'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors cursor-pointer"
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

        <div className="mb-6 space-y-1">
          <SidebarItem
            icon={<Star size={18} />}
            label="Favorites"
            to="/dashboard?filter=favorites"
            badge={
              favorites.length > 0 ? (
                <div className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-workspace-200 text-workspace-600">
                  {favorites.length}
                </div>
              ) : null
            }
          />
          <SidebarItem icon={<Users size={18} />} label="Shared With Me" to="/dashboard?filter=shared" />
          <SidebarItem icon={<Clock size={18} />} label="Recent Activity" to="/dashboard?filter=recent" />
          <SidebarItem icon={<Trash2 size={18} />} label="Trash" to="/dashboard?filter=trash" />
        </div>

        {favorites.length > 0 && (
          <div className="mb-6">
            <div className="text-xs font-semibold text-workspace-400 uppercase tracking-wider mb-2 px-2">
              Pinned & Starred
            </div>
            <div className="space-y-1">
              {favorites.map(doc => (
                <SidebarItem
                  key={doc.id}
                  icon={doc.type === 'canvas' ? <LayoutGrid size={18} /> : <FileText size={18} />}
                  label={doc.title}
                  to={`/workspace/${doc.id}`}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  to,
  badge
}: {
  icon: React.ReactNode;
  label: string;
  to?: string;
  badge?: React.ReactNode;
}) {
  if (to) {
    const isActiveURL = new URLSearchParams(window.location.search).get('filter');
    const isDashboard = window.location.pathname === '/dashboard';
    const toFilter = new URLSearchParams(to.split('?')[1] || '').get('filter');

    let active = false;
    if (to === '/dashboard') active = isDashboard && (!isActiveURL || isActiveURL === 'all');
    else if (to.startsWith('/dashboard?filter=')) active = isDashboard && isActiveURL === toFilter;
    else active = window.location.pathname.startsWith(to);

    return (
      <NavLink
        to={to}
        className={() => `
          flex items-center px-2.5 py-2 rounded-lg text-sm transition-colors justify-between
          ${active ? 'bg-workspace-200 text-workspace-900 font-semibold' : 'text-workspace-600 hover:bg-workspace-100 hover:text-workspace-900'}
        `}
      >
        <div className="flex items-center space-x-2.5 flex-1 min-w-0">
          <span className="text-workspace-400">{icon}</span>
          <span className="truncate">{label}</span>
        </div>
        {badge && <span>{badge}</span>}
      </NavLink>
    );
  }

  return (
    <div className="flex items-center px-2.5 py-2 rounded-lg text-sm text-workspace-600 hover:bg-workspace-100 hover:text-workspace-900 cursor-pointer transition-colors justify-between">
      <div className="flex items-center space-x-2.5 flex-1 min-w-0">
        <span className="text-workspace-400">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      {badge && <span>{badge}</span>}
    </div>
  );
}

export default Sidebar;
