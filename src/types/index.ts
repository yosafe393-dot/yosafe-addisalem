export type UserRole = 'admin' | 'legal_officer' | 'user' | 'system_admin';

export type CaseStatus = 
  | 'Newly Registered' 
  | 'Under Review' 
  | 'Investigation' 
  | 'Court Proceeding' 
  | 'In Progress' 
  | 'Closed';

export type CasePriority = 'High' | 'Medium' | 'Low' | 'Urgent';

export type CaseCategory = 
  | 'Contract Disputes'
  | 'Employment Matters'
  | 'Disciplinary Cases'
  | 'Property Matters'
  | 'Court Cases'
  | 'Scholarship Agreements'
  | 'Institutional Legal Matters'
  | 'Others';

export type Campus = 'Tedros' | 'Fasiledes' | 'Tseda' | 'Maraki' | 'GC (Main Campus)';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  department: string;
  campus: Campus;
  phone: string;
  status: 'Active' | 'Inactive';
  assignedCasesCount?: number;
}

export interface CaseDocument {
  id: string;
  caseId: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  confidentiality: 'Public Record' | 'Confidential' | 'Restricted Evidence';
  description?: string;
  url?: string;
}

export interface Hearing {
  id: string;
  caseId: string;
  caseTitle: string;
  date: string; // e.g. '2025-05-21'
  time: string; // e.g. '10:00 AM'
  location: string; // e.g. 'Court Room 2', 'High Court of Gondar'
  judgeOrChair: string;
  type: 'Court Hearing' | 'Disciplinary Committee' | 'Internal Mediation' | 'Pre-trial Session';
  status: 'Scheduled' | 'Completed' | 'Postponed' | 'Cancelled';
  notes?: string;
}

export interface CaseHistoryEntry {
  id: string;
  timestamp: string;
  author: string;
  authorRole: string;
  action: string;
  details: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface LegalCase {
  id: string; // e.g. 'UOG/2025/C/045'
  title: string;
  category: CaseCategory;
  campus: Campus;
  department: string;
  plaintiff: string; // Plaintiff / Complainant
  defendant: string; // Defendant / Respondent
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  status: CaseStatus;
  priority: CasePriority;
  dateOpened: string; // '2025-05-18'
  dateClosed?: string;
  summary: string;
  legalBasis?: string;
  estimatedFinancialImpact?: number; // in ETB
  documents: CaseDocument[];
  hearings: Hearing[];
  history: CaseHistoryEntry[];
  submittedBy: string; // e.g. Staff User Name
}

export interface ScholarshipAgreement {
  id: string;
  agreementNumber: string; // e.g. 'UOG/SCH/2024/019'
  recipientName: string;
  staffId: string;
  department: string;
  campus: Campus;
  degreeLevel: 'MSc' | 'PhD' | 'PostDoc' | 'Sub-Specialty';
  hostInstitution: string; // e.g. 'Addis Ababa University', 'University of Gondar'
  country: string;
  startDate: string;
  endDate: string;
  fundingSource: 'University of Gondar Internal' | 'Ministry of Education' | 'Foreign Grant / Bilateral';
  tuitionFeeETB: number;
  monthlyStipendETB: number;
  totalEstimatedCostETB: number;
  guarantor1Name: string;
  guarantor1Phone: string;
  guarantor2Name?: string;
  guarantor2Phone?: string;
  serviceObligationYears: number; // e.g. 4 years bond
  status: 'Active Study' | 'Bond Service Period' | 'Fulfilled' | 'Defaulted / Legal Action Initiated';
  relatedCaseId?: string;
  notes?: string;
}

export interface SystemNotification {
  id: string;
  type: 'assignment' | 'hearing' | 'document' | 'deadline' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  caseId?: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}
