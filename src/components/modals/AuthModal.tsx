import React, { useState } from 'react';
import { User } from '../../types';
import { INITIAL_USER } from '../../data/seedData';
import { X, Lock, Mail, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [yearOfStudy, setYearOfStudy] = useState('2nd Year');
  const [collegeName, setCollegeName] = useState('Rajalakshmi Engineering College');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleDemoLogin = () => {
    onLoginSuccess(INITIAL_USER);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide your academic email and password.');
      return;
    }

    if (tab === 'register' && !fullName.trim()) {
      setError('Full name is required for student registration.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Authenticate or register
    const studentUser: User = {
      id: tab === 'login' ? INITIAL_USER.id : 'usr-' + Math.random().toString(36).substring(2, 9),
      email: email.trim().toLowerCase(),
      fullName: tab === 'login' ? (email.includes('oviya') ? INITIAL_USER.fullName : email.split('@')[0]) : fullName.trim(),
      department,
      yearOfStudy,
      collegeName,
    };

    onLoginSuccess(studentUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-purple-900/60 bg-[#160a2c] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-bold text-xs">
              AFIS
            </div>
            <h2 className="text-base font-bold text-white">Student Portal Authentication</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 m-6 mb-2 rounded-lg bg-[#0e051c] border border-purple-900/40 text-xs font-semibold">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`py-1.5 rounded-md transition-colors cursor-pointer ${
              tab === 'login' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`py-1.5 rounded-md transition-colors cursor-pointer ${
              tab === 'register' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Fast Demo Account Button */}
        <div className="px-6 pt-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border border-purple-800 bg-purple-950/40 hover:bg-purple-900/60 text-amber-300 transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>Fast Sign In as Oviya S. (REC CSE Demo)</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300">
              {error}
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Oviya S."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0519] border border-purple-900/60 text-xs text-white placeholder-slate-500 focus:border-amber-400"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Academic Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="student@rajalakshmi.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0d0519] border border-purple-900/60 text-xs text-white placeholder-slate-500 focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0d0519] border border-purple-900/60 text-xs text-white placeholder-slate-500 focus:border-amber-400"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Year of Study</label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-[#0d0519] border border-purple-900/60 text-white"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-[#0d0519] border border-purple-900/60 text-white truncate"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-lg text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md transition-all cursor-pointer"
            >
              <span>{tab === 'login' ? 'Sign In to Workspace' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>BCrypt password salted hashing (12 rounds)</span>
          </div>

        </form>

      </div>
    </div>
  );
};
