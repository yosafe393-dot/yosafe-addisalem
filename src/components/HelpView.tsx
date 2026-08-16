import React from 'react';
import { HelpCircle, BookOpen, Shield, Users, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <HelpCircle className="w-8 h-8 text-blue-600" />
          <span>User Documentation & Role Guidelines</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Operating manual and procedural guide for University of Gondar Legal Affairs Office.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Role 1: Legal Officer */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3 text-blue-700 font-bold">
            <Briefcase className="w-5 h-5" />
            <h3 className="text-base">1. Legal Officer Workflow</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside leading-relaxed">
            <li>Receive real-time notifications when cases in your campus/specialization are assigned.</li>
            <li>Progress case lifecycle through the workflow stepper: <strong>Newly Registered → Under Review → Investigation → Court Proceeding → In Progress → Closed</strong>.</li>
            <li>Schedule court sessions, hearings, and disciplinary meetings with automated reminders.</li>
            <li>Upload and categorize confidential pleadings and witness statements.</li>
          </ul>
        </div>

        {/* Role 2: Legal Affairs Head / Admin */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3 text-purple-700 font-bold">
            <Users className="w-5 h-5" />
            <h3 className="text-base">2. Legal Affairs Directorate / Admin</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside leading-relaxed">
            <li>Review all intake submissions from university faculties, campuses, and directorates.</li>
            <li>Assign and rebalance caseloads across the 12 Legal Officers.</li>
            <li>Generate analytical reports for University Senate and Management.</li>
            <li>Oversee Postgraduate Scholarship sponsorship agreements and enforce return service bonds.</li>
          </ul>
        </div>

        {/* Role 3: University Staff User */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3 text-emerald-700 font-bold">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-base">3. University Staff & Department User</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside leading-relaxed">
            <li>Submit intake claims, contract breaches, or disciplinary referrals online without physical file movement.</li>
            <li>Attach initial supporting documents (contracts, incident reports).</li>
            <li>Track live case progress, assigned counsel, and scheduled hearing dates.</li>
          </ul>
        </div>

        {/* Role 4: System Administrator */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3 text-slate-900 font-bold">
            <Shield className="w-5 h-5" />
            <h3 className="text-base">4. System Administrator (ICT)</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside leading-relaxed">
            <li>Provision user accounts with Role-Based Access Control (RBAC).</li>
            <li>Maintain Campus (Tedros, Fasiledes, Tseda, Maraki, GC) and Department master data.</li>
            <li>Review immutable security audit logs for compliance.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
