import React, { useState, useEffect } from 'react';
import { User, Globe, Palette, Bell, Shield, HardDrive, Keyboard, Info, ChevronDown, Trash2, Lock, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

type TabType = 'profile' | 'workspace' | 'appearance' | 'notifications' | 'collaboration' | 'storage' | 'security' | 'shortcuts' | 'about';

export function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [preferredName, setPreferredName] = useState(user?.name || 'Tanvi');
  const [email, setEmail] = useState(user?.email || 'tanvi@syncspace.dev');
  const [theme, setTheme] = useState('Light');
  const [language, setLanguage] = useState('English');
  const [defaultView, setDefaultView] = useState('Grid');
  const [fontSize, setFontSize] = useState('Medium');
  const [autoSave, setAutoSave] = useState(true);
  const [showTips, setShowTips] = useState(true);
  const [storageUsed, setStorageUsed] = useState(125);
  const [storageTotal] = useState(1024);
  const [accentColor, setAccentColor] = useState('primary');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [syncFrequency, setSyncFrequency] = useState('real-time');

  // Calculate local storage usage
  useEffect(() => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          total += key.length + value.length;
        }
      }
    }
    // Convert to MB (roughly)
    setStorageUsed(Math.round(total / 1024 / 1024));
  }, []);

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all locally stored data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const tabs = [
    { id: 'profile' as TabType, icon: <User size={18} />, label: 'My Profile' },
    { id: 'workspace' as TabType, icon: <Globe size={18} />, label: 'Workspace' },
    { id: 'appearance' as TabType, icon: <Palette size={18} />, label: 'Appearance' },
    { id: 'notifications' as TabType, icon: <Bell size={18} />, label: 'Notifications' },
    { id: 'collaboration' as TabType, icon: <Shield size={18} />, label: 'Collaboration' },
    { id: 'storage' as TabType, icon: <HardDrive size={18} />, label: 'Storage & Sync' },
    { id: 'security' as TabType, icon: <Shield size={18} />, label: 'Security' },
    { id: 'shortcuts' as TabType, icon: <Keyboard size={18} />, label: 'Shortcuts' },
    { id: 'about' as TabType, icon: <Info size={18} />, label: 'About' },
  ];

  return (
    <div className="flex-1 bg-workspace-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-8 py-12 flex gap-8">
        {/* Settings Sidebar */}
        <div className="w-72 flex-shrink-0">
          {/* SyncSpace Branding */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-semibold text-workspace-900">SyncSpace</span>
            </div>
          </div>

          <nav className="space-y-1">
            {tabs.map((tab) => (
              <SettingsTab
                key={tab.id}
                icon={tab.icon}
                label={tab.label}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 min-h-[600px]">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-workspace-900 mb-4">My Profile</h2>

              {/* User Profile Section */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={user?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name}&backgroundColor=c0aede`} 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-full border-2 border-workspace-200 bg-workspace-50"
                    />
                    <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-1.5 rounded-full hover:bg-primary-700 transition-colors shadow-sm">
                      <User size={14} />
                    </button>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-workspace-700 mb-1">Preferred Name</label>
                      <input 
                        type="text" 
                        value={preferredName}
                        onChange={(e) => setPreferredName(e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="block text-xs font-medium text-workspace-700 mb-1">Email</label>
                      <div className="flex gap-2">
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                        />
                        <button className="px-3 py-1.5 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm whitespace-nowrap">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Storage & Preferences Combined */}
              <div className="grid grid-cols-2 gap-4">
                {/* Local Storage Section */}
                <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-workspace-900">Local Storage</h3>
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-workspace-600 mb-1">
                      <span>{storageUsed} MB of {storageTotal} MB</span>
                    </div>
                    <div className="w-full bg-workspace-200 rounded-full h-1.5">
                      <div 
                        className="bg-primary-600 h-1.5 rounded-full transition-all" 
                        style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
                      />
                    </div>
                  </div>

                  <button className="w-full px-3 py-1.5 bg-white border border-workspace-300 rounded-md text-xs font-medium hover:bg-workspace-50 transition-colors shadow-sm">
                    Manage Data
                  </button>
                </div>

                {/* Quick Preferences */}
                <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                  <h3 className="text-sm font-medium text-workspace-900 mb-3">Quick Preferences</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-workspace-700">Theme</span>
                      <select 
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="text-xs px-2 py-1 border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 bg-white"
                      >
                        <option>Light</option>
                        <option>Dark</option>
                        <option>System</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-workspace-700">Language</span>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="text-xs px-2 py-1 border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 bg-white"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-workspace-700">Auto Save</span>
                      <ToggleSwitch enabled={autoSave} onChange={setAutoSave} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-workspace-700">Show Tips</span>
                      <ToggleSwitch enabled={showTips} onChange={setShowTips} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 rounded-lg border border-red-200 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-red-900">Reset All Local Data</p>
                  </div>
                  <button 
                    onClick={handleResetData}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-workspace-900 mb-4">Workspace</h2>

              {/* Workspace Settings */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <h3 className="text-sm font-medium text-workspace-900 mb-3">Workspace Settings</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-workspace-700 mb-1">Workspace Name</label>
                    <input 
                      type="text" 
                      defaultValue="My Workspace"
                      className="w-full max-w-md px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-workspace-700 mb-1">Default View</label>
                    <select 
                      value={defaultView}
                      onChange={(e) => setDefaultView(e.target.value)}
                      className="w-full max-w-md px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 bg-white"
                    >
                      <option>Grid</option>
                      <option>List</option>
                      <option>Board</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Show Sidebar</span>
                      <p className="text-xs text-workspace-500">Display the navigation sidebar</p>
                    </div>
                    <ToggleSwitch enabled={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Compact Mode</span>
                      <p className="text-xs text-workspace-500">Use smaller UI elements</p>
                    </div>
                    <ToggleSwitch enabled={false} onChange={() => {}} />
                  </div>
                </div>
              </div>

              {/* Workspace Stats */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <h3 className="text-sm font-medium text-workspace-900 mb-3">Workspace Statistics</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-primary-600">12</p>
                    <p className="text-xs text-workspace-500">Documents</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-primary-600">48</p>
                    <p className="text-xs text-workspace-500">Canvas Items</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-primary-600">3</p>
                    <p className="text-xs text-workspace-500">Collaborators</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-workspace-900 mb-4">Appearance</h2>

              {/* Theme Settings */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Palette size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Theme Settings</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-workspace-700 mb-1">Color Theme</label>
                    <select 
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full max-w-md px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 bg-white"
                    >
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-workspace-700 mb-1">Accent Color</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setAccentColor('primary')}
                        className={`w-8 h-8 rounded-full bg-primary-600 border-2 ${accentColor === 'primary' ? 'border-primary-300' : 'border-transparent hover:border-primary-300'}`}
                      />
                      <button 
                        onClick={() => setAccentColor('blue')}
                        className={`w-8 h-8 rounded-full bg-blue-500 border-2 ${accentColor === 'blue' ? 'border-blue-300' : 'border-transparent hover:border-blue-300'}`}
                      />
                      <button 
                        onClick={() => setAccentColor('purple')}
                        className={`w-8 h-8 rounded-full bg-purple-500 border-2 ${accentColor === 'purple' ? 'border-purple-300' : 'border-transparent hover:border-purple-300'}`}
                      />
                      <button 
                        onClick={() => setAccentColor('green')}
                        className={`w-8 h-8 rounded-full bg-green-500 border-2 ${accentColor === 'green' ? 'border-green-300' : 'border-transparent hover:border-green-300'}`}
                      />
                      <button 
                        onClick={() => setAccentColor('orange')}
                        className={`w-8 h-8 rounded-full bg-orange-500 border-2 ${accentColor === 'orange' ? 'border-orange-300' : 'border-transparent hover:border-orange-300'}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Reduce Animations</span>
                      <p className="text-xs text-workspace-500">Minimize motion effects</p>
                    </div>
                    <ToggleSwitch enabled={false} onChange={() => {}} />
                  </div>
                </div>
              </div>

              {/* Font Settings */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Font Settings</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-workspace-700 mb-1">Font Size</label>
                    <select 
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      className="w-full max-w-md px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 bg-white"
                    >
                      <option>Small</option>
                      <option>Medium</option>
                      <option>Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-workspace-700 mb-1">Font Family</label>
                    <select 
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full max-w-md px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 bg-white"
                    >
                      <option>Inter</option>
                      <option>Geist</option>
                      <option>System UI</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-workspace-900 mb-4">Notifications</h2>

              {/* Notification Preferences */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Bell size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Notification Preferences</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Email Notifications</span>
                      <p className="text-xs text-workspace-500">Receive updates via email</p>
                    </div>
                    <ToggleSwitch enabled={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Push Notifications</span>
                      <p className="text-xs text-workspace-500">Browser push notifications</p>
                    </div>
                    <ToggleSwitch enabled={false} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Collaboration Alerts</span>
                      <p className="text-xs text-workspace-500">When others edit your documents</p>
                    </div>
                    <ToggleSwitch enabled={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Weekly Summary</span>
                      <p className="text-xs text-workspace-500">Weekly activity digest</p>
                    </div>
                    <ToggleSwitch enabled={false} onChange={() => {}} />
                  </div>
                </div>
              </div>

              {/* Notification Schedule */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Quiet Hours</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Enable Quiet Hours</span>
                      <p className="text-xs text-workspace-500">Pause notifications during specific times</p>
                    </div>
                    <ToggleSwitch enabled={false} onChange={() => {}} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-workspace-700 mb-1">Start Time</label>
                      <input type="time" defaultValue="22:00" className="w-full px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-workspace-700 mb-1">End Time</label>
                      <input type="time" defaultValue="08:00" className="w-full px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'collaboration' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-workspace-900 mb-4">Collaboration</h2>

              {/* Real-time Sync */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <HardDrive size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Real-time Sync</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Auto-sync</span>
                      <p className="text-xs text-workspace-500">Automatically sync changes</p>
                    </div>
                    <ToggleSwitch enabled={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Show Cursors</span>
                      <p className="text-xs text-workspace-500">Display other users' cursors</p>
                    </div>
                    <ToggleSwitch enabled={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Presence Indicators</span>
                      <p className="text-xs text-workspace-500">Show who's viewing documents</p>
                    </div>
                    <ToggleSwitch enabled={true} onChange={() => {}} />
                  </div>
                </div>
              </div>

              {/* Sharing Settings */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Sharing Settings</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-workspace-700 mb-1">Default Permission</label>
                    <select className="w-full max-w-md px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 bg-white">
                      <option>View Only</option>
                      <option>Comment</option>
                      <option>Edit</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Require Approval</span>
                      <p className="text-xs text-workspace-500">Ask before sharing access</p>
                    </div>
                    <ToggleSwitch enabled={false} onChange={() => {}} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-workspace-900 mb-4">Storage & Sync</h2>

              {/* Storage Overview */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <HardDrive size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Storage Overview</h3>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-workspace-600 mb-1">
                    <span>{storageUsed} MB of {storageTotal} MB used</span>
                    <span>{Math.round((storageUsed / storageTotal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-workspace-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all" 
                      style={{ width: `${(storageUsed / storageTotal) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-semibold text-workspace-900">8</p>
                    <p className="text-xs text-workspace-500">Documents</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-workspace-900">32</p>
                    <p className="text-xs text-workspace-500">Images</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-workspace-900">85</p>
                    <p className="text-xs text-workspace-500">MB Other</p>
                  </div>
                </div>
              </div>

              {/* Sync Settings */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Sync Settings</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Offline Mode</span>
                      <p className="text-xs text-workspace-500">Work without internet connection</p>
                    </div>
                    <ToggleSwitch enabled={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-workspace-900">Background Sync</span>
                      <p className="text-xs text-workspace-500">Sync when app is closed</p>
                    </div>
                    <ToggleSwitch enabled={false} onChange={() => {}} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-workspace-700 mb-1">Sync Frequency</label>
                    <select 
                      value={syncFrequency}
                      onChange={(e) => setSyncFrequency(e.target.value)}
                      className="w-full max-w-md px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500 bg-white"
                    >
                      <option value="real-time">Real-time</option>
                      <option value="5min">Every 5 minutes</option>
                      <option value="15min">Every 15 minutes</option>
                      <option value="manual">Manual only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Trash2 size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Data Management</h3>
                </div>
                
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-white border border-workspace-300 rounded-md text-xs font-medium hover:bg-workspace-50 transition-colors shadow-sm text-left">
                    Export All Data
                  </button>
                  <button className="w-full px-3 py-2 bg-white border border-workspace-300 rounded-md text-xs font-medium hover:bg-workspace-50 transition-colors shadow-sm text-left">
                    Clear Cache
                  </button>
                  <button 
                    onClick={handleResetData}
                    className="w-full px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md text-xs font-medium hover:bg-red-100 transition-colors shadow-sm text-left"
                  >
                    Reset All Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-workspace-900 mb-4">Security</h2>

              {/* Password Settings */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Password</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-workspace-700 mb-1">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full max-w-md px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-workspace-700 mb-1">New Password</label>
                    <input type="password" placeholder="Enter new password" className="w-full max-w-md px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-workspace-700 mb-1">Confirm Password</label>
                    <input type="password" placeholder="Confirm new password" className="w-full max-w-md px-2 py-1.5 text-sm border border-workspace-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500" />
                  </div>
                  <button className="px-3 py-1.5 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Two-Factor Authentication</h3>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-workspace-900">2FA is currently disabled</p>
                    <p className="text-xs text-workspace-500">Add an extra layer of security</p>
                  </div>
                  <button className="px-3 py-1.5 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                    Enable
                  </button>
                </div>
              </div>

              {/* Session Management */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Active Sessions</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-workspace-50 rounded-md">
                    <div>
                      <p className="text-xs font-medium text-workspace-900">Current Session</p>
                      <p className="text-xs text-workspace-500">Chrome on Windows • Active now</p>
                    </div>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Current</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-workspace-50 rounded-md">
                    <div>
                      <p className="text-xs font-medium text-workspace-900">Chrome on Mac</p>
                      <p className="text-xs text-workspace-500">Last active 2 hours ago</p>
                    </div>
                    <button className="text-xs text-red-600 hover:text-red-700">Revoke</button>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <LogOut size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Account Actions</h3>
                </div>
                
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-white border border-workspace-300 rounded-md text-xs font-medium hover:bg-workspace-50 transition-colors shadow-sm text-left">
                    Sign out all devices
                  </button>
                  <button className="w-full px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md text-xs font-medium hover:bg-red-100 transition-colors shadow-sm text-left">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-workspace-900 mb-4">Shortcuts</h2>

              {/* Keyboard Shortcuts */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Keyboard size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">Keyboard Shortcuts</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-workspace-100">
                    <span className="text-xs text-workspace-700">New Document</span>
                    <kbd className="px-2 py-1 bg-workspace-100 border border-workspace-300 rounded text-xs text-workspace-600">Ctrl + N</kbd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-workspace-100">
                    <span className="text-xs text-workspace-700">Save</span>
                    <kbd className="px-2 py-1 bg-workspace-100 border border-workspace-300 rounded text-xs text-workspace-600">Ctrl + S</kbd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-workspace-100">
                    <span className="text-xs text-workspace-700">Undo</span>
                    <kbd className="px-2 py-1 bg-workspace-100 border border-workspace-300 rounded text-xs text-workspace-600">Ctrl + Z</kbd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-workspace-100">
                    <span className="text-xs text-workspace-700">Redo</span>
                    <kbd className="px-2 py-1 bg-workspace-100 border border-workspace-300 rounded text-xs text-workspace-600">Ctrl + Y</kbd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-workspace-100">
                    <span className="text-xs text-workspace-700">Find</span>
                    <kbd className="px-2 py-1 bg-workspace-100 border border-workspace-300 rounded text-xs text-workspace-600">Ctrl + F</kbd>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-workspace-700">Settings</span>
                    <kbd className="px-2 py-1 bg-workspace-100 border border-workspace-300 rounded text-xs text-workspace-600">Ctrl + ,</kbd>
                  </div>
                </div>
              </div>

              {/* Custom Shortcuts */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <h3 className="text-sm font-medium text-workspace-900 mb-3">Custom Shortcuts</h3>
                
                <button className="px-3 py-1.5 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm">
                  Add Custom Shortcut
                </button>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-workspace-900 mb-4">About</h2>

              {/* App Info */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={16} className="text-workspace-600" />
                  <h3 className="text-sm font-medium text-workspace-900">App Information</h3>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-workspace-900">SyncSpace</h3>
                    <p className="text-xs text-workspace-500">Version 1.0.0</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-workspace-600">
                  <p>A collaborative workspace for real-time document editing and canvas-based brainstorming.</p>
                  <p>Built with React, TypeScript, and Y.js for seamless real-time collaboration.</p>
                </div>
              </div>

              {/* Links */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <h3 className="text-sm font-medium text-workspace-900 mb-3">Links</h3>
                
                <div className="space-y-2">
                  <a href="#" className="block text-xs text-primary-600 hover:text-primary-700">Documentation</a>
                  <a href="#" className="block text-xs text-primary-600 hover:text-primary-700">Privacy Policy</a>
                  <a href="#" className="block text-xs text-primary-600 hover:text-primary-700">Terms of Service</a>
                  <a href="#" className="block text-xs text-primary-600 hover:text-primary-700">Support</a>
                  <a href="#" className="block text-xs text-primary-600 hover:text-primary-700">GitHub Repository</a>
                </div>
              </div>

              {/* Credits */}
              <div className="bg-white rounded-lg border border-workspace-200 p-4 shadow-sm">
                <h3 className="text-sm font-medium text-workspace-900 mb-3">Open Source Credits</h3>
                
                <div className="space-y-1 text-xs text-workspace-600">
                  <p>React 18.3.1</p>
                  <p>TypeScript 5.7.2</p>
                  <p>Y.js 13.6.23</p>
                  <p>Tailwind CSS 3.4.17</p>
                  <p>Lucide React 1.16.0</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`
      flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors
      ${active ? 'bg-primary-100 text-primary-900' : 'text-workspace-600 hover:bg-workspace-100 hover:text-workspace-900'}
    `}>
      <span className={active ? 'text-primary-700' : 'text-workspace-400'}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function ToggleSwitch({ enabled, onChange }: { enabled: boolean, onChange: (enabled: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-primary-600' : 'bg-workspace-300'}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}
