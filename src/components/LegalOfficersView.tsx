import React, { useState } from 'react';
import { Users, Briefcase, Mail, Phone, MapPin, CheckCircle, Shield, Award, Eye, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LegalOfficersView: React.FC = () => {
  const { users, cases, setSelectedCaseId, setActiveTab } = useApp();
  const [selectedOfficerId, setSelectedOfficerId] = useState<string | null>(null);

  const officers = users.filter(u => u.role === 'legal_officer' || u.role === 'admin');

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-8 h-8 text-purple-600" />
            <span>Legal Officers & Counsel Directory</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Workload balancing, campus counsel assignments, and case resolution tracking.
          </p>
        </div>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {officers.map(off => {
          const officerCases = cases.filter(c => c.assignedOfficerId === off.id || c.assignedOfficerName === off.name);
          const activeCount = officerCases.filter(c => c.status !== 'Closed').length;
          const closedCount = officerCases.filter(c => c.status === 'Closed').length;

          return (
            <div 
              key={off.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={off.avatar}
                    alt={off.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-600/30 shadow-sm flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-base text-slate-900 leading-tight truncate">
                      {off.name}
                    </h3>
                    <div className="text-xs font-semibold text-purple-700 mt-0.5">
                      {off.roleTitle}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{off.campus}</span>
                    </div>
                  </div>
                </div>

                {/* Workload Stats Bar */}
                <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Cases</div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">{officerCases.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-blue-600">Active</div>
                    <div className="text-base font-extrabold text-blue-700 mt-0.5">{activeCount}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-emerald-600">Resolved</div>
                    <div className="text-base font-extrabold text-emerald-700 mt-0.5">{closedCount}</div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{off.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{off.phone}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Assigned Cases preview */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Assigned Docket
                </div>
                {officerCases.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">No cases assigned currently.</div>
                ) : (
                  <div className="space-y-1.5">
                    {officerCases.slice(0, 2).map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => {
                          setSelectedCaseId(c.id);
                          setActiveTab('cases');
                        }}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50/80 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="font-bold text-slate-800 truncate max-w-[150px]">{c.id}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{c.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
