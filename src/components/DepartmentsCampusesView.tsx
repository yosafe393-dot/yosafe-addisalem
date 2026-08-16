import React, { useState } from 'react';
import { Building2, MapPin, Briefcase, Search, ArrowRight, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CAMPUSES, DEPARTMENTS } from '../data/mockData';

export const DepartmentsCampusesView: React.FC = () => {
  const { cases, setActiveTab } = useApp();
  const [activeCampus, setActiveCampus] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filteredDepts = DEPARTMENTS.filter(dept => {
    if (search.trim() && !dept.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Building2 className="w-8 h-8 text-sky-600" />
          <span>University Campuses & Departments Registry</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Directory of the 5 University of Gondar Campuses and 25 academic & administrative directorates.
        </p>
      </div>

      {/* 5 Campuses Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {CAMPUSES.map(campus => {
          const campusCases = cases.filter(c => c.campus === campus);
          const activeCount = campusCases.filter(c => c.status !== 'Closed').length;

          return (
            <div
              key={campus}
              onClick={() => setActiveCampus(activeCampus === campus ? 'All' : campus)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeCampus === campus
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <MapPin className={`w-5 h-5 ${activeCampus === campus ? 'text-amber-300' : 'text-blue-600'}`} />
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  activeCampus === campus ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {campusCases.length} Cases
                </span>
              </div>
              <h3 className="font-extrabold text-sm">{campus}</h3>
              <div className={`text-xs mt-1 font-semibold ${activeCampus === campus ? 'text-blue-100' : 'text-slate-500'}`}>
                {activeCount} Active Matters
              </div>
            </div>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter departments..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing 25 University Units
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepts.map(dept => {
          const deptCases = cases.filter(c => c.department === dept);
          const activeCount = deptCases.filter(c => c.status !== 'Closed').length;

          return (
            <div key={dept} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{dept}</h4>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>Total: {deptCases.length}</span>
                  <span>•</span>
                  <span className="text-blue-600 font-semibold">{activeCount} in progress</span>
                </div>
              </div>

              <span className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                {deptCases.length}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
