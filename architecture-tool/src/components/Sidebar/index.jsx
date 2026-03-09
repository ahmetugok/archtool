import React from 'react';
import { NODE_TYPES } from '../../constants';
import { Sparkles, Layers, Minimize2, ArrowRight } from 'lucide-react';

export const Sidebar = ({
  isLeftPanelExpanded,
  setIsLeftPanelExpanded,
  isLeftPanelPinned,
  setIsLeftPanelPinned,
  showLeftPanel,
  setShowLeftPanel,
  handleAiArchitectureAudit,
  isAiLoading,
  nodes,
}) => {
  const nodeTools = [
    { type: 'START', label: 'Başlangıç Düğümü', color: 'text-emerald-600', group: 'flow' },
    { type: 'END', label: 'Bitiş Düğümü', color: 'text-slate-900', group: 'flow' },
    { type: 'DECISION', label: 'Kontrol / Sorgu', color: 'text-amber-600', group: 'flow' },
    { type: 'SWIMLANE', label: 'Kulvar / Alan', color: 'text-slate-500', group: 'flow' },
    { type: 'LIFELINE', label: 'Sıralama Çizgisi', color: 'text-slate-700', group: 'uml' },
    { type: 'UML_CLASS', label: 'UML Sınıf', color: 'text-slate-700', group: 'uml' },
    { type: 'SERVER', label: 'Backend Sistemi', color: 'text-blue-600', group: 'tech' },
    { type: 'DATABASE', label: 'Veritabanı', color: 'text-green-600', group: 'tech' },
    { type: 'WEB', label: 'Web Portal', color: 'text-purple-600', group: 'tech' },
    { type: 'MOBILE', label: 'Mobil Uygulama', color: 'text-pink-600', group: 'tech' },
    { type: 'USER', label: 'Kullanıcı', color: 'text-yellow-600', group: 'tech' },
    { type: 'PROCESS', label: 'Süreç', color: 'text-orange-600', group: 'tech' },
    { type: 'COMPONENT', label: 'Rapor / Servis', color: 'text-gray-600', group: 'tech' },
    { type: 'MANUAL', label: 'Manuel Giriş', color: 'text-slate-600', group: 'tech' },
  ];

  return (
    <div
      className={`bg-white/95 backdrop-blur-sm border-r border-slate-200 flex flex-col z-40 transition-all duration-300 ease-in-out ${
        isLeftPanelPinned ? 'w-64' : showLeftPanel ? 'w-64 absolute h-full shadow-2xl' : 'w-0 overflow-hidden'
      }`}
      onMouseEnter={() => {
        if (!isLeftPanelPinned && window.innerWidth >= 768) setShowLeftPanel(true);
      }}
      onMouseLeave={() => {
        if (!isLeftPanelPinned && window.innerWidth >= 768) setShowLeftPanel(false);
      }}
    >
      <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 h-14">
        <h2 className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" /> ARAÇ KUTUSU
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setIsLeftPanelPinned(!isLeftPanelPinned)}
            className={`p-1.5 rounded transition-colors hidden md:block ${
              isLeftPanelPinned ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-200 text-slate-500'
            }`}
            title={isLeftPanelPinned ? "Paneli Sabitlemeyi Kaldır" : "Paneli Sabitle"}
          >
            <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isLeftPanelPinned ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Akış & Yapı</h3>
          <div className="grid grid-cols-2 gap-2">
            {nodeTools
              .filter((t) => t.group === 'flow')
              .map((tool) => {
                const Icon = NODE_TYPES[tool.type].icon;
                return (
                  <div
                    key={tool.type}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/reactflow', tool.type);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:border-blue-500 hover:shadow-md cursor-grab transition-all group"
                  >
                    <Icon className={`w-5 h-5 mb-1.5 transition-transform group-hover:scale-110 ${tool.color}`} />
                    <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">
                      {tool.label}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Sistem & Aktör</h3>
          <div className="grid grid-cols-2 gap-2">
            {nodeTools
              .filter((t) => t.group === 'tech')
              .map((tool) => {
                const Icon = NODE_TYPES[tool.type].icon;
                return (
                  <div
                    key={tool.type}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/reactflow', tool.type);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:border-blue-500 hover:shadow-md cursor-grab transition-all group"
                  >
                    <Icon className={`w-5 h-5 mb-1.5 transition-transform group-hover:scale-110 ${tool.color}`} />
                    <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">
                      {tool.label}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">UML Elemanları</h3>
          <div className="grid grid-cols-2 gap-2">
            {nodeTools
              .filter((t) => t.group === 'uml')
              .map((tool) => {
                const Icon = NODE_TYPES[tool.type].icon;
                return (
                  <div
                    key={tool.type}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/reactflow', tool.type);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:border-blue-500 hover:shadow-md cursor-grab transition-all group"
                  >
                    <Icon className={`w-5 h-5 mb-1.5 transition-transform group-hover:scale-110 ${tool.color}`} />
                    <span className="text-[9px] font-bold text-slate-600 text-center leading-tight">
                      {tool.label}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="pt-2">
          <button
            onClick={handleAiArchitectureAudit}
            disabled={isAiLoading || nodes.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2.5 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isAiLoading ? (
              <span className="animate-pulse">Analiz Ediliyor...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" /> AI ile Süreci Analiz Et
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
