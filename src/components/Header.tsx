import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Calendar, 
  Plus, 
  ChevronDown, 
  UserCheck, 
  Shield, 
  LogOut, 
  Code2, 
  FileText,
  Clock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const Header: React.FC<{ onToggleMobileSidebar: () => void }> = ({ onToggleMobileSidebar }) => {
  const { 
    currentUser, 
    users, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    switchRole, 
    searchQuery, 
    setSearchQuery,
    setIsNewCaseModalOpen,
    setIsBackendExplorerOpen,
    setSelectedCaseId,
    setActiveTab
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCaseFromNotif = (caseId?: string) => {
    if (caseId) {
      setSelectedCaseId(caseId);
      setActiveTab('cases');
      setIsNotifsOpen(false);
    }
  };

  return (
    <header 
      id="main-app-header"
      className="sticky top-0 z-30 h-16 sm:h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 shadow-xs"
    >
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap">
            Digital Legal Affairs Management System
          </h2>
          <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
            UoG Portal
          </span>
        </div>
      </div>

      {/* Center/Right: Search Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases, documents, officers, departments..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Register Case Action */}
        <button
          id="btn-register-case"
          onClick={() => setIsNewCaseModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Register Case</span>
          <span className="sm:hidden">New</span>
        </button>

        {/* Django Backend Inspector trigger */}
        <button
          id="btn-view-django-api"
          onClick={() => setIsBackendExplorerOpen(true)}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 transition-colors"
          title="View Python / Django REST Framework architecture"
        >
          <Code2 className="w-4 h-4 text-emerald-600" />
          <span>Django DRF Code</span>
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            id="btn-notifications-toggle"
            onClick={() => setIsNotifsOpen(!isNotifsOpen)}
            className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadNotifs.length}
              </span>
            )}
          </button>

          {isNotifsOpen && (
            <div 
              id="notifications-dropdown-menu"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                  {unreadNotifs.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 py-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.caseId) handleSelectCaseFromNotif(n.caseId);
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        n.read ? 'bg-slate-50/70 border-slate-100 text-slate-600' : 'bg-blue-50/50 border-blue-100/80 text-slate-900 font-medium'
                      } hover:bg-blue-50`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${n.read ? 'bg-slate-300' : 'bg-blue-600'}`} />
                          <h4 className="text-xs font-bold truncate">{n.title}</h4>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      {n.caseId && (
                        <div className="mt-2 flex items-center gap-1 text-[11px] text-blue-600 font-semibold">
                          <span>View Case {n.caseId}</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher */}
        <div className="relative" ref={profileRef}>
          <button
            id="btn-user-profile-menu"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-600/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>

            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1">
                {currentUser.name}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {currentUser.roleTitle}
              </div>
            </div>
          </button>

          {isProfileOpen && (
            <div
              id="user-profile-dropdown"
              className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              {/* Header Details */}
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-bold text-sm text-slate-900">{currentUser.name}</div>
                <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {currentUser.roleTitle}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {currentUser.campus}
                  </span>
                </div>
              </div>

              {/* Role Switcher Section */}
              <div className="py-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                  Switch Active Role Persona
                </div>

                <div className="space-y-1 mt-1">
                  <button
                    onClick={() => {
                      switchRole('legal_officer');
                      setIsProfileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentUser.role === 'legal_officer'
                        ? 'bg-blue-50 text-blue-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">Legal Officer</div>
                      <div className="text-[10px] text-slate-500">Abebe Kebede (Case Follow-up)</div>
                    </div>
                    {currentUser.role === 'legal_officer' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('admin');
                      setIsProfileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentUser.role === 'admin'
                        ? 'bg-blue-50 text-blue-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">Admin / Legal Affairs Head</div>
                      <div className="text-[10px] text-slate-500">Dr. Dawit Mengistu (Directorate)</div>
                    </div>
                    {currentUser.role === 'admin' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('user');
                      setIsProfileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentUser.role === 'user'
                        ? 'bg-blue-50 text-blue-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">University Staff / User</div>
                      <div className="text-[10px] text-slate-500">Almaz Tesfaye (Academic Dept)</div>
                    </div>
                    {currentUser.role === 'user' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('system_admin');
                      setIsProfileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentUser.role === 'system_admin'
                        ? 'bg-blue-50 text-blue-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">System Administrator</div>
                      <div className="text-[10px] text-slate-500">Biruk Haile (Accounts & Security)</div>
                    </div>
                    {currentUser.role === 'system_admin' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                </div>
              </div>

              {/* Bottom logout / reset */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Reset Demo Data & Reload</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
