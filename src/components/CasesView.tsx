import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Briefcase, 
  Building2, 
  MapPin, 
  User, 
  Calendar, 
  FileText, 
  Eye, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileCheck,
  X,
  LayoutGrid,
  ListFilter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CAMPUSES, DEPARTMENTS } from '../data/mockData';
import { CaseStatus, CasePriority, CaseCategory, Campus, LegalCase } from '../types';

export const CasesView: React.FC = () => {
  const { 
    cases, 
    currentUser, 
    users, 
    searchQuery, 
    setSearchQuery, 
    setSelectedCaseId, 
    setIsNewCaseModalOpen 
  } = useApp();

  const [selectedCampus, setSelectedCampus] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedOfficer, setSelectedOfficer] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [onlyMyCases, setOnlyMyCases] = useState<boolean>(currentUser.role === 'legal_officer');

  const legalOfficers = users.filter(u => u.role === 'legal_officer');

  // Multi-facet filtering logic
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      // Role scope filter
      if (onlyMyCases && currentUser.role === 'legal_officer') {
        if (c.assignedOfficerId !== currentUser.id && c.assignedOfficerName !== currentUser.name) {
          return false;
        }
      }

      // Search query (case ID, title, summary, department, officer, plaintiff, defendant)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.plaintiff.toLowerCase().includes(q) ||
          c.defendant.toLowerCase().includes(q) ||
          (c.assignedOfficerName && c.assignedOfficerName.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (selectedCampus !== 'All' && c.campus !== selectedCampus) return false;
      if (selectedDepartment !== 'All' && c.department !== selectedDepartment) return false;
      if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
      if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
      if (selectedPriority !== 'All' && c.priority !== selectedPriority) return false;
      if (selectedOfficer !== 'All' && c.assignedOfficerId !== selectedOfficer) return false;

      return true;
    });
  }, [
    cases, 
    searchQuery, 
    selectedCampus, 
    selectedDepartment, 
    selectedCategory, 
    selectedStatus, 
    selectedPriority, 
    selectedOfficer, 
    onlyMyCases, 
    currentUser
  ]);

  const resetFilters = () => {
    setSelectedCampus('All');
    setSelectedDepartment('All');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedPriority('All');
    setSelectedOfficer('All');
    setSearchQuery('');
    setOnlyMyCases(false);
  };

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'Under Review':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Investigation':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Court Proceeding':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'In Progress':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'Closed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Newly Registered':
      default:
        return 'bg-sky-50 text-sky-700 border border-sky-200';
    }
  };

  const getPriorityBadge = (priority: CasePriority) => {
    switch (priority) {
      case 'Urgent':
      case 'High':
        return 'bg-rose-50 text-rose-700 border border-rose-200 font-bold';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Low':
      default:
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Case Management</span>
            <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {filteredCases.length} Cases
            </span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Central repository for legal claims, student disciplinary, contracts, property & employment cases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role === 'legal_officer' && (
            <button
              onClick={() => setOnlyMyCases(!onlyMyCases)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                onlyMyCases 
                  ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {onlyMyCases ? '✓ Showing My Assigned Cases' : 'Show Only My Cases'}
            </button>
          )}

          <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <ListFilter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${
                viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            id="btn-register-case-page"
            onClick={() => setIsNewCaseModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Case</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Structured Case Filters</span>
          </div>

          {(selectedCampus !== 'All' || selectedDepartment !== 'All' || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedPriority !== 'All' || selectedOfficer !== 'All' || searchQuery) && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {/* Campus Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Campus</label>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="All">All Campuses</option>
              {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Contract Disputes">Contract Disputes</option>
              <option value="Employment Matters">Employment Matters</option>
              <option value="Disciplinary Cases">Disciplinary Cases</option>
              <option value="Property Matters">Property Matters</option>
              <option value="Court Cases">Court Cases</option>
              <option value="Scholarship Agreements">Scholarship Agreements</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Newly Registered">Newly Registered</option>
              <option value="Under Review">Under Review</option>
              <option value="Investigation">Investigation</option>
              <option value="Court Proceeding">Court Proceeding</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Assigned Officer Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Assigned Officer</label>
            <select
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="All">All Officers</option>
              {legalOfficers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Case List Display */}
      {filteredCases.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No cases match your filter criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, campus, or department filters to locate existing records.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200/80">
                  <th className="py-3.5 px-4">Case ID</th>
                  <th className="py-3.5 px-4">Title & Subject</th>
                  <th className="py-3.5 px-4">Campus & Dept</th>
                  <th className="py-3.5 px-4">Parties Involved</th>
                  <th className="py-3.5 px-4">Assigned Officer</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Opened</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCases.map(c => (
                  <tr 
                    key={c.id} 
                    onClick={() => setSelectedCaseId(c.id)}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <div className="font-bold text-slate-900 truncate">{c.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{c.category}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{c.department}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {c.campus}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[180px]">
                      <div className="text-slate-800 font-medium truncate">
                        <span className="text-[10px] text-slate-400 font-bold">P: </span>{c.plaintiff}
                      </div>
                      <div className="text-slate-500 text-[11px] truncate">
                        <span className="text-[10px] text-slate-400 font-bold">D: </span>{c.defendant}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {c.assignedOfficerName ? (
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                          <span>{c.assignedOfficerName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getPriorityBadge(c.priority)}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(c.dateOpened).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCaseId(c.id);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-100/70 rounded-lg transition-colors inline-flex items-center justify-center font-bold"
                        title="View Full Case Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCases.map(c => (
            <div
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {c.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getPriorityBadge(c.priority)}`}>
                      {c.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1 mb-1">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {c.summary}
                </p>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Campus:</span>
                    <span className="font-semibold text-slate-800">{c.campus} ({c.department})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Officer:</span>
                    <span className="font-semibold text-blue-600">{c.assignedOfficerName || 'Unassigned'}</span>
                  </div>
                  {c.estimatedFinancialImpact ? (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Claim Amount:</span>
                      <span className="font-bold text-slate-900">ETB {c.estimatedFinancialImpact.toLocaleString()}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Opened {c.dateOpened}</span>
                <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:underline">
                  <span>View Details</span>
                  <Eye className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
