import React, { useState } from 'react';
import { FileText, Download, Search, Shield, Eye, Filter, Lock, FileCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DocumentsView: React.FC = () => {
  const { cases, setSelectedCaseId, setActiveTab } = useApp();
  const [search, setSearch] = useState('');
  const [confidentialityFilter, setConfidentialityFilter] = useState('All');

  // Aggregate all documents from all cases
  const allDocs = cases.flatMap(c => c.documents.map(d => ({ ...d, caseTitle: c.title, campus: c.campus, department: c.department })));

  const filteredDocs = allDocs.filter(d => {
    if (confidentialityFilter !== 'All' && d.confidentiality !== confidentialityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return d.fileName.toLowerCase().includes(q) || d.caseId.toLowerCase().includes(q) || d.caseTitle.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-8 h-8 text-blue-600" />
            <span>Document Repository & Evidence Vault</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Encrypted storage and centralized access for court pleadings, contract agreements, and witness statements.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search document file name or Case ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Classification:</span>
          <select
            value={confidentialityFilter}
            onChange={(e) => setConfidentialityFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
          >
            <option value="All">All Classifications</option>
            <option value="Public Record">Public Record</option>
            <option value="Confidential">Confidential</option>
            <option value="Restricted Evidence">Restricted Evidence</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
                  PDF
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  doc.confidentiality === 'Restricted Evidence' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                  doc.confidentiality === 'Confidential' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {doc.confidentiality}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 mt-3 truncate" title={doc.fileName}>
                {doc.fileName}
              </h4>
              <div className="text-xs text-slate-500 mt-0.5">
                Size: {doc.fileSize} • Uploaded: {doc.uploadedAt}
              </div>

              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="font-semibold text-blue-700">{doc.caseId}</div>
                <div className="text-slate-600 truncate">{doc.caseTitle}</div>
                <div className="text-[11px] text-slate-400 mt-1">By: {doc.uploadedBy}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setSelectedCaseId(doc.caseId);
                  setActiveTab('cases');
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                View Case
              </button>

              <button
                onClick={() => alert(`Simulating secure download for document: ${doc.fileName}`)}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
