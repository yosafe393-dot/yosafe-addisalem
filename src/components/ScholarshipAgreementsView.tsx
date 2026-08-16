import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Calculator, 
  Search, 
  Building2, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CAMPUSES, DEPARTMENTS } from '../data/mockData';
import { ScholarshipAgreement, Campus } from '../types';

export const ScholarshipAgreementsView: React.FC = () => {
  const { scholarships, addScholarship, updateScholarshipStatus, setSelectedCaseId, setActiveTab } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isNewAgreementModal, setIsNewAgreementModal] = useState(false);

  // New Agreement Form states
  const [recipientName, setRecipientName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [campus, setCampus] = useState<Campus>('GC (Main Campus)');
  const [degreeLevel, setDegreeLevel] = useState<ScholarshipAgreement['degreeLevel']>('PhD');
  const [hostInstitution, setHostInstitution] = useState('');
  const [country, setCountry] = useState('Ethiopia');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fundingSource, setFundingSource] = useState<ScholarshipAgreement['fundingSource']>('University of Gondar Internal');
  const [tuitionFee, setTuitionFee] = useState<number>(300000);
  const [monthlyStipend, setMonthlyStipend] = useState<number>(15000);
  const [durationMonths, setDurationMonths] = useState<number>(36);
  const [guarantor1Name, setGuarantor1Name] = useState('');
  const [guarantor1Phone, setGuarantor1Phone] = useState('');
  const [serviceYears, setServiceYears] = useState<number>(4);
  const [notes, setNotes] = useState('');

  // Auto-calculated total cost
  const calculatedTotalCost = tuitionFee + (monthlyStipend * durationMonths);

  const filteredScholarships = scholarships.filter(s => {
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.recipientName.toLowerCase().includes(q) ||
        s.agreementNumber.toLowerCase().includes(q) ||
        s.staffId.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.hostInstitution.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !staffId || !hostInstitution) {
      alert('Please fill all required fields');
      return;
    }

    const nextId = Math.floor(100 + Math.random() * 900);
    const agreementNumber = `UOG/SCH/2025/${nextId}`;

    addScholarship({
      agreementNumber,
      recipientName,
      staffId,
      department,
      campus,
      degreeLevel,
      hostInstitution,
      country,
      startDate,
      endDate,
      fundingSource,
      tuitionFeeETB: tuitionFee,
      monthlyStipendETB: monthlyStipend,
      totalEstimatedCostETB: calculatedTotalCost,
      guarantor1Name,
      guarantor1Phone,
      serviceObligationYears: serviceYears,
      status: 'Active Study',
      notes
    });

    setIsNewAgreementModal(false);
    // Reset form
    setRecipientName('');
    setStaffId('');
    setHostInstitution('');
  };

  const getStatusColor = (st: ScholarshipAgreement['status']) => {
    switch (st) {
      case 'Active Study': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Bond Service Period': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Fulfilled': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Defaulted / Legal Action Initiated': return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span>Scholarship Legal Agreements & Bond Registry</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Automated monitoring of sponsored academic staff, funding liability calculations & return obligation tracking.
          </p>
        </div>

        <button
          onClick={() => setIsNewAgreementModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Scholarship Contract</span>
        </button>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Sponsored Staff</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{scholarships.length} Contracts</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Currently in Study</div>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {scholarships.filter(s => s.status === 'Active Study').length} Scholars
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Serving University Bond</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {scholarships.filter(s => s.status === 'Bond Service Period').length} Staff
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Defaulted / Under Recovery</div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {scholarships.filter(s => s.status.includes('Defaulted')).length} Cases
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scholar name, ID, institution..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
          <span className="text-slate-500 font-semibold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Active Study">Active Study</option>
            <option value="Bond Service Period">Bond Service Period</option>
            <option value="Fulfilled">Fulfilled</option>
            <option value="Defaulted / Legal Action Initiated">Defaulted / In Litigation</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredScholarships.map(sch => (
          <div 
            key={sch.id} 
            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {sch.agreementNumber}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(sch.status)}`}>
                  {sch.status}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {sch.recipientName}
              </h3>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                Staff ID: {sch.staffId} • {sch.degreeLevel} Program
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-400">Host Institution:</span>
                  <span className="font-semibold text-slate-900 text-right truncate max-w-[170px]">
                    {sch.hostInstitution}, {sch.country}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-semibold">{sch.department} ({sch.campus})</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-400">Service Bond Obligation:</span>
                  <span className="font-bold text-blue-700">{sch.serviceObligationYears} Years Mandatory</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-200">
                  <span className="text-slate-400">Total University Investment:</span>
                  <span className="font-extrabold text-emerald-700">ETB {sch.totalEstimatedCostETB.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Guarantor:</span>
                  <span className="font-medium truncate">{sch.guarantor1Name}</span>
                </div>
                {sch.notes && (
                  <p className="text-[11px] text-slate-500 italic mt-1 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    {sch.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              {sch.relatedCaseId ? (
                <button
                  onClick={() => {
                    setSelectedCaseId(sch.relatedCaseId!);
                    setActiveTab('cases');
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <span>Linked Case: {sch.relatedCaseId}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">Contract In Good Standing</span>
              )}

              <select
                value={sch.status}
                onChange={(e) => updateScholarshipStatus(sch.id, e.target.value as any)}
                className="text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-lg p-1"
              >
                <option value="Active Study">Active Study</option>
                <option value="Bond Service Period">Bond Service Period</option>
                <option value="Fulfilled">Fulfilled</option>
                <option value="Defaulted / Legal Action Initiated">Defaulted (Legal Action)</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Create Agreement Modal */}
      {isNewAgreementModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#0a1931] text-white p-5 flex items-center justify-between border-b border-[#182a4d]">
              <div className="flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold">Register Staff Scholarship & Compute Bond</h2>
              </div>
              <button onClick={() => setIsNewAgreementModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAgreement} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scholar Full Name *</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Dr. Tewodros Girmay"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff ID Number *</label>
                  <input
                    type="text"
                    required
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    placeholder="e.g. UOG-ENG-2022-09"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Campus</label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value as Campus)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Degree Level</label>
                  <select
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="MSc">MSc</option>
                    <option value="PhD">PhD</option>
                    <option value="Sub-Specialty">Sub-Specialty / Fellowship</option>
                    <option value="PostDoc">PostDoc</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Host University / Institution *</label>
                  <input
                    type="text"
                    required
                    value={hostInstitution}
                    onChange={(e) => setHostInstitution(e.target.value)}
                    placeholder="e.g. Addis Ababa University or Oxford"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Host Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Automatic Financial Calculator Card */}
              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 space-y-3">
                <div className="font-bold text-blue-900 flex items-center justify-between">
                  <span>Automated Funding Calculation Engine</span>
                  <span className="text-emerald-700 text-sm font-extrabold">Total: ETB {calculatedTotalCost.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Total Tuition (ETB)</label>
                    <input
                      type="number"
                      value={tuitionFee}
                      onChange={(e) => setTuitionFee(Number(e.target.value))}
                      className="w-full p-1.5 bg-white border border-blue-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Monthly Stipend (ETB)</label>
                    <input
                      type="number"
                      value={monthlyStipend}
                      onChange={(e) => setMonthlyStipend(Number(e.target.value))}
                      className="w-full p-1.5 bg-white border border-blue-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Study Duration (Months)</label>
                    <input
                      type="number"
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(Number(e.target.value))}
                      className="w-full p-1.5 bg-white border border-blue-200 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guarantor Name</label>
                  <input
                    type="text"
                    value={guarantor1Name}
                    onChange={(e) => setGuarantor1Name(e.target.value)}
                    placeholder="Guarantor full name"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guarantor Phone</label>
                  <input
                    type="text"
                    value={guarantor1Phone}
                    onChange={(e) => setGuarantor1Phone(e.target.value)}
                    placeholder="+251 91..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service Bond (Years)</label>
                  <input
                    type="number"
                    value={serviceYears}
                    onChange={(e) => setServiceYears(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAgreementModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Save Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
