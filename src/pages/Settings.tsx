import React from 'react';
import { User, Shield, Bell, HardDrive, Palette, Globe } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export function Settings() {
  const { user } = useAuth();

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-12 flex">
        {/* Settings Sidebar */}
        <div className="w-64 pr-8">
          <h1 className="text-2xl font-semibold mb-6">Settings</h1>
          <nav className="space-y-1">
            <SettingsTab icon={<User size={18} />} label="Profile" active />
            <SettingsTab icon={<Globe size={18} />} label="Workspace" />
            <SettingsTab icon={<Palette size={18} />} label="Theme" />
            <SettingsTab icon={<Bell size={18} />} label="Notifications" />
            <SettingsTab icon={<Shield size={18} />} label="Collaboration" />
            <SettingsTab icon={<HardDrive size={18} />} label="Storage & Sync" />
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 pl-8 border-l border-workspace-200 min-h-[500px]">
          <h2 className="text-lg font-medium mb-6 border-b border-workspace-200 pb-2">My Profile</h2>
          
          <div className="space-y-8">
            <div className="flex items-center space-x-6">
              <img 
                src={user?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}&backgroundColor=c0aede`} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full border border-workspace-200 bg-workspace-50"
              />
              <div>
                <button className="px-4 py-2 bg-white border border-workspace-300 rounded-md text-sm font-medium hover:bg-workspace-50 transition-colors shadow-sm">
                  Change Avatar
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-workspace-700 mb-1">Preferred Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.name || ''} 
                  className="w-full max-w-md px-3 py-2 border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-workspace-700 mb-1">Email</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || ''} 
                  className="w-full max-w-md px-3 py-2 border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-workspace-200">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                Update Profile
              </button>
            </div>
            
            {/* Storage Settings (Added for testing/resetting Phase 1 local storage) */}
            <div className="pt-8 border-t border-workspace-200 mt-8">
              <h3 className="text-md font-medium text-workspace-900 mb-4">Local Storage</h3>
              <p className="text-sm text-workspace-500 mb-4">
                Since we are in Phase 1 (Local-first demo), all your data is saved in your browser's Local Storage. 
                You can clear this data to reset the app to its initial mock state.
              </p>
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to reset all documents and canvas items? This action cannot be undone.')) {
                    localStorage.removeItem('syncspace_docs');
                    localStorage.removeItem('syncspace_blocks');
                    localStorage.removeItem('syncspace_canvas');
                    window.location.href = '/';
                  }
                }}
                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm font-medium hover:bg-red-100 transition-colors shadow-sm"
              >
                Reset All Local Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`
      flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors
      ${active ? 'bg-workspace-100 text-workspace-900' : 'text-workspace-600 hover:bg-workspace-50 hover:text-workspace-900'}
    `}>
      <span className={active ? 'text-workspace-900' : 'text-workspace-400'}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
