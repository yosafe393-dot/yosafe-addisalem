import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { CasesView } from './components/CasesView';
import { LegalOfficersView } from './components/LegalOfficersView';
import { ScholarshipAgreementsView } from './components/ScholarshipAgreementsView';
import { DepartmentsCampusesView } from './components/DepartmentsCampusesView';
import { DocumentsView } from './components/DocumentsView';
import { HearingsCalendarView } from './components/HearingsCalendarView';
import { ReportsView } from './components/ReportsView';
import { NotificationsView } from './components/NotificationsView';
import { AdminUserManagementView } from './components/AdminUserManagementView';
import { AuditLogsView } from './components/AuditLogsView';
import { HelpView } from './components/HelpView';
import { DjangoBackendView } from './components/DjangoBackendView';
import { CaseDetailsModal } from './components/CaseDetailsModal';
import { NewCaseModal } from './components/NewCaseModal';
import { DjangoBackendExplorerModal } from './components/DjangoBackendExplorerModal';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'cases':
        return <CasesView />;
      case 'officers':
        return <LegalOfficersView />;
      case 'scholarships':
        return <ScholarshipAgreementsView />;
      case 'departments':
        return <DepartmentsCampusesView />;
      case 'documents':
        return <DocumentsView />;
      case 'hearings':
        return <HearingsCalendarView />;
      case 'reports':
        return <ReportsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <AdminUserManagementView />;
      case 'audit_logs':
        return <AuditLogsView />;
      case 'help':
        return <HelpView />;
      case 'backend_code':
        return <DjangoBackendView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 flex">
      {/* Backdrop for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 z-30 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Persistent Left Sidebar */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onCloseMobile={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 lg:pl-72 min-w-0">
        {/* Top Navbar */}
        <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        {/* Dynamic Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <CaseDetailsModal />
      <NewCaseModal />
      <DjangoBackendExplorerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
