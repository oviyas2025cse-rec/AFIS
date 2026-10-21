import React from 'react';
import { ActivePage } from '../../types';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Server,
  ArrowRight,
  Clock,
  BarChart2,
  Database,
  FileCheck2,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreBackend: () => void;
  setActivePage: (page: ActivePage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreBackend,
  setActivePage,
}) => {
  return (
    <div className="space-y-16 pb-16 max-w-6xl mx-auto px-4">
      
      {/* Hero Section */}
      <section className="pt-10 pb-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-medium">
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span>Rajalakshmi Engineering College · Computer Science & Engineering</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight text-balance">
          AFIS — Academic Flow Intelligence System
        </h1>

        <p className="text-xl md:text-2xl font-medium text-amber-300/90 max-w-2xl mx-auto tracking-wide">
          Your Semester. Under Control.
        </p>

        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The unified academic productivity workspace tailored for college students managing demanding assignments, laboratory observation records, capstone projects, and university CAT examinations.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <span>Launch Student Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreBackend}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border border-purple-800/80 bg-purple-950/40 hover:bg-purple-900/60 text-purple-200 font-semibold text-sm transition-all cursor-pointer"
          >
            <Server className="w-4 h-4 text-amber-400" />
            <span>Java 21 & MySQL Architecture</span>
          </button>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Engineered for High-Pressure Academic Semesters
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            AFIS delivers mathematical clarity over guesswork. Every recommendation is transparently verifiable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-xl border border-purple-900/40 bg-[#160a2c]/80 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-purple-900/50 border border-purple-700/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Rule-Based Flow Engine</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Transparent, deterministic academic scoring based on user-selected importance and strict proximity math. Zero black-box AI.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-purple-900/40 bg-[#160a2c]/80 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-purple-900/50 border border-purple-700/40 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Deadline Radar</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Continuous proximity monitoring with high-urgency alerts for submissions due in &lt;24 hours and recovery for overdue coursework.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-purple-900/40 bg-[#160a2c]/80 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-purple-900/50 border border-purple-700/40 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">MySQL 8.0 Persistence</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Robust relational schema with strict student ownership (<code className="text-amber-400 font-mono text-[11px]">WHERE user_id = ?</code>), foreign keys, and indexes.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-purple-900/40 bg-[#160a2c]/80 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-purple-900/50 border border-purple-700/40 flex items-center justify-center text-amber-400">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Java 21 & Tomcat 10.1</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Production-standard Jakarta Servlets 6.0, BCrypt salted authentication, JDBC connection pooling, and Maven WAR packaging.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works Pipeline */}
      <section className="p-8 rounded-2xl border border-purple-900/60 bg-gradient-to-b from-[#180b33] to-[#120726] space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            How AFIS Optimizes Academic Workflow
          </h2>
          <p className="text-sm text-purple-200/70">
            A three-stage pipeline connecting your syllabus to on-time submissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-5 rounded-xl border border-purple-900/40 bg-[#140827]/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">01. INGESTION</span>
              <FileCheck2 className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Map Semester Deliverables</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Register courses (e.g. CS3401, CS3492) and log upcoming assignments, lab observations, and semester assessment tests.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-purple-900/40 bg-[#140827]/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">02. PRIORITIZATION</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Dynamic Flow Math</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The rule engine computes: <br />
              <code className="text-amber-300 font-mono text-[11px]">Score = Priority + Category + Proximity</code>.<br />
              Completed tasks drop to 0 instantly.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-purple-900/40 bg-[#140827]/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">03. EXECUTION</span>
              <BarChart2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Triage & Milestone Analytics</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Execute with zero cognitive fatigue. Track real completion rates, subject workload distribution, and semester academic health.
            </p>
          </div>

        </div>
      </section>

      {/* Student Demo Callout */}
      <section className="p-6 rounded-xl border border-amber-400/30 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-amber-300">
            Second-Year Computer Science Demonstration
          </h3>
          <p className="text-xs text-slate-300">
            Pre-loaded with Anna University / Rajalakshmi Engineering College 4th semester courses and live deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActivePage('tasks')}
            className="px-4 py-2 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors cursor-pointer"
          >
            Browse Tasks
          </button>
          <button
            onClick={() => setActivePage('dashboard')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            Enter Dashboard
          </button>
        </div>
      </section>

    </div>
  );
};
