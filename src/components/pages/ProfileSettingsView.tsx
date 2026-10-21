import React, { useState } from 'react';
import { User, Subject } from '../../types';
import {
  UserCircle,
  GraduationCap,
  BookOpen,
  Plus,
  ShieldCheck,
  Check,
  Trash2,
  Sliders,
} from 'lucide-react';

interface ProfileSettingsViewProps {
  currentUser: User | null;
  subjects: Subject[];
  onAddSubject: (subject: Omit<Subject, 'id' | 'userId'>) => void;
  onDeleteSubject: (id: string) => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  currentUser,
  subjects,
  onAddSubject,
  onDeleteSubject,
}) => {
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newFaculty, setNewFaculty] = useState('');
  const [newColor, setNewColor] = useState('#8B5CF6');

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    onAddSubject({
      subjectCode: newCode.trim().toUpperCase(),
      subjectName: newName.trim(),
      credits: Number(newCredits) || 3,
      facultyName: newFaculty.trim() || 'Department Faculty',
      colorHex: newColor,
    });

    setNewCode('');
    setNewName('');
    setNewFaculty('');
    setShowAddCourse(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="pb-2 border-b border-purple-950/60">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Student Profile & Semester Curriculum</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Institutional student identity, enrolled Anna University syllabus courses, and algorithm tuning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Student Identity Card */}
        <div className="p-6 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-amber-500 border border-amber-400/40 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
              {currentUser?.fullName.split(' ').map(n => n[0]).join('') || 'OS'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{currentUser?.fullName}</h2>
              <p className="text-xs text-amber-300 font-mono">{currentUser?.yearOfStudy}</p>
              <p className="text-xs text-slate-400">{currentUser?.department}</p>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-purple-950/60 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Academic Email:</span>
              <span className="font-mono text-purple-200 font-medium">{currentUser?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Institution:</span>
              <span className="text-slate-200 font-medium">{currentUser?.collegeName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Authentication Mechanism:</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Jakarta Session Auth + BCrypt (Salted)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Enrolled Courses Management (Spans 2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Registered Semester Courses</h3>
              <p className="text-xs text-slate-400">Semester IV Computer Science Engineering curriculum.</p>
            </div>

            <button
              onClick={() => setShowAddCourse(!showAddCourse)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>
          </div>

          {/* Add Course Form Drawer */}
          {showAddCourse && (
            <form onSubmit={handleCreateCourse} className="p-4 rounded-xl border border-amber-400/30 bg-[#180b33] space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Add New Course</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS3401"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-[#0e051c] border border-purple-900/60 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Course Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Compiler Design"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-[#0e051c] border border-purple-900/60 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Faculty In-Charge</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. K. Rajesh"
                    value={newFaculty}
                    onChange={(e) => setNewFaculty(e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-[#0e051c] border border-purple-900/60 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-1">Credits</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={newCredits}
                      onChange={(e) => setNewCredits(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded bg-[#0e051c] border border-purple-900/60 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Tag Color</label>
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-full h-8 rounded bg-[#0e051c] border border-purple-900/60 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded cursor-pointer"
                >
                  Save Course
                </button>
              </div>
            </form>
          )}

          {/* Courses Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold text-slate-400 border-b border-purple-950/60 uppercase">
                <tr>
                  <th className="pb-2">Code</th>
                  <th className="pb-2">Course Title</th>
                  <th className="pb-2">Credits</th>
                  <th className="pb-2">Faculty</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-950/40">
                {subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-purple-950/20">
                    <td className="py-2.5 font-mono font-bold text-amber-400">
                      {sub.subjectCode}
                    </td>
                    <td className="py-2.5 text-slate-200 font-medium">
                      {sub.subjectName}
                    </td>
                    <td className="py-2.5 font-mono text-slate-400">
                      {sub.credits} credits
                    </td>
                    <td className="py-2.5 text-slate-400">
                      {sub.facultyName || 'Department Faculty'}
                    </td>
                    <td className="py-2.5 text-right">
                      {subjects.length > 1 && (
                        <button
                          onClick={() => onDeleteSubject(sub.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Remove subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Transparent Algorithm Weights Inspector */}
      <div className="p-6 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-purple-950/60">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Academic Flow Intelligence · Formula & Scoring Weights</span>
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic priority formula: <code className="text-amber-300 font-mono">Flow Score = Priority Weight + Category Weight + Proximity Urgency</code>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-3.5 rounded-lg border border-purple-900/40 bg-[#190c30] space-y-2">
            <h4 className="font-semibold text-amber-300">1. Priority Level Weights</h4>
            <ul className="space-y-1 text-slate-300 font-mono">
              <li className="flex justify-between"><span>Critical</span><span className="text-amber-400">+100 pts</span></li>
              <li className="flex justify-between"><span>High</span><span className="text-amber-400">+75 pts</span></li>
              <li className="flex justify-between"><span>Medium</span><span className="text-amber-400">+50 pts</span></li>
              <li className="flex justify-between"><span>Low</span><span className="text-amber-400">+25 pts</span></li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg border border-purple-900/40 bg-[#190c30] space-y-2">
            <h4 className="font-semibold text-amber-300">2. Academic Category Weights</h4>
            <ul className="space-y-1 text-slate-300 font-mono">
              <li className="flex justify-between"><span>Examination</span><span className="text-purple-300">+25 pts</span></li>
              <li className="flex justify-between"><span>Project</span><span className="text-purple-300">+20 pts</span></li>
              <li className="flex justify-between"><span>Laboratory Record</span><span className="text-purple-300">+15 pts</span></li>
              <li className="flex justify-between"><span>Presentation</span><span className="text-purple-300">+15 pts</span></li>
              <li className="flex justify-between"><span>Assignment</span><span className="text-purple-300">+10 pts</span></li>
              <li className="flex justify-between"><span>General</span><span className="text-purple-300">+5 pts</span></li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg border border-purple-900/40 bg-[#190c30] space-y-2">
            <h4 className="font-semibold text-amber-300">3. Deadline Proximity Multiplier</h4>
            <ul className="space-y-1 text-slate-300 font-mono">
              <li className="flex justify-between"><span>Overdue (Recovery)</span><span className="text-rose-400">+150 pts</span></li>
              <li className="flex justify-between"><span>Due &le; 24 Hours</span><span className="text-amber-400">+100 pts</span></li>
              <li className="flex justify-between"><span>Due &le; 48 Hours</span><span className="text-amber-400">+75 pts</span></li>
              <li className="flex justify-between"><span>Due &le; 7 Days</span><span className="text-slate-300">+45 pts</span></li>
              <li className="flex justify-between"><span>Due &le; 14 Days</span><span className="text-slate-300">+20 pts</span></li>
              <li className="flex justify-between"><span>Completed Task</span><span className="text-emerald-400">0 pts (Excluded)</span></li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};
