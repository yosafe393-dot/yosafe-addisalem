import { LegalCase, User, ScholarshipAgreement, SystemNotification, AuditLog, Hearing, Campus } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_1',
    name: 'Abebe Kebede',
    email: 'abebe.kebede@uog.edu.et',
    role: 'legal_officer',
    roleTitle: 'Senior Legal Officer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Legal Affairs Office',
    campus: 'GC (Main Campus)',
    phone: '+251 91 876 5432',
    status: 'Active',
    assignedCasesCount: 16
  },
  {
    id: 'usr_2',
    name: 'Dr. Dawit Mengistu',
    email: 'dawit.mengistu@uog.edu.et',
    role: 'admin',
    roleTitle: 'Legal Affairs Directorate Director',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Legal Affairs Office',
    campus: 'GC (Main Campus)',
    phone: '+251 91 123 4567',
    status: 'Active',
    assignedCasesCount: 5
  },
  {
    id: 'usr_3',
    name: 'Selam Wossen',
    email: 'selam.wossen@uog.edu.et',
    role: 'legal_officer',
    roleTitle: 'Legal Counsel & Dispute Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Legal Affairs Office',
    campus: 'Maraki',
    phone: '+251 92 345 6789',
    status: 'Active',
    assignedCasesCount: 14
  },
  {
    id: 'usr_4',
    name: 'Yosef Alemu',
    email: 'yosef.alemu@uog.edu.et',
    role: 'legal_officer',
    roleTitle: 'Property & Contracts Legal Advisor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Legal Affairs Office',
    campus: 'Fasiledes',
    phone: '+251 93 456 7890',
    status: 'Active',
    assignedCasesCount: 12
  },
  {
    id: 'usr_5',
    name: 'Biruk Haile',
    email: 'biruk.haile@uog.edu.et',
    role: 'system_admin',
    roleTitle: 'Lead Systems & Security Administrator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    department: 'ICT Directorate',
    campus: 'GC (Main Campus)',
    phone: '+251 91 456 7812',
    status: 'Active'
  },
  {
    id: 'usr_6',
    name: 'Almaz Tesfaye',
    email: 'almaz.tesfaye@uog.edu.et',
    role: 'user',
    roleTitle: 'Department Head & Academic Staff',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Human Resource',
    campus: 'Tedros',
    phone: '+251 94 567 8901',
    status: 'Active'
  }
];

export const INITIAL_CASES: LegalCase[] = [
  {
    id: 'UOG/2025/C/045',
    title: 'Contract dispute with supplier',
    category: 'Contract Disputes',
    campus: 'GC (Main Campus)',
    department: 'Administration',
    plaintiff: 'University of Gondar Procurement Bureau',
    defendant: 'Abyssinia Scientific Supplies Ltd',
    assignedOfficerId: 'usr_1',
    assignedOfficerName: 'Abebe Kebede',
    status: 'Under Review',
    priority: 'High',
    dateOpened: '2025-05-18',
    summary: 'Supplier failed to deliver laboratory chromatography apparatus per the tender specification (Contract #TEND-2024-88) despite receiving a 30% advance guarantee bond.',
    legalBasis: 'Ethiopian Federal Procurement & Property Administration Proclamation & Civil Code Article 1731',
    estimatedFinancialImpact: 4500000,
    submittedBy: 'Dr. Dawit Mengistu',
    documents: [
      {
        id: 'doc_1',
        caseId: 'UOG/2025/C/045',
        fileName: 'Tender_Contract_Agreement_Abyssinia.pdf',
        fileSize: '4.2 MB',
        fileType: 'PDF',
        uploadedBy: 'Administration Directorate',
        uploadedAt: '2025-05-18',
        confidentiality: 'Confidential',
        description: 'Original signed supply contract and performance guarantee letter'
      },
      {
        id: 'doc_2',
        caseId: 'UOG/2025/C/045',
        fileName: 'Formal_Default_Notice_Letter.pdf',
        fileSize: '1.1 MB',
        fileType: 'PDF',
        uploadedBy: 'Abebe Kebede',
        uploadedAt: '2025-05-19',
        confidentiality: 'Restricted Evidence',
        description: 'Final 15-day cure period default notice served to vendor'
      }
    ],
    hearings: [
      {
        id: 'hear_1',
        caseId: 'UOG/2025/C/045',
        caseTitle: 'Contract dispute with supplier',
        date: '2025-05-21',
        time: '10:00 AM',
        location: 'Court Room 2',
        judgeOrChair: 'Ato Mulugeta Zewdu (High Court Judge)',
        type: 'Court Hearing',
        status: 'Scheduled',
        notes: 'Preliminary hearing on contract breach and bank performance guarantee forfeiture.'
      }
    ],
    history: [
      {
        id: 'hist_1',
        timestamp: '2025-05-18 09:30 AM',
        author: 'Administration Directorate',
        authorRole: 'University User',
        action: 'Case Registered',
        details: 'Initial claim submitted regarding laboratory equipment procurement breach.'
      },
      {
        id: 'hist_2',
        timestamp: '2025-05-18 11:15 AM',
        author: 'Dr. Dawit Mengistu',
        authorRole: 'Legal Affairs Directorate Director',
        action: 'Officer Assigned',
        details: 'Assigned case to Senior Legal Officer Abebe Kebede with High Priority.'
      },
      {
        id: 'hist_3',
        timestamp: '2025-05-19 02:40 PM',
        author: 'Abebe Kebede',
        authorRole: 'Senior Legal Officer',
        action: 'Status Updated',
        details: 'Status changed from Newly Registered to Under Review after reviewing bank guarantee clauses.',
        previousStatus: 'Newly Registered',
        newStatus: 'Under Review'
      }
    ]
  },
  {
    id: 'UOG/2025/EMP/032',
    title: 'Employment claim by staff',
    category: 'Employment Matters',
    campus: 'Maraki',
    department: 'Human Resource',
    plaintiff: 'Former Academic Lecturer T. Haile',
    defendant: 'University of Gondar HR Management',
    assignedOfficerId: 'usr_3',
    assignedOfficerName: 'Selam Wossen',
    status: 'Investigation',
    priority: 'Medium',
    dateOpened: '2025-05-17',
    summary: 'Claim filed asserting wrongful non-renewal of academic employment contract and uncalculated summer duty allowances during 2024 academic year.',
    legalBasis: 'Higher Education Proclamation No. 1152/2019 and UoG Senate Legislation Section 4',
    estimatedFinancialImpact: 320000,
    submittedBy: 'Human Resource Directorate',
    documents: [
      {
        id: 'doc_3',
        caseId: 'UOG/2025/EMP/032',
        fileName: 'HR_Academic_Board_Minutes.pdf',
        fileSize: '2.8 MB',
        fileType: 'PDF',
        uploadedBy: 'Human Resource',
        uploadedAt: '2025-05-17',
        confidentiality: 'Confidential',
        description: 'Faculty Council appraisal report and non-renewal recommendation'
      }
    ],
    hearings: [
      {
        id: 'hear_2',
        caseId: 'UOG/2025/EMP/032',
        caseTitle: 'Employment claim by staff',
        date: '2025-05-23',
        time: '09:30 AM',
        location: 'Court Room 1',
        judgeOrChair: 'W/ro Hiwot Kassaye (Labor Conciliation Board)',
        type: 'Internal Mediation',
        status: 'Scheduled',
        notes: 'Reviewing employee attendance records and faculty council minutes.'
      }
    ],
    history: [
      {
        id: 'hist_4',
        timestamp: '2025-05-17 10:00 AM',
        author: 'Human Resource',
        authorRole: 'University User',
        action: 'Case Registered',
        details: 'Staff grievance transferred to Legal Affairs Office.'
      },
      {
        id: 'hist_5',
        timestamp: '2025-05-17 01:00 PM',
        author: 'Dr. Dawit Mengistu',
        authorRole: 'Director',
        action: 'Officer Assigned',
        details: 'Assigned to Selam Wossen for investigation.'
      }
    ]
  },
  {
    id: 'UOG/2025/PROP/021',
    title: 'Property boundary issue',
    category: 'Property Matters',
    campus: 'Fasiledes',
    department: 'Property Admin',
    plaintiff: 'University of Gondar Estate Directorate',
    defendant: 'Private Landholder / Gondar City Admin',
    assignedOfficerId: 'usr_4',
    assignedOfficerName: 'Yosef Alemu',
    status: 'Court Proceeding',
    priority: 'High',
    dateOpened: '2025-05-15',
    summary: 'Encroachment along Fasiledes Campus eastern perimeter buffer zone (2,400 sq. meters) designated for university staff housing expansion.',
    legalBasis: 'Urban Land Holding Proclamation and Gondar Municipality Master Plan Master Map #14',
    estimatedFinancialImpact: 12000000,
    submittedBy: 'Property Admin Directorate',
    documents: [
      {
        id: 'doc_4',
        caseId: 'UOG/2025/PROP/021',
        fileName: 'Evidence_001_Surveyor_Map.pdf',
        fileSize: '8.4 MB',
        fileType: 'PDF',
        uploadedBy: 'Yosef Alemu',
        uploadedAt: '2025-05-15',
        confidentiality: 'Restricted Evidence',
        description: 'Cadastral land map showing university perimeter coordinates'
      }
    ],
    hearings: [
      {
        id: 'hear_3',
        caseId: 'UOG/2025/PROP/021',
        caseTitle: 'Property boundary issue',
        date: '2025-06-02',
        time: '02:00 PM',
        location: 'High Court of Gondar',
        judgeOrChair: 'Judge Getachew Bekele',
        type: 'Court Hearing',
        status: 'Scheduled',
        notes: 'Injunction request hearing against unauthorized private construction.'
      }
    ],
    history: [
      {
        id: 'hist_6',
        timestamp: '2025-05-15 08:45 AM',
        author: 'Property Admin',
        authorRole: 'University User',
        action: 'Case Registered',
        details: 'Urgent injunction request regarding Fasiledes perimeter.'
      }
    ]
  },
  {
    id: 'UOG/2025/DISC/018',
    title: 'Student disciplinary case',
    category: 'Disciplinary Cases',
    campus: 'Tseda',
    department: 'Student Affairs',
    plaintiff: 'Campus Proctorate Office',
    defendant: 'Disciplinary Group (4 Students)',
    assignedOfficerId: 'usr_1',
    assignedOfficerName: 'Abebe Kebede',
    status: 'Under Review',
    priority: 'Medium',
    dateOpened: '2025-05-14',
    summary: 'Disruption of mid-term examinations and unauthorized dormitory damage in Tseda Agricultural College.',
    legalBasis: 'UoG Student Code of Conduct 2023 Edition, Article 19',
    estimatedFinancialImpact: 145000,
    submittedBy: 'Student Affairs Directorate',
    documents: [
      {
        id: 'doc_5',
        caseId: 'UOG/2025/DISC/018',
        fileName: 'Proctorate_Security_Incident_Report.pdf',
        fileSize: '3.1 MB',
        fileType: 'PDF',
        uploadedBy: 'Student Affairs',
        uploadedAt: '2025-05-14',
        confidentiality: 'Confidential',
        description: 'Signed campus security incident report and photos'
      }
    ],
    hearings: [
      {
        id: 'hear_4',
        caseId: 'UOG/2025/DISC/018',
        caseTitle: 'Student disciplinary case',
        date: '2025-05-27',
        time: '11:00 AM',
        location: 'Court Room 3',
        judgeOrChair: 'Dr. Aster Berhanu (Disciplinary Chair)',
        type: 'Disciplinary Committee',
        status: 'Scheduled',
        notes: 'University Student Disciplinary Committee formal inquiry.'
      }
    ],
    history: [
      {
        id: 'hist_7',
        timestamp: '2025-05-14 11:20 AM',
        author: 'Student Affairs',
        authorRole: 'University User',
        action: 'Case Registered',
        details: 'Disciplinary referral submitted by Tseda Campus proctor.'
      }
    ]
  },
  {
    id: 'UOG/2025/C/040',
    title: 'Service agreement review',
    category: 'Contract Disputes',
    campus: 'GC (Main Campus)',
    department: 'ICT Directorate',
    plaintiff: 'ICT Directorate',
    defendant: 'FiberOptics Telecommunications Enterprise',
    assignedOfficerId: 'usr_3',
    assignedOfficerName: 'Selam Wossen',
    status: 'Closed',
    priority: 'Low',
    dateOpened: '2025-05-10',
    dateClosed: '2025-05-19',
    summary: 'Service Level Agreement (SLA) penalty settlement for inter-campus fiber network downtime resolved through negotiated credit memo.',
    legalBasis: 'Commercial Code of Ethiopia and SLA Clauses Section 7.2',
    estimatedFinancialImpact: 210000,
    submittedBy: 'ICT Directorate',
    documents: [
      {
        id: 'doc_6',
        caseId: 'UOG/2025/C/040',
        fileName: 'Executed_SLA_Settlement_Agreement.pdf',
        fileSize: '1.9 MB',
        fileType: 'PDF',
        uploadedBy: 'Selam Wossen',
        uploadedAt: '2025-05-19',
        confidentiality: 'Public Record',
        description: 'Signed mutual discharge and SLA rebate voucher'
      }
    ],
    hearings: [],
    history: [
      {
        id: 'hist_8',
        timestamp: '2025-05-10 09:00 AM',
        author: 'ICT Directorate',
        authorRole: 'University User',
        action: 'Case Registered',
        details: 'SLA penalty enforcement request.'
      },
      {
        id: 'hist_9',
        timestamp: '2025-05-19 04:30 PM',
        author: 'Selam Wossen',
        authorRole: 'Legal Officer',
        action: 'Case Closed',
        details: 'Contractual dispute resolved; credit note received by University Finance.',
        previousStatus: 'In Progress',
        newStatus: 'Closed'
      }
    ]
  },
  {
    id: 'UOG/2025/EMP/035',
    title: 'Postgraduate Scholarship Breach Claim',
    category: 'Scholarship Agreements',
    campus: 'Tedros',
    department: 'Academic Affairs',
    plaintiff: 'University of Gondar Academic Vice President',
    defendant: 'Dr. Kassa Teshome (Former Sponsored Staff)',
    assignedOfficerId: 'usr_1',
    assignedOfficerName: 'Abebe Kebede',
    status: 'Newly Registered',
    priority: 'High',
    dateOpened: '2025-05-20',
    summary: 'Sponsored faculty member failed to return and complete mandatory 6-year university service bond following completion of PhD abroad.',
    legalBasis: 'Higher Education Overseas Scholarship Sponsorship Directive #2018',
    estimatedFinancialImpact: 3850000,
    submittedBy: 'Academic Affairs',
    documents: [],
    hearings: [],
    history: [
      {
        id: 'hist_10',
        timestamp: '2025-05-20 08:30 AM',
        author: 'Academic Affairs',
        authorRole: 'University User',
        action: 'Case Registered',
        details: 'Formal default report transmitted from VP Academic Affairs.'
      },
      {
        id: 'hist_11',
        timestamp: '2025-05-20 09:10 AM',
        author: 'Dr. Dawit Mengistu',
        authorRole: 'Director',
        action: 'Officer Assigned',
        details: 'Assigned to Senior Legal Officer Abebe Kebede to initiate bond guarantee recovery.'
      }
    ]
  }
];

export const INITIAL_SCHOLARSHIPS: ScholarshipAgreement[] = [
  {
    id: 'sch_1',
    agreementNumber: 'UOG/SCH/2023/042',
    recipientName: 'Dr. Ephraim Solomon',
    staffId: 'UOG-AC-2018-091',
    department: 'Computer Science',
    campus: 'GC (Main Campus)',
    degreeLevel: 'PhD',
    hostInstitution: 'Addis Ababa University',
    country: 'Ethiopia',
    startDate: '2021-09-01',
    endDate: '2025-08-30',
    fundingSource: 'University of Gondar Internal',
    tuitionFeeETB: 450000,
    monthlyStipendETB: 18000,
    totalEstimatedCostETB: 1314000,
    guarantor1Name: 'Ato Mesfin Dagnachew (Director, Gondar Bank)',
    guarantor1Phone: '+251 91 888 1234',
    guarantor2Name: 'W/ro Elsa Girma (Lecturer, UoG)',
    guarantor2Phone: '+251 92 777 5678',
    serviceObligationYears: 4,
    status: 'Active Study',
    notes: 'Dissertation defense scheduled for July 2025. Clear academic standing.'
  },
  {
    id: 'sch_2',
    agreementNumber: 'UOG/SCH/2022/015',
    recipientName: 'Dr. Bethlehem Nigatu',
    staffId: 'UOG-MED-2017-044',
    department: 'Health Sciences College',
    campus: 'Maraki',
    degreeLevel: 'Sub-Specialty',
    hostInstitution: 'University of Cape Town',
    country: 'South Africa',
    startDate: '2022-01-10',
    endDate: '2024-01-15',
    fundingSource: 'Ministry of Education',
    tuitionFeeETB: 1200000,
    monthlyStipendETB: 35000,
    totalEstimatedCostETB: 2040000,
    guarantor1Name: 'Dr. Berhanu Mengiste (Senior Consultant)',
    guarantor1Phone: '+251 91 555 9988',
    serviceObligationYears: 4,
    status: 'Bond Service Period',
    notes: 'Successfully returned and currently serving year 2 of 4 at UoG Specialized Hospital.'
  },
  {
    id: 'sch_3',
    agreementNumber: 'UOG/SCH/2020/008',
    recipientName: 'Dr. Kassa Teshome',
    staffId: 'UOG-ENG-2016-112',
    department: 'Civil Engineering',
    campus: 'Fasiledes',
    degreeLevel: 'PhD',
    hostInstitution: 'Technical University of Munich',
    country: 'Germany',
    startDate: '2019-10-01',
    endDate: '2024-03-30',
    fundingSource: 'Foreign Grant / Bilateral',
    tuitionFeeETB: 2100000,
    monthlyStipendETB: 42000,
    totalEstimatedCostETB: 3850000,
    guarantor1Name: 'Ato Worku Teshome (Senior Civil Servant)',
    guarantor1Phone: '+251 91 222 3344',
    serviceObligationYears: 6,
    status: 'Defaulted / Legal Action Initiated',
    relatedCaseId: 'UOG/2025/EMP/035',
    notes: 'Did not report back upon completion in March 2024. Guarantor formally notified.'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif_1',
    type: 'assignment',
    title: 'New Case Assigned',
    message: 'New case UOG/2025/EMP/035 has been assigned to you.',
    timestamp: '10 minutes ago',
    read: false,
    caseId: 'UOG/2025/EMP/035'
  },
  {
    id: 'notif_2',
    type: 'hearing',
    title: 'Upcoming Court Hearing',
    message: 'Hearing for case UOG/2025/C/045 is tomorrow at 10:00 AM (Court Room 2).',
    timestamp: '1 hour ago',
    read: false,
    caseId: 'UOG/2025/C/045'
  },
  {
    id: 'notif_3',
    type: 'document',
    title: 'Document Uploaded',
    message: 'Document "Evidence_001.pdf" uploaded for case UOG/2025/PROP/021.',
    timestamp: '2 hours ago',
    read: false,
    caseId: 'UOG/2025/PROP/021'
  },
  {
    id: 'notif_4',
    type: 'deadline',
    title: 'Filing Deadline Approaching',
    message: 'Disciplinary defense summary due in 48 hours for UOG/2025/DISC/018.',
    timestamp: '5 hours ago',
    read: true,
    caseId: 'UOG/2025/DISC/018'
  },
  {
    id: 'notif_5',
    type: 'system',
    title: 'Audit Log Archival Complete',
    message: 'Monthly system audit snapshot created and backed up to PostgreSQL replica.',
    timestamp: '1 day ago',
    read: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    timestamp: '2025-05-20 09:10:22',
    user: 'Dr. Dawit Mengistu',
    role: 'Admin / Director',
    action: 'CASE_ASSIGNMENT',
    module: 'Case Management',
    details: 'Assigned case UOG/2025/EMP/035 to Legal Officer Abebe Kebede',
    ipAddress: '10.20.4.15'
  },
  {
    id: 'aud_2',
    timestamp: '2025-05-20 08:30:11',
    user: 'Almaz Tesfaye',
    role: 'University User',
    action: 'CASE_CREATION',
    module: 'Intake Portal',
    details: 'Registered new case UOG/2025/EMP/035 regarding scholarship bond',
    ipAddress: '10.20.8.94'
  },
  {
    id: 'aud_3',
    timestamp: '2025-05-19 14:40:05',
    user: 'Abebe Kebede',
    role: 'Legal Officer',
    action: 'STATUS_CHANGE',
    module: 'Case Workflow',
    details: 'Updated status of UOG/2025/C/045 from "Newly Registered" to "Under Review"',
    ipAddress: '10.20.4.22'
  },
  {
    id: 'aud_4',
    timestamp: '2025-05-19 16:30:48',
    user: 'Selam Wossen',
    role: 'Legal Officer',
    action: 'CASE_CLOSED',
    module: 'Dispute Resolution',
    details: 'Closed case UOG/2025/C/040 with executed SLA settlement credit note',
    ipAddress: '10.20.6.18'
  },
  {
    id: 'aud_5',
    timestamp: '2025-05-18 10:12:00',
    user: 'Biruk Haile',
    role: 'System Admin',
    action: 'ROLE_PERMISSION_UPDATE',
    module: 'User Administration',
    details: 'Updated permission matrix for Legal Counsel role',
    ipAddress: '10.20.1.1'
  }
];

export const CAMPUSES: Campus[] = [
  'GC (Main Campus)',
  'Tedros',
  'Fasiledes',
  'Tseda',
  'Maraki'
];

export const DEPARTMENTS = [
  'Administration',
  'Human Resource',
  'Property Admin',
  'Student Affairs',
  'ICT Directorate',
  'Academic Affairs',
  'Finance & Budget',
  'Procurement Bureau',
  'Health Sciences College',
  'Computer Science',
  'Civil Engineering',
  'Faculty of Law',
  'College of Agriculture',
  'Business & Economics',
  'Social Sciences & Humanities',
  'Estate Directorate',
  'Internal Audit',
  'Registrar Office',
  'Postgraduate Directorate',
  'Research & Community Service',
  'Proctorate Office',
  'University Hospital Management',
  'Library System',
  'Transport & Logistics',
  'Public Relations'
];

export const CASE_CATEGORIES = [
  { name: 'Contract Disputes', count: 30, percentage: '22.2%', color: '#0284c7' },
  { name: 'Employment Matters', count: 28, percentage: '20.7%', color: '#22c55e' },
  { name: 'Disciplinary Cases', count: 25, percentage: '18.5%', color: '#eab308' },
  { name: 'Property Matters', count: 20, percentage: '14.8%', color: '#a855f7' },
  { name: 'Court Cases', count: 18, percentage: '13.3%', color: '#ef4444' },
  { name: 'Others', count: 14, percentage: '10.4%', color: '#06b6d4' }
];

export const MONTHLY_OVERVIEW_DATA = [
  { month: 'Jan', registered: 26, active: 14, closed: 8 },
  { month: 'Feb', registered: 28, active: 15, closed: 9 },
  { month: 'Mar', registered: 35, active: 20, closed: 15 },
  { month: 'Apr', registered: 32, active: 18, closed: 13 },
  { month: 'May', registered: 42, active: 25, closed: 20 },
  { month: 'Jun', registered: 38, active: 22, closed: 18 },
  { month: 'Jul', registered: 34, active: 20, closed: 14 },
  { month: 'Aug', registered: 30, active: 16, closed: 10 },
  { month: 'Sep', registered: 44, active: 27, closed: 19 },
  { month: 'Oct', registered: 41, active: 26, closed: 21 },
  { month: 'Nov', registered: 43, active: 29, closed: 27 },
  { month: 'Dec', registered: 45, active: 31, closed: 29 }
];
