import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  MapPin, 
  Building2, 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ShieldAlert, 
  Scale, 
  Send, 
  Plus, 
  Download, 
  History,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CaseStatus, CasePriority, LegalCase, Hearing } from '../types';

export const CaseDetailsModal: React.FC = () => {
  const { 
    selectedCaseId, 
    setSelectedCaseId, 
    cases, 
    users, 
    currentUser, 
    updateCaseStatus, 
    updateCasePriority, 
    assignOfficer,
    addCaseDocument,
    addHearing
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'hearings' | 'documents' | 'history'>('overview');
  const [newNote, setNewNote] = useState('');
  
  // New Hearing form state
  const [isAddingHearing, setIsAddingHearing] = useState(false);
  const [hearingDate, setHearingDate] = useState('');
  const [hearingTime, setHearingTime] = useState('10:00 AM');
  const [hearingLocation, setHearingLocation] = useState('Court Room 1');
  const [hearingJudge, setHearingJudge] = useState('');
  const [hearingType, setHearingType] = useState<Hearing['type']>('Court Hearing');
  const [hearingNotes, setHearingNotes] = useState('');

  // New Document form state
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [docName, setDocName] = useState('');
  const [docConfidentiality, setDocConfidentiality] = useState<'Public Record' | 'Confidential' | 'Restricted Evidence'>('Confidential');
  const [docDescription, setDocDescription] = useState('');

  if (!selectedCaseId) return null;

  const currentCase = cases.find(c => c.id === selectedCaseId);
  if (!currentCase) return null;

  const legalOfficers = users.filter(u => u.role === 'legal_officer');
  const statuses: CaseStatus[] = ['Newly Registered', 'Under Review', 'Investigation', 'Court Proceeding', 'In Progress', 'Closed'];

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'Under Review': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Investigation': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Court Proceeding': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'In Progress': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Closed': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Newly Registered':
      default: return 'bg-sky-100 text-sky-800 border-sky-300';
    }
  };

  const handleCreateHearing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hearingDate || !hearingJudge) return;

    addHearing({
      caseId: currentCase.id,
      caseTitle: currentCase.title,
      date: hearingDate,
      time: hearingTime,
      location: hearingLocation,
      judgeOrChair: hearingJudge,
      type: hearingType,
      status: 'Scheduled',
      notes: hearingNotes
    });

    setIsAddingHearing(false);
    setHearingDate('');
    setHearingJudge('');
    setHearingNotes('');
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    addCaseDocument(currentCase.id, {
      caseId: currentCase.id,
      fileName: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
      fileSize: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      fileType: 'PDF',
      confidentiality: docConfidentiality,
      description: docDescription
    });

    setIsAddingDoc(false);
    setDocName('');
    setDocDescription('');
  };

  const handleAddStatusNote = () => {
    if (!newNote.trim()) return;
    updateCaseStatus(currentCase.id, currentCase.status, newNote);
    setNewNote('');
  };

  return (
    <div 
      id="case-details-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="case-details-dossier"
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Top Bar */}
        <div className="bg-[#0a1931] text-white p-4 sm:p-6 flex items-start justify-between gap-4 border-b border-[#1b2f54]">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs">
                {currentCase.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadge(currentCase.status)}`}>
                {currentCase.status}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-slate-200">
                {currentCase.category}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {currentCase.title}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-300 mt-2 flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                {currentCase.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {currentCase.campus}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Opened: {currentCase.dateOpened}
              </span>
            </div>
          </div>

          <button
            onClick={() => setSelectedCaseId(null)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Progression Stepper */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-200 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {statuses.map((st, idx) => {
              const isCurrent = currentCase.status === st;
              const isPassed = statuses.indexOf(currentCase.status) >= idx;
              return (
                <button
                  key={st}
                  onClick={() => updateCaseStatus(currentCase.id, st)}
                  className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isPassed
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-black/10">
                    {idx + 1}
                  </span>
                  <span>{st}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="px-4 sm:px-6 border-b border-slate-200 flex items-center gap-2 sm:gap-6 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Case Dossier</span>
          </button>

          <button
            onClick={() => setActiveSubTab('hearings')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'hearings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Hearings & Sessions ({currentCase.hearings.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('documents')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'documents'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Documents & Evidence ({currentCase.documents.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit History ({currentCase.history.length})</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f8fafc]">
          {/* TAB 1: OVERVIEW */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Controls Card (Assign Officer & Priority) */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>Responsible Legal Officer</span>
                  </label>
                  <select
                    value={currentCase.assignedOfficerId || ''}
                    onChange={(e) => assignOfficer(currentCase.id, e.target.value)}
                    className="w-full text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="">-- Unassigned --</option>
                    {legalOfficers.map(off => (
                      <option key={off.id} value={off.id}>{off.name} ({off.roleTitle})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Case Priority Level</span>
                  </label>
                  <select
                    value={currentCase.priority}
                    onChange={(e) => updateCasePriority(currentCase.id, e.target.value as CasePriority)}
                    className="w-full text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent (Immediate Attention)</option>
                  </select>
                </div>
              </div>

              {/* Case Summary & Legal Basis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Factual Summary of the Case
                    </h4>
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {currentCase.summary}
                    </p>
                  </div>

                  {currentCase.legalBasis && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-blue-600" />
                        <span>Statutory & Legal Basis</span>
                      </h4>
                      <p className="text-xs font-medium text-slate-700 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                        {currentCase.legalBasis}
                      </p>
                    </div>
                  )}

                  {/* Add History / Progress Note */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-800 mb-2">Record Case Update / Legal Note</h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Log action taken, court motion filed, or internal review comment..."
                        className="flex-1 text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button
                        onClick={handleAddStatusNote}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side Metadata info */}
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
                    <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Litigation Parties</h4>
                    <div>
                      <span className="text-slate-400 font-semibold block">Plaintiff / Claiming Unit:</span>
                      <span className="font-bold text-slate-800">{currentCase.plaintiff}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Defendant / Respondent:</span>
                      <span className="font-bold text-slate-800">{currentCase.defendant}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Initiated By:</span>
                      <span className="font-medium text-slate-700">{currentCase.submittedBy}</span>
                    </div>

                    {currentCase.estimatedFinancialImpact ? (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-slate-400 font-semibold block">Estimated Financial Claim:</span>
                        <span className="text-base font-extrabold text-emerald-700">
                          ETB {currentCase.estimatedFinancialImpact.toLocaleString()}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HEARINGS */}
          {activeSubTab === 'hearings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Scheduled Hearings & Committee Sessions</h3>
                <button
                  onClick={() => setIsAddingHearing(true)}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule Hearing</span>
                </button>
              </div>

              {/* Hearing Creation Form Modal/Card */}
              {isAddingHearing && (
                <form onSubmit={handleCreateHearing} className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-3 animate-in fade-in">
                  <div className="font-bold text-xs text-blue-900 mb-1">New Hearing Schedule</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Hearing Date *</label>
                      <input
                        type="date"
                        required
                        value={hearingDate}
                        onChange={(e) => setHearingDate(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Hearing Time</label>
                      <input
                        type="text"
                        value={hearingTime}
                        onChange={(e) => setHearingTime(e.target.value)}
                        placeholder="10:00 AM"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Session Location</label>
                      <select
                        value={hearingLocation}
                        onChange={(e) => setHearingLocation(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <option value="Court Room 1">Court Room 1 (Main Campus)</option>
                        <option value="Court Room 2">Court Room 2 (Maraki)</option>
                        <option value="Court Room 3">Court Room 3 (Tseda)</option>
                        <option value="High Court of Gondar">High Court of Gondar</option>
                        <option value="Senate Meeting Hall">Senate Meeting Hall</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Judge or Committee Chair *</label>
                      <input
                        type="text"
                        required
                        value={hearingJudge}
                        onChange={(e) => setHearingJudge(e.target.value)}
                        placeholder="e.g. Judge Mulugeta Zewdu"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Session Type</label>
                      <select
                        value={hearingType}
                        onChange={(e) => setHearingType(e.target.value as any)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <option value="Court Hearing">Court Hearing</option>
                        <option value="Disciplinary Committee">Disciplinary Committee</option>
                        <option value="Internal Mediation">Internal Mediation</option>
                        <option value="Pre-trial Session">Pre-trial Session</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Notes / Agenda</label>
                      <input
                        type="text"
                        value={hearingNotes}
                        onChange={(e) => setHearingNotes(e.target.value)}
                        placeholder="Key evidence review..."
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingHearing(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Confirm Schedule
                    </button>
                  </div>
                </form>
              )}

              {/* Hearing List */}
              {currentCase.hearings.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  No hearing sessions scheduled for this case yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {currentCase.hearings.map(h => (
                    <div key={h.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex flex-col items-center justify-center font-bold flex-shrink-0">
                          <span className="text-[9px] uppercase tracking-wider text-blue-600 font-extrabold">DATE</span>
                          <span className="text-sm leading-none">{h.date.split('-')[2] || '21'}</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{h.type}</div>
                          <div className="text-[11px] text-slate-600 flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {h.time}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {h.location}</span>
                            <span>Presiding: {h.judgeOrChair}</span>
                          </div>
                          {h.notes && <p className="text-[11px] text-slate-500 mt-1 italic">{h.notes}</p>}
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {h.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeSubTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Case Documents & Evidence Files</h3>
                <button
                  onClick={() => setIsAddingDoc(true)}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </div>

              {/* Upload Document Form */}
              {isAddingDoc && (
                <form onSubmit={handleUploadDoc} className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-3 animate-in fade-in">
                  <div className="font-bold text-xs text-blue-900 mb-1">Attach Legal Document</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">File Name *</label>
                      <input
                        type="text"
                        required
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        placeholder="e.g. Audit_Report_2024.pdf"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Confidentiality Level</label>
                      <select
                        value={docConfidentiality}
                        onChange={(e) => setDocConfidentiality(e.target.value as any)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <option value="Public Record">Public Record</option>
                        <option value="Confidential">Confidential Legal Work</option>
                        <option value="Restricted Evidence">Restricted Evidence</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Description</label>
                      <input
                        type="text"
                        value={docDescription}
                        onChange={(e) => setDocDescription(e.target.value)}
                        placeholder="Description of contents"
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingDoc(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Save Document
                    </button>
                  </div>
                </form>
              )}

              {/* Documents List */}
              {currentCase.documents.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  No documents attached to this case.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentCase.documents.map(doc => (
                    <div key={doc.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                          PDF
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{doc.fileName}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">{doc.fileSize} • Uploaded by {doc.uploadedBy}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {doc.confidentiality}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Simulating secure download for document: ${doc.fileName}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HISTORY & AUDIT TRAIL */}
          {activeSubTab === 'history' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Case Activity Timeline</h3>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {currentCase.history.map(entry => (
                  <div key={entry.id} className="relative group">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{entry.action}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{entry.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{entry.details}</p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      By: <span className="font-semibold text-slate-700">{entry.author}</span> ({entry.authorRole})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
