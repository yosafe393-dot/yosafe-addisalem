import React, { useState } from 'react';
import { 
  Folder, 
  FileCheck2, 
  CheckCircle, 
  Users, 
  Building2, 
  Calendar, 
  Clock, 
  MapPin, 
  Eye, 
  ChevronRight, 
  ArrowUpRight, 
  UserPlus, 
  FileText, 
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CASE_CATEGORIES, MONTHLY_OVERVIEW_DATA } from '../data/mockData';
import { CaseStatus, CasePriority, LegalCase } from '../types';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    cases, 
    notifications, 
    setActiveTab, 
    setSelectedCaseId, 
    setIsNewCaseModalOpen 
  } = useApp();

  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(4); // default May
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Status and priority badge helper
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
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Low':
      default:
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
  };

  const handleViewCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('cases');
  };

  // SVG Chart Calculation Helpers
  const chartWidth = 520;
  const chartHeight = 180;
  const paddingX = 35;
  const paddingY = 25;
  const graphWidth = chartWidth - paddingX * 2;
  const graphHeight = chartHeight - paddingY * 2;
  const maxVal = 50;

  const getX = (index: number) => paddingX + (index / (MONTHLY_OVERVIEW_DATA.length - 1)) * graphWidth;
  const getY = (val: number) => chartHeight - paddingY - (val / maxVal) * graphHeight;

  // Build SVG Path strings
  const registeredPoints = MONTHLY_OVERVIEW_DATA.map((d, i) => `${getX(i)},${getY(d.registered)}`).join(' ');
  const activePoints = MONTHLY_OVERVIEW_DATA.map((d, i) => `${getX(i)},${getY(d.active)}`).join(' ');
  const closedPoints = MONTHLY_OVERVIEW_DATA.map((d, i) => `${getX(i)},${getY(d.closed)}`).join(' ');

  // Donut chart calculations
  const totalCategoryCases = 135;
  let cumulativeAngle = 0;
  const donutSegments = CASE_CATEGORIES.map(cat => {
    const angle = (cat.count / totalCategoryCases) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return { ...cat, startAngle, angle };
  });

  // Calculate SVG donut paths
  const createArc = (startAngle: number, endAngle: number, innerR: number, outerR: number) => {
    const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
    const x1 = 100 + outerR * Math.cos(toRad(startAngle));
    const y1 = 100 + outerR * Math.sin(toRad(startAngle));
    const x2 = 100 + outerR * Math.cos(toRad(endAngle));
    const y2 = 100 + outerR * Math.sin(toRad(endAngle));

    const x3 = 100 + innerR * Math.cos(toRad(endAngle));
    const y3 = 100 + innerR * Math.sin(toRad(endAngle));
    const x4 = 100 + innerR * Math.cos(toRad(startAngle));
    const y4 = 100 + innerR * Math.sin(toRad(startAngle));

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <span className="text-2xl">👋</span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Here's what's happening with legal affairs today.
          </p>
        </div>

        {/* Date Card */}
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs self-start sm:self-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 leading-tight">
              May 20, 2025
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              Tuesday
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Stats Cards (5 Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Cases */}
        <div 
          id="stat-card-total-cases"
          onClick={() => setActiveTab('cases')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Folder className="w-5 h-5 fill-blue-600/20" />
          </div>
          <div className="text-xs font-semibold text-slate-500">Total Cases</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 my-1">
            135
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 mt-2">
            <span>See all cases</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Active Cases */}
        <div 
          id="stat-card-active-cases"
          onClick={() => setActiveTab('cases')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-slate-500">Active Cases</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 my-1">
            42
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-2">
            <span>31.1% of total cases</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Closed Cases */}
        <div 
          id="stat-card-closed-cases"
          onClick={() => setActiveTab('cases')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-slate-500">Closed Cases</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 my-1">
            81
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-2">
            <span>60% of total cases</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Legal Officers */}
        <div 
          id="stat-card-legal-officers"
          onClick={() => setActiveTab('officers')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-slate-500">Legal Officers</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 my-1">
            12
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-purple-600 mt-2">
            <span>View all officers</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Departments */}
        <div 
          id="stat-card-departments"
          onClick={() => setActiveTab('departments')}
          className="col-span-2 sm:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-slate-500">Departments</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 my-1">
            25
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-sky-600 mt-2">
            <span>View all departments</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Charts & Upcoming Hearings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Cases Overview Multi-Line Chart (5 Cols on large) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <h3 className="text-base font-bold text-slate-900">
                Cases Overview <span className="text-xs font-normal text-slate-400">(This Year)</span>
              </h3>
              
              {/* Legends */}
              <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-blue-600 rounded-full inline-block" />
                  Registered
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-amber-500 rounded-full inline-block" />
                  Active
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-emerald-500 rounded-full inline-block" />
                  Closed
                </span>
              </div>
            </div>

            {/* Interactive SVG Multi-Line Curve Graph */}
            <div className="relative mt-4 w-full aspect-[16/9] sm:aspect-[2/1]">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                {/* Horizontal Grid lines */}
                {[0, 10, 20, 30, 40, 50].map((val) => {
                  const y = getY(val);
                  return (
                    <g key={val}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={chartWidth - paddingX}
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                        strokeDasharray={val === 0 ? "none" : "2,2"}
                      />
                      <text
                        x={paddingX - 10}
                        y={y + 3.5}
                        fontSize="9"
                        fill="#94a3b8"
                        textAnchor="end"
                        fontWeight="500"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Connecting Lines */}
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={registeredPoints}
                />
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={activePoints}
                />
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={closedPoints}
                />

                {/* Interactive Points on Month */}
                {MONTHLY_OVERVIEW_DATA.map((d, i) => {
                  const x = getX(i);
                  const isHovered = hoveredMonthIndex === i;
                  return (
                    <g 
                      key={d.month}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredMonthIndex(i)}
                    >
                      {/* Vertical highlight bar on hover */}
                      {isHovered && (
                        <line
                          x1={x}
                          y1={paddingY}
                          x2={x}
                          y2={chartHeight - paddingY}
                          stroke="#cbd5e1"
                          strokeWidth="1"
                          strokeDasharray="3,3"
                        />
                      )}

                      {/* Registered dot */}
                      <circle
                        cx={x}
                        cy={getY(d.registered)}
                        r={isHovered ? "5" : "3.5"}
                        fill="#2563eb"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      {/* Active dot */}
                      <circle
                        cx={x}
                        cy={getY(d.active)}
                        r={isHovered ? "5" : "3.5"}
                        fill="#f59e0b"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      {/* Closed dot */}
                      <circle
                        cx={x}
                        cy={getY(d.closed)}
                        r={isHovered ? "5" : "3.5"}
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />

                      {/* Month label */}
                      <text
                        x={x}
                        y={chartHeight - 6}
                        fontSize="9.5"
                        fill={isHovered ? "#0f172a" : "#64748b"}
                        fontWeight={isHovered ? "700" : "500"}
                        textAnchor="middle"
                      >
                        {d.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Month summary highlight */}
          {hoveredMonthIndex !== null && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">
                {MONTHLY_OVERVIEW_DATA[hoveredMonthIndex].month} 2025 Metric:
              </span>
              <div className="flex items-center gap-3">
                <span className="text-blue-700 font-semibold">
                  Registered: {MONTHLY_OVERVIEW_DATA[hoveredMonthIndex].registered}
                </span>
                <span className="text-amber-700 font-semibold">
                  Active: {MONTHLY_OVERVIEW_DATA[hoveredMonthIndex].active}
                </span>
                <span className="text-emerald-700 font-semibold">
                  Closed: {MONTHLY_OVERVIEW_DATA[hoveredMonthIndex].closed}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Cases by Category Donut Chart (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-base font-bold text-slate-900">Cases by Category</h3>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4 my-2">
            {/* Donut graphic */}
            <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                {donutSegments.map((segment) => {
                  const path = createArc(
                    segment.startAngle,
                    segment.startAngle + segment.angle - 1.5,
                    52,
                    82
                  );
                  const isHovered = hoveredCategory === segment.name;
                  return (
                    <path
                      key={segment.name}
                      d={path}
                      fill={segment.color}
                      className="transition-all duration-200 cursor-pointer hover:opacity-85"
                      onMouseEnter={() => setHoveredCategory(segment.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      transform={isHovered ? "scale(1.03) translate(-3, -3)" : ""}
                    />
                  );
                })}
              </svg>

              {/* Center text inside donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-slate-900">135</span>
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total</span>
              </div>
            </div>

            {/* Legend breakdown list */}
            <div className="flex-1 w-full space-y-1.5 text-xs">
              {CASE_CATEGORIES.map((cat) => (
                <div 
                  key={cat.name}
                  onMouseEnter={() => setHoveredCategory(cat.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex items-center justify-between p-1 rounded-lg transition-colors cursor-pointer ${
                    hoveredCategory === cat.name ? 'bg-slate-100 font-bold' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span 
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-slate-700 truncate font-medium">{cat.name}</span>
                  </div>
                  <div className="text-slate-500 font-semibold flex items-center gap-1 flex-shrink-0">
                    <span>{cat.count}</span>
                    <span className="text-[11px] text-slate-400">({cat.percentage})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Upcoming Hearings Card (3 Cols) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Upcoming Hearings</h3>
              <button 
                onClick={() => setActiveTab('hearings')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {/* Item 1 */}
              <div 
                onClick={() => handleViewCase('UOG/2025/C/045')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex flex-col items-center justify-center flex-shrink-0 font-bold">
                    <span className="text-[10px] uppercase tracking-wider text-blue-600 font-extrabold">MAY</span>
                    <span className="text-base leading-none">21</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      Case: UOG/2025/C/045
                    </div>
                    <div className="text-xs text-slate-600 truncate mt-0.5">
                      Contract Dispute
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        10:00 AM
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        Court Room 2
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div 
                onClick={() => handleViewCase('UOG/2025/EMP/032')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex flex-col items-center justify-center flex-shrink-0 font-bold">
                    <span className="text-[10px] uppercase tracking-wider text-blue-600 font-extrabold">MAY</span>
                    <span className="text-base leading-none">23</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      Case: UOG/2025/EMP/032
                    </div>
                    <div className="text-xs text-slate-600 truncate mt-0.5">
                      Employment Matter
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        09:30 AM
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        Court Room 1
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div 
                onClick={() => handleViewCase('UOG/2025/DISC/018')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex flex-col items-center justify-center flex-shrink-0 font-bold">
                    <span className="text-[10px] uppercase tracking-wider text-blue-600 font-extrabold">MAY</span>
                    <span className="text-base leading-none">27</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      Case: UOG/2025/DISC/018
                    </div>
                    <div className="text-xs text-slate-600 truncate mt-0.5">
                      Disciplinary Case
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        11:00 AM
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        Court Room 3
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('hearings')}
            className="w-full mt-3 py-2 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 border-t border-slate-100 pt-3"
          >
            <span>View full calendar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Bottom Section: Recent Cases Table & Live Notifications Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Cases Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-900">Recent Cases</h3>
            <button
              onClick={() => setActiveTab('cases')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 font-semibold border-b border-slate-100">
                  <th className="pb-3 pr-3 font-semibold">Case ID</th>
                  <th className="pb-3 pr-3 font-semibold">Title</th>
                  <th className="pb-3 pr-3 font-semibold">Department</th>
                  <th className="pb-3 pr-3 font-semibold">Officer</th>
                  <th className="pb-3 pr-3 font-semibold">Status</th>
                  <th className="pb-3 pr-3 font-semibold">Priority</th>
                  <th className="pb-3 pr-3 font-semibold">Date Opened</th>
                  <th className="pb-3 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {cases.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 pr-3 font-bold text-slate-900 whitespace-nowrap">
                      {c.id}
                    </td>
                    <td className="py-3.5 pr-3 max-w-[180px] font-medium truncate text-slate-800">
                      {c.title}
                    </td>
                    <td className="py-3.5 pr-3 text-slate-600 whitespace-nowrap">
                      {c.department}
                    </td>
                    <td className="py-3.5 pr-3 text-slate-800 font-medium whitespace-nowrap">
                      {c.assignedOfficerName || 'Unassigned'}
                    </td>
                    <td className="py-3.5 pr-3 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getPriorityBadge(c.priority)}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 text-slate-500 whitespace-nowrap">
                      {new Date(c.dateOpened).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleViewCase(c.id)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center"
                        title="View Case Details"
                        aria-label={`View Case ${c.id}`}
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

        {/* Live Notifications (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Notifications</h3>
              <button
                onClick={() => setActiveTab('notifications')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {notifications.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.caseId) handleViewCase(n.caseId);
                  }}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 transition-colors cursor-pointer flex items-start gap-3"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    n.type === 'assignment' ? 'bg-emerald-100 text-emerald-700' :
                    n.type === 'hearing' ? 'bg-blue-100 text-blue-700' :
                    n.type === 'document' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {n.type === 'assignment' ? <UserPlus className="w-4 h-4" /> :
                     n.type === 'hearing' ? <Calendar className="w-4 h-4" /> :
                     n.type === 'document' ? <FileText className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-800 leading-snug">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block font-medium">
                      {n.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Role-Based Alert Stream</span>
            <span className="font-semibold text-blue-600">{currentUser.roleTitle}</span>
          </div>
        </div>
      </div>

      {/* 5. Bottom Navigation links / Footer info */}
      <footer className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          © 2025 University of Gondar Legal Affairs Office. All rights reserved.
        </div>
        <div className="flex items-center gap-4 font-medium">
          <button onClick={() => setActiveTab('help')} className="hover:text-blue-600 transition-colors">Privacy Policy</button>
          <span>•</span>
          <button onClick={() => setActiveTab('help')} className="hover:text-blue-600 transition-colors">Terms of Use</button>
          <span>•</span>
          <button onClick={() => setActiveTab('help')} className="hover:text-blue-600 transition-colors">Contact Us</button>
        </div>
      </footer>
    </div>
  );
};
