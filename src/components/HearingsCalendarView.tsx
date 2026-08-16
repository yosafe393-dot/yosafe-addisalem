import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Scale, 
  Plus, 
  Search, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Hearing } from '../types';

export const HearingsCalendarView: React.FC = () => {
  const { cases, setSelectedCaseId, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState('All');

  // Aggregate all hearings across all cases
  const allHearings = cases.flatMap(c => c.hearings.map(h => ({ ...h, department: c.department, campus: c.campus })));

  const filteredHearings = allHearings.filter(h => {
    if (filterType !== 'All' && h.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-8 h-8 text-blue-600" />
            <span>Court Hearings & Meeting Sessions</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Official docket calendar for High Court hearings, University Senate tribunals & disciplinary inquiries.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto text-xs font-semibold">
        {['All', 'Court Hearing', 'Disciplinary Committee', 'Internal Mediation'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filterType === type 
                ? 'bg-blue-600 text-white font-bold shadow-xs' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {type === 'All' ? 'All Scheduled Sessions' : type}
          </button>
        ))}
      </div>

      {/* Hearings Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHearings.map(h => (
          <div 
            key={h.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex items-start gap-4"
          >
            {/* Calendar Date Block */}
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200/80 flex flex-col items-center justify-center font-bold flex-shrink-0">
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-600">
                {new Date(h.date).toLocaleString('default', { month: 'short' })}
              </span>
              <span className="text-xl leading-none font-black text-slate-900">
                {h.date.split('-')[2] || '21'}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {h.type}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {h.status}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 mt-1 truncate">
                {h.caseTitle}
              </h3>
              <div className="text-xs font-semibold text-blue-600">
                Case ID: {h.caseId}
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Time: {h.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{h.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5 text-slate-400" />
                  <span>Presiding: {h.judgeOrChair}</span>
                </div>
              </div>

              {h.notes && (
                <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                  {h.notes}
                </p>
              )}

              <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedCaseId(h.caseId);
                    setActiveTab('cases');
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Open Case Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
