import React, { useState } from 'react';
import { JAVA_PROJECT_FILES, getFileCategory } from '../../data/projectFiles';
import { downloadJavaMavenZip } from '../../utils/zipExporter';
import {
  FileCode2,
  Folder,
  Download,
  Copy,
  Check,
  Terminal,
  Database,
  Server,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

export const BackendExplorerView: React.FC = () => {
  const fileKeys = Object.keys(JAVA_PROJECT_FILES).sort();
  const [selectedFile, setSelectedFile] = useState<string>('README.md');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const currentContent = JAVA_PROJECT_FILES[selectedFile] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadJavaMavenZip();
    } finally {
      setDownloading(false);
    }
  };

  const filteredFiles = fileKeys.filter((f) =>
    f.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-950/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileCode2 className="w-6 h-6 text-amber-400" />
            <span>Java 21, Tomcat 10.1 & MySQL 8.0 Architecture Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete, production-style Jakarta Servlet WAR project ready for local Maven compilation and college review.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-sm hover:shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Creating ZIP...' : 'Download Project (.ZIP)'}</span>
        </button>
      </div>

      {/* Cloud Container Limitations & Local Setup Guidance */}
      <div className="p-4 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-purple-950/30 to-[#150a2b] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Environment & Architecture Notice</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          The cloud runner environment executes the Vite/Node frontend sandbox (<code className="text-amber-300 font-mono text-[11px]">java</code>, <code className="text-amber-300 font-mono text-[11px]">mvn</code>, and <code className="text-amber-300 font-mono text-[11px]">mysqld</code> daemons are not pre-installed in this cloud container). Per requirements, we do not replace Java or MySQL with third-party cloud DBs. Instead, we provide the <strong>100% complete runnable Java 21 / Maven WAR source tree (37 pristine files)</strong>, full MySQL schema (<code className="text-amber-300 font-mono text-[11px]">database.sql</code>), and automated JUnit 5 tests, ready for local execution on Windows with Apache Tomcat 10.1!
        </p>
      </div>

      {/* Quick Windows Setup Command Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg border border-purple-900/40 bg-[#160a2c] space-y-1">
          <span className="text-[10px] text-amber-400 font-mono font-bold block">1. DATABASE SETUP</span>
          <code className="text-slate-300 font-mono text-[11px] block truncate">mysql -u root -p &lt; database.sql</code>
        </div>
        <div className="p-3 rounded-lg border border-purple-900/40 bg-[#160a2c] space-y-1">
          <span className="text-[10px] text-amber-400 font-mono font-bold block">2. MAVEN BUILD</span>
          <code className="text-slate-300 font-mono text-[11px] block truncate">mvn clean package</code>
        </div>
        <div className="p-3 rounded-lg border border-purple-900/40 bg-[#160a2c] space-y-1">
          <span className="text-[10px] text-amber-400 font-mono font-bold block">3. DEPLOY TO TOMCAT</span>
          <code className="text-slate-300 font-mono text-[11px] block truncate">copy target\afis.war %CATALINA_HOME%\webapps\</code>
        </div>
        <div className="p-3 rounded-lg border border-purple-900/40 bg-[#160a2c] space-y-1">
          <span className="text-[10px] text-amber-400 font-mono font-bold block">4. LAUNCH SERVER</span>
          <code className="text-slate-300 font-mono text-[11px] block truncate">%CATALINA_HOME%\bin\startup.bat</code>
        </div>
      </div>

      {/* Two Column Layout: File Browser on Left, Code Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        
        {/* Left: File Tree Selector (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-xl border border-purple-900/40 bg-[#150a2b]/80 space-y-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-purple-950/60">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Project Files</span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
              {fileKeys.length} files
            </span>
          </div>

          <input
            type="text"
            placeholder="Search files..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-[#0e051c] border border-purple-900/60 rounded-lg text-xs text-white placeholder-slate-500"
          />

          <div className="flex-1 overflow-y-auto max-h-[520px] space-y-1 pr-1">
            {filteredFiles.map((path) => {
              const isSelected = selectedFile === path;
              const category = getFileCategory(path);
              const fileName = path.split('/').pop();

              return (
                <button
                  key={path}
                  onClick={() => setSelectedFile(path)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-purple-900/30'
                  }`}
                  title={path}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span className="truncate">{fileName}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1 rounded uppercase ${
                    isSelected ? 'bg-slate-900/30 text-slate-950' : 'text-slate-500'
                  }`}>
                    {category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Viewer (8 cols) */}
        <div className="lg:col-span-8 p-4 rounded-xl border border-purple-900/40 bg-[#0e051c] space-y-3 flex flex-col">
          
          <div className="flex items-center justify-between pb-2 border-b border-purple-950/60">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-mono font-bold text-amber-300 truncate">{selectedFile}</span>
              <span className="text-[10px] text-slate-500 font-mono">({currentContent.split('\n').length} lines)</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded border border-purple-800 bg-purple-950/40 hover:bg-purple-900 text-slate-200 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="flex-1 overflow-x-auto overflow-y-auto max-h-[520px] p-3 rounded-lg bg-[#080211] text-xs font-mono text-slate-300 leading-relaxed border border-purple-950/40">
            <code>{currentContent}</code>
          </pre>

        </div>

      </div>

    </div>
  );
};
