import React, { useState } from 'react';
import { ShieldCheck, UserPlus, UserX, CheckCircle, Search, Mail, Phone, Building2, MapPin, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole, Campus } from '../types';
import { CAMPUSES, DEPARTMENTS } from '../data/mockData';

export const AdminUserManagementView: React.FC = () => {
  const { users, addUser, updateUserRole, toggleUserStatus, currentUser } = useApp();
  const [isAddUserModal, setIsAddUserModal] = useState(false);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('legal_officer');
  const [roleTitle, setRoleTitle] = useState('Legal Officer');
  const [department, setDepartment] = useState('Legal Affairs Office');
  const [campus, setCampus] = useState<Campus>('GC (Main Campus)');
  const [phone, setPhone] = useState('+251 91 ');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addUser({
      name,
      email,
      role,
      roleTitle,
      avatar: `https://images.unsplash.com/photo-${Math.floor(1500000000000 + Math.random() * 90000000000)}?w=150&auto=format&fit=crop&q=80`,
      department,
      campus,
      phone,
      status: 'Active',
      assignedCasesCount: 0
    });

    setIsAddUserModal(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <span>User Accounts & Role-Based Access Control (RBAC)</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage university personnel accounts, permissions (Admin, Legal Officer, Staff User, SysAdmin), and security status.
          </p>
        </div>

        <button
          onClick={() => setIsAddUserModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Department & Campus</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Modify Role</th>
                <th className="py-3.5 px-4 text-center">Account Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100" />
                      <div>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-900 block">{u.roleTitle}</span>
                    <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{u.department}</div>
                    <div className="text-[11px] text-slate-400">{u.campus}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-slate-600">{u.phone}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      u.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                      className="p-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      <option value="legal_officer">Legal Officer</option>
                      <option value="admin">Admin / Director</option>
                      <option value="user">University Staff</option>
                      <option value="system_admin">System Admin</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        u.status === 'Active' 
                          ? 'text-rose-600 hover:bg-rose-50' 
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0a1931] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Provision New User Account</h3>
              <button onClick={() => setIsAddUserModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Yohannes Mengesha"
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Official University Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@uog.edu.et"
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">System Role</label>
                  <select
                    value={role}
                    onChange={(e) => {
                      const r = e.target.value as UserRole;
                      setRole(r);
                      setRoleTitle(r === 'legal_officer' ? 'Legal Officer' : r === 'admin' ? 'Legal Affairs Director' : r === 'system_admin' ? 'System Administrator' : 'Staff User');
                    }}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  >
                    <option value="legal_officer">Legal Officer</option>
                    <option value="admin">Admin / Director</option>
                    <option value="user">University Staff</option>
                    <option value="system_admin">System Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Campus</label>
                  <select
                    value={campus}
                    onChange={(e) => setCampus(e.target.value as Campus)}
                    className="w-full p-2 bg-slate-50 border rounded-lg"
                  >
                    {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-lg"
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
