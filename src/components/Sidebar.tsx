import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Building2, 
  FileText, 
  CalendarDays, 
  BarChart3, 
  Bell, 
  Settings, 
  ShieldCheck, 
  HelpCircle, 
  GraduationCap,
  Scale,
  Code2,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC<{ isMobileOpen?: boolean; onCloseMobile?: () => void }> = ({ 
  isMobileOpen = false, 
  onCloseMobile 
}) => {
  const { activeTab, setActiveTab, notifications, currentUser, cases } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeCasesCount = cases.filter(c => c.status !== 'Closed').length;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'legal_officer', 'user', 'system_admin']
    },
    {
      id: 'cases',
      label: 'Cases',
      icon: Briefcase,
      badge: activeCasesCount > 0 ? `${activeCasesCount}` : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-300',
      hasSub: true,
      roles: ['admin', 'legal_officer', 'user', 'system_admin']
    },
    {
      id: 'officers',
      label: 'Legal Officers',
      icon: Users,
      roles: ['admin', 'legal_officer', 'system_admin']
    },
    {
      id: 'scholarships',
      label: 'Scholarship Agreements',
      icon: GraduationCap,
      badge: 'Bonds',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
      roles: ['admin', 'legal_officer', 'user', 'system_admin']
    },
    {
      id: 'departments',
      label: 'Departments',
      icon: Building2,
      roles: ['admin', 'legal_officer', 'system_admin']
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      roles: ['admin', 'legal_officer', 'user', 'system_admin']
    },
    {
      id: 'hearings',
      label: 'Hearings & Meetings',
      icon: CalendarDays,
      roles: ['admin', 'legal_officer', 'user', 'system_admin']
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      roles: ['admin', 'legal_officer', 'system_admin']
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
      badgeColor: 'bg-amber-400 text-slate-950 font-bold',
      roles: ['admin', 'legal_officer', 'user', 'system_admin']
    },
    {
      id: 'backend_code',
      label: 'Django Backend API',
      icon: Code2,
      badge: 'DRF',
      badgeColor: 'bg-indigo-400/30 text-indigo-200 text-[10px]',
      roles: ['admin', 'legal_officer', 'user', 'system_admin']
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      roles: ['admin', 'system_admin', 'legal_officer', 'user']
    },
    {
      id: 'audit_logs',
      label: 'Audit Logs',
      icon: ShieldCheck,
      roles: ['admin', 'system_admin']
    },
    {
      id: 'help',
      label: 'Help & Docs',
      icon: HelpCircle,
      roles: ['admin', 'legal_officer', 'user', 'system_admin']
    }
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside 
      id="sidebar-container"
      className={`fixed inset-y-0 left-0 z-40 w-64 md:w-72 bg-[#0a1931] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl border-r border-[#1e3256] ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Top Header Branding */}
      <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-[#182a4d]">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
          <div className="w-full h-full bg-[#0a1931] rounded-[10px] flex items-center justify-center border border-amber-400/40">
            <Scale className="w-6 h-6 text-amber-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xs font-bold tracking-wider uppercase text-amber-400 leading-tight truncate">
            UNIVERSITY OF GONDAR
          </h1>
          <p className="text-sm font-semibold text-slate-100 truncate">
            Legal Affairs Office
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-[#13284c] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {item.badge && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                {item.hasSub && (
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isActive ? 'rotate-90 text-white' : ''}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Lower Banner / Philosophy Card */}
      <div className="p-4 border-t border-[#182a4d]">
        <div className="bg-gradient-to-b from-[#102445] to-[#0d1e3a] p-3.5 rounded-2xl border border-blue-500/20 text-center relative overflow-hidden shadow-inner">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <Scale className="w-5 h-5" />
          </div>
          
          <h4 className="text-xs font-bold tracking-wide text-amber-300 mb-1">
            Integrity. Justice. Service.
          </h4>
          <p className="text-[11px] text-slate-300 leading-snug">
            Upholding the law, protecting the university.
          </p>
        </div>

        {/* System copyright */}
        <div className="mt-3 text-center">
          <p className="text-[10px] text-slate-500">
            © 2025 University of Gondar. All rights reserved.
          </p>
        </div>
      </div>
    </aside>
  );
};
