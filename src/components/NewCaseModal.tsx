import React, { useState } from 'react';
import { X, Briefcase, Building2, MapPin, Scale, Plus, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CAMPUSES, DEPARTMENTS } from '../data/mockData';
import { CaseCategory, CasePriority, Campus, CaseStatus } from '../types';

export const NewCaseModal: React.FC = () => {
  const { 
    isNewCaseModalOpen, 
    setIsNewCaseModalOpen, 
    addCase, 
    users, 
    currentUser,
    setSelectedCaseId
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CaseCategory>('Contract Disputes');
  const [campus, setCampus] = useState<Campus>('GC (Main Campus)');
  const [department, setDepartment] = useState('Administration');
  const [plaintiff, setPlaintiff] = useState(
    currentUser.role === 'user' ? `${currentUser.name} (${currentUser.department})` : 'University of Gondar Legal Affairs'
  );
  const [defendant, setDefendant] = useState('');
  const [priority, setPriority] = useState<CasePriority>('Medium');
  const [assignedOfficerId, setAssignedOfficerId] = useState(
    currentUser.role === 'legal_officer' ? currentUser.id : ''
  );
  const [summary, setSummary] = useState('');
  const [legalBasis, setLegalBasis] = useState('');
  const [financialImpact, setFinancialImpact] = useState<string>('');

  if (!isNewCaseModalOpen) return null;

  const legalOfficers = users.filter(u => u.role === 'legal_officer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !defendant.trim()) {
      alert('Please complete all required fields.');
      return;
    }

    const assignedOff = legalOfficers.find(o => o.id === assignedOfficerId);

    const createdCase = addCase({
      title,
      category,
      campus,
      department,
      plaintiff,
      defendant,
      assignedOfficerId: assignedOff?.id,
      assignedOfficerName: assignedOff?.name,
      status: 'Newly Registered',
      priority,
      dateOpened: new Date().toISOString().split('T')[0],
      summary,
      legalBasis,
      estimatedFinancialImpact: financialImpact ? parseFloat(financialImpact) : undefined,
      submittedBy: `${currentUser.name} (${currentUser.roleTitle})`
    });

    setIsNewCaseModalOpen(false);
    setSelectedCaseId(createdCase.id);
  };

  return (
    <div 
      id="new-case-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0a1931] text-white p-5 flex items-center justify-between border-b border-[#182a4d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Register New Legal Case</h2>
              <p className="text-xs text-slate-300">University of Gondar Legal Affairs Intake Portal</p>
            </div>
          </div>

          <button
            onClick={() => setIsNewCaseModalOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Case Title */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Case Subject / Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Non-delivery of Medical Equipment for Gondar Hospital"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          {/* Category, Campus, Department */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Case Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CaseCategory)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
              >
                <option value="Contract Disputes">Contract Disputes</option>
                <option value="Employment Matters">Employment Matters</option>
                <option value="Disciplinary Cases">Disciplinary Cases</option>
                <option value="Property Matters">Property Matters</option>
                <option value="Court Cases">Court Cases</option>
                <option value="Scholarship Agreements">Scholarship Agreements</option>
                <option value="Institutional Legal Matters">Institutional Legal Matters</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Relevant Campus *</label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value as Campus)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
              >
                {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Department / Faculty *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Plaintiff & Defendant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Plaintiff / Complainant *</label>
              <input
                type="text"
                required
                value={plaintiff}
                onChange={(e) => setPlaintiff(e.target.value)}
                placeholder="e.g. University Procurement Directorate"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Defendant / Respondent *</label>
              <input
                type="text"
                required
                value={defendant}
                onChange={(e) => setDefendant(e.target.value)}
                placeholder="e.g. Nile Construction Enterprise"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Priority, Assigned Officer & Financial Claim */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CasePriority)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Assign Legal Officer</label>
              <select
                value={assignedOfficerId}
                onChange={(e) => setAssignedOfficerId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
              >
                <option value="">-- Assign Later by Directorate --</option>
                {legalOfficers.map(off => (
                  <option key={off.id} value={off.id}>{off.name} ({off.roleTitle})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Financial Impact (ETB)</label>
              <input
                type="number"
                value={financialImpact}
                onChange={(e) => setFinancialImpact(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Case Summary */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Factual Background & Case Summary *</label>
            <textarea
              rows={3}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Provide full description of the legal dispute, violation, contract clause or incident details..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
            />
          </div>

          {/* Legal Basis */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Legal Basis / Proclamation Reference</label>
            <input
              type="text"
              value={legalBasis}
              onChange={(e) => setLegalBasis(e.target.value)}
              placeholder="e.g. Higher Education Proclamation 1152/2019 Article 42, Civil Code 1731"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewCaseModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all"
            >
              Submit & Register Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
