import React from 'react';
import { X, Copy, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const AiReportDrawer = ({ report, onClose }) => {
  if (!report) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(report);
    toast.success('Rapor panoya kopyalandı');
  };

  const renderMarkdown = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-sm font-bold text-slate-800 mt-4 mb-1">{line.slice(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-base font-bold text-slate-900 mb-2">{line.slice(2)}</h1>;
        }
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return <li key={i} className="text-xs text-slate-700 ml-3 mb-0.5 list-disc">{line.slice(2)}</li>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="text-xs font-bold text-slate-800 mb-1">{line.slice(2, -2)}</p>;
        }
        if (line.trim() === '') {
          return <div key={i} className="h-2" />;
        }
        return <p key={i} className="text-xs text-slate-700 mb-1 leading-relaxed">{line}</p>;
      });
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200">
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            AI ANALİZ RAPORU
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-500 flex items-center gap-1 text-[10px] font-bold"
              title="Kopyala"
            >
              <Copy className="w-3.5 h-3.5" /> Kopyala
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-red-50 rounded transition-colors text-slate-500 hover:text-red-600"
              title="Kapat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {renderMarkdown(report)}
        </div>
      </div>
    </>
  );
};
