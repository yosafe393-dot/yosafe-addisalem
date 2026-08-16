import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LegalCase, 
  User, 
  UserRole, 
  ScholarshipAgreement, 
  SystemNotification, 
  AuditLog, 
  Hearing, 
  CaseDocument,
  CaseStatus,
  CasePriority,
  Campus,
  CaseCategory
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_CASES, 
  INITIAL_SCHOLARSHIPS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  users: User[];
  cases: LegalCase[];
  scholarships: ScholarshipAgreement[];
  notifications: SystemNotification[];
  auditLogs: AuditLog[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  switchRole: (role: UserRole) => void;
  setCurrentUserById: (userId: string) => void;
  
  // Case Actions
  addCase: (newCase: Omit<LegalCase, 'id' | 'documents' | 'hearings' | 'history'>) => LegalCase;
  updateCaseStatus: (caseId: string, newStatus: CaseStatus, note?: string) => void;
  updateCasePriority: (caseId: string, newPriority: CasePriority) => void;
  assignOfficer: (caseId: string, officerId: string) => void;
  addCaseDocument: (caseId: string, doc: Omit<CaseDocument, 'id' | 'uploadedAt' | 'uploadedBy'>) => void;
  addHearing: (hearing: Omit<Hearing, 'id'>) => void;
  
  // Scholarship Actions
  addScholarship: (scholarship: Omit<ScholarshipAgreement, 'id'>) => void;
  updateScholarshipStatus: (id: string, status: ScholarshipAgreement['status']) => void;
  
  // User Management
  addUser: (user: Omit<User, 'id'>) => void;
  updateUserRole: (userId: string, newRole: UserRole, newTitle?: string) => void;
  toggleUserStatus: (userId: string) => void;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Modals & UI States
  isNewCaseModalOpen: boolean;
  setIsNewCaseModalOpen: (open: boolean) => void;
  isBackendExplorerOpen: boolean;
  setIsBackendExplorerOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('uog_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('uog_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default: Abebe Kebede (Legal Officer as in mockup)
  });

  const [cases, setCases] = useState<LegalCase[]>(() => {
    const saved = localStorage.getItem('uog_cases');
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });

  const [scholarships, setScholarships] = useState<ScholarshipAgreement[]>(() => {
    const saved = localStorage.getItem('uog_scholarships');
    return saved ? JSON.parse(saved) : INITIAL_SCHOLARSHIPS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('uog_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('uog_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState<boolean>(false);
  const [isBackendExplorerOpen, setIsBackendExplorerOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('uog_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('uog_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('uog_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('uog_scholarships', JSON.stringify(scholarships));
  }, [scholarships]);

  useEffect(() => {
    localStorage.setItem('uog_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('uog_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const logAudit = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      role: currentUser.roleTitle,
      action,
      module,
      details,
      ipAddress: '10.20.4.' + Math.floor(Math.random() * 200 + 10)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(targetUser);
    logAudit('ROLE_SWITCH', 'Authentication', `Switched active persona to ${targetUser.name} (${role})`);
  };

  const setCurrentUserById = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      logAudit('USER_SWITCH', 'Authentication', `Switched user to ${found.name}`);
    }
  };

  const addCase = (data: Omit<LegalCase, 'id' | 'documents' | 'hearings' | 'history'>): LegalCase => {
    const nextNum = Math.floor(100 + Math.random() * 900);
    const prefix = data.category === 'Contract Disputes' ? 'C' : 
                   data.category === 'Employment Matters' ? 'EMP' :
                   data.category === 'Property Matters' ? 'PROP' :
                   data.category === 'Disciplinary Cases' ? 'DISC' : 'CASE';
    const caseId = `UOG/2025/${prefix}/${nextNum}`;

    const newCase: LegalCase = {
      ...data,
      id: caseId,
      documents: [],
      hearings: [],
      history: [
        {
          id: `hist_${Date.now()}`,
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          author: currentUser.name,
          authorRole: currentUser.roleTitle,
          action: 'Case Registered',
          details: `Registered case: ${data.title} in ${data.department} department.`
        }
      ]
    };

    setCases(prev => [newCase, ...prev]);
    logAudit('CASE_REGISTRATION', 'Case Management', `Created case ${caseId} (${data.title})`);

    // Create system notification for all legal officers / admins
    const newNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      type: 'assignment',
      title: 'New Case Registered',
      message: `New case ${caseId} in ${data.department} submitted for review.`,
      timestamp: 'Just now',
      read: false,
      caseId: caseId
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newCase;
  };

  const updateCaseStatus = (caseId: string, newStatus: CaseStatus, note?: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const prevStatus = c.status;
        const updatedHistory = [
          ...c.history,
          {
            id: `hist_${Date.now()}`,
            timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            author: currentUser.name,
            authorRole: currentUser.roleTitle,
            action: 'Status Updated',
            details: note || `Status progressed from "${prevStatus}" to "${newStatus}".`,
            previousStatus: prevStatus,
            newStatus: newStatus
          }
        ];
        return {
          ...c,
          status: newStatus,
          dateClosed: newStatus === 'Closed' ? new Date().toISOString().split('T')[0] : c.dateClosed,
          history: updatedHistory
        };
      }
      return c;
    }));

    logAudit('STATUS_CHANGE', 'Case Workflow', `Updated ${caseId} status to ${newStatus}`);
  };

  const updateCasePriority = (caseId: string, newPriority: CasePriority) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return { ...c, priority: newPriority };
      }
      return c;
    }));
    logAudit('PRIORITY_CHANGE', 'Case Management', `Set priority of ${caseId} to ${newPriority}`);
  };

  const assignOfficer = (caseId: string, officerId: string) => {
    const officer = users.find(u => u.id === officerId);
    if (!officer) return;

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updatedHistory = [
          ...c.history,
          {
            id: `hist_${Date.now()}`,
            timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            author: currentUser.name,
            authorRole: currentUser.roleTitle,
            action: 'Officer Assigned',
            details: `Assigned case responsibility to ${officer.name}.`
          }
        ];
        return {
          ...c,
          assignedOfficerId: officer.id,
          assignedOfficerName: officer.name,
          history: updatedHistory
        };
      }
      return c;
    }));

    // Trigger Notification for the assigned officer
    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      type: 'assignment',
      title: 'New Case Assigned',
      message: `Case ${caseId} has been assigned to you.`,
      timestamp: 'Just now',
      read: false,
      caseId: caseId
    };
    setNotifications(prev => [notif, ...prev]);

    logAudit('CASE_ASSIGNMENT', 'Case Assignment', `Assigned case ${caseId} to ${officer.name}`);
  };

  const addCaseDocument = (caseId: string, docData: Omit<CaseDocument, 'id' | 'uploadedAt' | 'uploadedBy'>) => {
    const newDoc: CaseDocument = {
      ...docData,
      id: `doc_${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: currentUser.name
    };

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          documents: [newDoc, ...c.documents]
        };
      }
      return c;
    }));

    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      type: 'document',
      title: 'Document Uploaded',
      message: `Document "${newDoc.fileName}" uploaded for case ${caseId}.`,
      timestamp: 'Just now',
      read: false,
      caseId
    };
    setNotifications(prev => [notif, ...prev]);

    logAudit('DOCUMENT_UPLOAD', 'Document Management', `Uploaded ${newDoc.fileName} for ${caseId}`);
  };

  const addHearing = (hearingData: Omit<Hearing, 'id'>) => {
    const newHearing: Hearing = {
      ...hearingData,
      id: `hear_${Date.now()}`
    };

    setCases(prev => prev.map(c => {
      if (c.id === hearingData.caseId) {
        return {
          ...c,
          hearings: [newHearing, ...c.hearings]
        };
      }
      return c;
    }));

    const notif: SystemNotification = {
      id: `notif_${Date.now()}`,
      type: 'hearing',
      title: 'Hearing Scheduled',
      message: `Hearing for case ${hearingData.caseId} scheduled on ${hearingData.date} at ${hearingData.time} (${hearingData.location}).`,
      timestamp: 'Just now',
      read: false,
      caseId: hearingData.caseId
    };
    setNotifications(prev => [notif, ...prev]);

    logAudit('HEARING_SCHEDULED', 'Hearings & Calendar', `Scheduled hearing for ${hearingData.caseId} at ${hearingData.location}`);
  };

  const addScholarship = (data: Omit<ScholarshipAgreement, 'id'>) => {
    const agreement: ScholarshipAgreement = {
      ...data,
      id: `sch_${Date.now()}`
    };
    setScholarships(prev => [agreement, ...prev]);
    logAudit('SCHOLARSHIP_REGISTERED', 'Scholarship Agreements', `Registered agreement ${data.agreementNumber} for ${data.recipientName}`);
  };

  const updateScholarshipStatus = (id: string, status: ScholarshipAgreement['status']) => {
    setScholarships(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    logAudit('SCHOLARSHIP_STATUS_UPDATE', 'Scholarship Agreements', `Updated scholarship ${id} status to ${status}`);
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
    logAudit('USER_CREATED', 'User Administration', `Created user account for ${newUser.name} (${newUser.role})`);
  };

  const updateUserRole = (userId: string, newRole: UserRole, newTitle?: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          role: newRole,
          roleTitle: newTitle || (newRole === 'legal_officer' ? 'Legal Officer' : newRole === 'admin' ? 'Legal Affairs Director' : newRole === 'system_admin' ? 'System Administrator' : 'Staff User')
        };
      }
      return u;
    }));
    logAudit('ROLE_MODIFIED', 'User Administration', `Updated role of user ID ${userId} to ${newRole}`);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    logAudit('USER_STATUS_TOGGLE', 'User Administration', `Toggled account status for user ID ${userId}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        cases,
        scholarships,
        notifications,
        auditLogs,
        activeTab,
        setActiveTab,
        selectedCaseId,
        setSelectedCaseId,
        searchQuery,
        setSearchQuery,
        switchRole,
        setCurrentUserById,
        addCase,
        updateCaseStatus,
        updateCasePriority,
        assignOfficer,
        addCaseDocument,
        addHearing,
        addScholarship,
        updateScholarshipStatus,
        addUser,
        updateUserRole,
        toggleUserStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isNewCaseModalOpen,
        setIsNewCaseModalOpen,
        isBackendExplorerOpen,
        setIsBackendExplorerOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
