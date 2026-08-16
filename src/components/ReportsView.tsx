import React, { useState } from 'react';
import { BarChart3, Download, Printer, FileSpreadsheet, Filter, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CASE_CATEGORIES } from '../data/mockData';

export const ReportsView: React.FC = () => {
  const { cases, scholarships } = useApp();
  const [reportType, setReportType] = useState('executive_summary');

  const totalCases = 135;
  const activeCases = cases.filter(c => c.status !== 'Closed').length;
  const closedCases = cases.filter(c => c.status === 'Closed').length;

  const totalFinancialExposure = cases.reduce((acc, c) => acc + (c.estimatedFinancialImpact || 0), 0);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Case ID,Title,Category,Department,Campus,Officer,Status,Priority,Opened Date\n"
      + cases.map(c => `"${c.id}","${c.title}","${c.category}","${c.department}","${c.campus}","${c.assignedOfficerName || ''}","${c.status}","${c.priority}","${c.dateOpened}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "UOG_Legal_Affairs_Case_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <span>Executive Legal Affairs & Compliance Reports</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Generate formal administrative summaries, resolution rate metrics, and financial risk assessments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Overall Case Resolution Rate</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">60.0%</div>
          <div className="text-[11px] text-slate-400 mt-1">81 resolved of 135 total docket</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Total Legal Financial Exposure</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ETB {(totalFinancialExposure / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Contract claims & property values</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Active Scholarship Bonds</div>
          <div className="text-2xl font-black text-blue-600 mt-1">ETB 7.2M</div>
          <div className="text-[11px] text-slate-400 mt-1">Sponsored academic staff liability</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Pending High-Court Injunctions</div>
          <div className="text-2xl font-black text-purple-600 mt-1">18 Cases</div>
          <div className="text-[11px] text-slate-400 mt-1">Under judicial proceeding</div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">Litigation Risk by Category Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Case Count</th>
                <th className="py-3 px-4">% of Total Docket</th>
                <th className="py-3 px-4">Typical Resolution Timeline</th>
                <th className="py-3 px-4">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {CASE_CATEGORIES.map(c => (
                <tr key={c.name} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span>{c.name}</span>
                  </td>
                  <td className="py-3 px-4 font-bold">{c.count}</td>
                  <td className="py-3 px-4 font-semibold text-slate-600">{c.percentage}</td>
                  <td className="py-3 px-4 text-slate-500">45 - 90 Days</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      c.name === 'Court Cases' || c.name === 'Property Matters' ? 'bg-rose-50 text-rose-700' :
                      c.name === 'Contract Disputes' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {c.name === 'Court Cases' || c.name === 'Property Matters' ? 'High Risk' : 'Moderate'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
