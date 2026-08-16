import React from 'react';
import { Bell, CheckCheck, Trash2, Calendar, FileText, UserPlus, AlertCircle, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, setSelectedCaseId, setActiveTab } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-8 h-8 text-amber-500" />
            <span>Notification & Alert Stream</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Real-time notifications for case assignments, upcoming court dates, and uploaded evidence.
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => {
              markNotificationAsRead(n.id);
              if (n.caseId) {
                setSelectedCaseId(n.caseId);
                setActiveTab('cases');
              }
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              n.read ? 'bg-white border-slate-200/80' : 'bg-blue-50/50 border-blue-200 shadow-xs'
            }`}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              n.type === 'assignment' ? 'bg-emerald-100 text-emerald-700' :
              n.type === 'hearing' ? 'bg-blue-100 text-blue-700' :
              n.type === 'document' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
            }`}>
              {n.type === 'assignment' ? <UserPlus className="w-5 h-5" /> :
               n.type === 'hearing' ? <Calendar className="w-5 h-5" /> :
               n.type === 'document' ? <FileText className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                <span className="text-xs text-slate-400 font-medium">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
              {n.caseId && (
                <div className="mt-2 text-xs font-bold text-blue-600 flex items-center gap-1">
                  <span>Open Case {n.caseId}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
