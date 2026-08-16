import React, { useState } from 'react';
import { X, Code2, Copy, Check, FileCode, Server, Database } from 'lucide-react';
import { DJANGO_BACKEND_FILES } from '../data/djangoBackendCode';
import { useApp } from '../context/AppContext';

export const DjangoBackendExplorerModal: React.FC = () => {
  const { isBackendExplorerOpen, setIsBackendExplorerOpen } = useApp();
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isBackendExplorerOpen) return null;

  const currentFile = DJANGO_BACKEND_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0f172a] text-slate-200 w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0a101d] px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Django REST Framework Architecture</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Python 3.11 + PostgreSQL
                </span>
              </div>
              <p className="text-xs text-slate-400">Backend code implementation matching thesis specifications</p>
            </div>
          </div>

          <button
            onClick={() => setIsBackendExplorerOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Tabs Bar */}
        <div className="bg-[#080d1a] px-4 py-2 flex items-center gap-2 overflow-x-auto border-b border-slate-800">
          {DJANGO_BACKEND_FILES.map((file, idx) => (
            <button
              key={file.fileName}
              onClick={() => setSelectedFileIndex(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                selectedFileIndex === idx
                  ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{file.fileName.split('/').pop()}</span>
            </button>
          ))}
        </div>

        {/* File Details & Copy Bar */}
        <div className="px-5 py-2.5 bg-[#0e1626] flex items-center justify-between border-b border-slate-800 text-xs text-slate-400">
          <span className="truncate">{currentFile.description}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium text-xs flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code View Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0a0f1d] font-mono text-xs text-emerald-300/90 leading-relaxed select-text">
          <pre className="whitespace-pre">{currentFile.code}</pre>
        </div>
      </div>
    </div>
  );
};
