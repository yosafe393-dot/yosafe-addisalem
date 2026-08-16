import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, Server, Database, Layers, ArrowRight, ExternalLink } from 'lucide-react';
import { DJANGO_BACKEND_FILES } from '../data/djangoBackendCode';

export const DjangoBackendView: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentFile = DJANGO_BACKEND_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Server className="w-8 h-8 text-emerald-600" />
            <span>Django REST Framework Backend Architecture</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Complete Python 3.11, Django 5.x & PostgreSQL reference implementation matching the University of Gondar Legal Affairs specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
            DRF + JWT + Celery + PostgreSQL
          </span>
        </div>
      </div>

      {/* Code Explorer Panel */}
      <div className="bg-[#0b1329] rounded-2xl shadow-xl border border-slate-700/80 overflow-hidden flex flex-col">
        {/* Navigation Tabs */}
        <div className="bg-[#070c1b] px-4 py-3 flex items-center gap-2 overflow-x-auto border-b border-slate-800">
          {DJANGO_BACKEND_FILES.map((file, idx) => (
            <button
              key={file.fileName}
              onClick={() => setSelectedFileIndex(idx)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                selectedFileIndex === idx
                  ? 'bg-slate-800/90 text-emerald-400 font-bold border border-slate-600 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>{file.fileName.split('/').pop()}</span>
            </button>
          ))}
        </div>

        {/* Sub-header with file path and description */}
        <div className="px-5 py-3 bg-[#0d1730] flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 text-xs">
          <div>
            <span className="font-mono text-emerald-400 font-bold">{currentFile.fileName}</span>
            <p className="text-slate-400 text-[11px] mt-0.5">{currentFile.description}</p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors font-medium text-xs self-start sm:self-auto border border-slate-600"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Python File'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-5 font-mono text-xs text-emerald-300/90 leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto select-text bg-[#070c1b]">
          <pre className="whitespace-pre">{currentFile.code}</pre>
        </div>
      </div>
    </div>
  );
};
