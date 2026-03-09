import React from 'react';
import { useStore } from '../../store/useStore';
import {
  FileText,
  Trash2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { BADGE_COLORS, BG_COLORS, BORDER_COLORS } from '../../constants';

export const PropertiesPanel = ({
  deleteSelected,
  expandedSections,
  toggleSection,
  handleAiNodeDescription,
  isAiLoading,
}) => {
  const selectedNodeIds = useStore((state) => state.selectedNodeIds);
  const selectedConnectionId = useStore((state) => state.selectedConnectionId);
  const nodes = useStore((state) => state.getNodes());
  const connections = useStore((state) => state.getConnections());
  const updateNodeData = useStore((state) => state.updateNodeData);
  const updateMultipleNodesData = useStore((state) => state.updateMultipleNodesData);
  const setNodes = useStore((state) => state.setNodes);
  const setConnections = useStore((state) => state.setConnections);

  const selectedNode = selectedNodeIds.length === 1 ? nodes.find((n) => n.id === selectedNodeIds[0]) : null;
  const isMultiSelect = selectedNodeIds.length > 1;
  const selectedConnection = connections.find((c) => c.id === selectedConnectionId);

  const groupSelected = () => {
    if (selectedNodeIds.length < 2) return;
    const newGroupId = `grp_${Date.now()}`;
    updateMultipleNodesData(selectedNodeIds, 'groupId', newGroupId);
  };

  const ungroupSelected = () => {
    if (selectedNodeIds.length === 0) return;
    setNodes((prev) =>
      prev.map((n) => {
        if (selectedNodeIds.includes(n.id)) {
          const { groupId, ...rest } = n;
          return { ...rest };
        }
        return n;
      })
    );
  };

  const updateConnectionLabel = (connId, label) => {
    setConnections((prev) => prev.map((c) => (c.id === connId ? { ...c, label } : c)));
  };

  const updateConnectionData = (connId, field, value) => {
    setConnections((prev) => prev.map((c) => (c.id === connId ? { ...c, [field]: value } : c)));
  };

  return (
    <div className="w-72 bg-white/95 backdrop-blur-sm border-l border-slate-200 flex flex-col z-40 overflow-hidden shrink-0">
      {selectedNode || isMultiSelect ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-xs font-bold text-slate-800">
              {isMultiSelect ? 'ÇOKLU SEÇİM' : 'ÖZELLİKLER'}
            </h2>
            <button
              onClick={deleteSelected}
              className="p-1 hover:bg-red-50 rounded transition-colors text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-2 space-y-1">
            {!isMultiSelect && selectedNode && (
              <>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('temel')}
                    className="w-full flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                      Temel Bilgiler
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                        expandedSections.temel ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedSections.temel && (
                    <div className="p-2 space-y-2 bg-white">
                      <div className="grid grid-cols-3 gap-1">
                        <div className="col-span-1">
                          <label className="text-[10px] font-bold text-slate-400 mb-1 block">ADIM</label>
                          <input
                            type="text"
                            value={selectedNode.stepNumber || ''}
                            onChange={(e) => updateNodeData(selectedNode.id, 'stepNumber', e.target.value)}
                            className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white"
                            placeholder="1.0"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-bold text-slate-400 mb-1 block">
                            BAŞLIK
                          </label>
                          <input
                            type="text"
                            value={selectedNode.title || ''}
                            onChange={(e) => updateNodeData(selectedNode.id, 'title', e.target.value)}
                            className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white"
                          />
                        </div>
                      </div>
                      {selectedNode.type !== 'SWIMLANE' &&
                        selectedNode.type !== 'START' &&
                        selectedNode.type !== 'END' &&
                        selectedNode.type !== 'DECISION' &&
                        selectedNode.type !== 'LIFELINE' && (
                          <div className="grid grid-cols-2 gap-1">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 mb-1 block">
                                BİLEŞEN
                              </label>
                              <input
                                type="text"
                                value={selectedNode.techStack || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, 'techStack', e.target.value)}
                                className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 mb-1 block">
                                AKTÖR
                              </label>
                              <input
                                type="text"
                                value={selectedNode.owner || ''}
                                onChange={(e) => updateNodeData(selectedNode.id, 'owner', e.target.value)}
                                className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white"
                              />
                            </div>
                          </div>
                        )}
                      {selectedNode.type !== 'SWIMLANE' &&
                        selectedNode.type !== 'START' &&
                        selectedNode.type !== 'END' &&
                        selectedNode.type !== 'DECISION' &&
                        selectedNode.type !== 'LIFELINE' && (
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 mb-1 block">
                              ETİKET (API, Webservice vs.)
                            </label>
                            <input
                              type="text"
                              value={selectedNode.tag || ''}
                              onChange={(e) => updateNodeData(selectedNode.id, 'tag', e.target.value)}
                              className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white"
                              placeholder="REST API, SOAP, GraphQL..."
                            />
                          </div>
                        )}
                      {selectedNode.type !== 'LIFELINE' && (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] font-bold text-slate-400">AÇIKLAMA</label>
                            <button
                              type="button"
                              onClick={() => handleAiNodeDescription(selectedNode)}
                              disabled={isAiLoading}
                              className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200 flex items-center gap-0.5 hover:bg-purple-200"
                            >
                              <Sparkles className="w-2.5 h-2.5" /> AI
                            </button>
                          </div>
                          <textarea
                            value={selectedNode.description || ''}
                            onChange={(e) => updateNodeData(selectedNode.id, 'description', e.target.value)}
                            className="w-full p-1.5 border border-slate-200 rounded text-xs h-20 bg-white resize-none"
                          />
                        </div>
                      )}
                      {selectedNode.type !== 'SWIMLANE' &&
                        selectedNode.type !== 'START' &&
                        selectedNode.type !== 'END' &&
                        selectedNode.type !== 'LIFELINE' && (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> TEKNİK NOT
                              </label>
                            </div>
                            <textarea
                              value={selectedNode.note || ''}
                              onChange={(e) => updateNodeData(selectedNode.id, 'note', e.target.value)}
                              className="w-full p-1.5 border border-amber-200 rounded text-xs h-16 bg-amber-50 resize-none"
                              placeholder="Tablo adı, teknik detay, SQL sorgusu vb..."
                            />
                          </div>
                        )}
                      <div
                        className="flex items-center gap-2 p-1.5 border border-amber-200 bg-amber-50 rounded cursor-pointer"
                        onClick={() => updateNodeData(selectedNode.id, 'hasRisk', !selectedNode.hasRisk)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedNode.hasRisk || false}
                          readOnly
                          className="w-3 h-3 text-amber-600 rounded"
                        />
                        <span className="text-[10px] font-bold text-amber-800">Risk İşaretle</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('boyut')}
                    className="w-full flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                      Boyut
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                        expandedSections.boyut ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedSections.boyut && (
                    <div className="p-2 bg-white">
                      <div className="grid grid-cols-2 gap-1">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 mb-1 block">
                            GENİŞLİK
                          </label>
                          <input
                            type="number"
                            value={Math.round(selectedNode.width || 160)}
                            onChange={(e) =>
                              updateNodeData(selectedNode.id, 'width', parseInt(e.target.value))
                            }
                            className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 mb-1 block">
                            YÜKSEKLİK
                          </label>
                          <input
                            type="number"
                            value={Math.round(selectedNode.height || 100)}
                            onChange={(e) =>
                              updateNodeData(selectedNode.id, 'height', parseInt(e.target.value))
                            }
                            className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection('gorunum')}
                    className="w-full flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                      Görünüm
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                        expandedSections.gorunum ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedSections.gorunum && (
                    <div className="p-2 space-y-3 bg-white">
                      <div className="p-2 bg-white rounded-lg border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-600 mb-1.5 block flex items-center gap-1">
                          ARKA PLAN RENGİ
                        </label>
                        <div className="flex gap-1.5 flex-wrap mb-2">
                          {BG_COLORS.map((color) => (
                            <button
                              key={color.id}
                              onClick={() => updateNodeData(selectedNode.id, 'backgroundColor', color.hex)}
                              className={`w-6 h-6 rounded-md border hover:scale-110 transition-all ${
                                selectedNode.backgroundColor === color.hex
                                  ? 'ring-2 ring-offset-1 ring-blue-500 border-blue-400'
                                  : 'border-slate-200'
                              }`}
                              style={{ backgroundColor: color.hex }}
                              title={color.label}
                            />
                          ))}
                          <input
                            type="color"
                            value={selectedNode.backgroundColor || '#ffffff'}
                            onChange={(e) => updateNodeData(selectedNode.id, 'backgroundColor', e.target.value)}
                            className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer"
                            title="Özel Renk"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {isMultiSelect && (
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={groupSelected}
                    className="flex-1 px-2 py-1.5 text-[10px] font-bold bg-slate-900 text-white rounded hover:bg-slate-700"
                  >
                    Grupla
                  </button>
                  <button
                    onClick={ungroupSelected}
                    className="flex-1 px-2 py-1.5 text-[10px] font-bold bg-white text-slate-900 border border-slate-300 rounded hover:bg-slate-50"
                  >
                    Çöz
                  </button>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 mb-1 block">
                    ETİKET RENGİ (TOPLU)
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {BADGE_COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => updateMultipleNodesData(selectedNodeIds, 'customColor', color.class)}
                        className={`w-5 h-5 rounded-full border ${color.class} hover:scale-110`}
                      />
                    ))}
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 p-1.5 border border-amber-200 bg-amber-50 rounded cursor-pointer"
                  onClick={() =>
                    updateMultipleNodesData(selectedNodeIds, 'hasRisk', !selectedNode?.hasRisk)
                  }
                >
                  <input
                    type="checkbox"
                    checked={selectedNode?.hasRisk || false}
                    readOnly
                    className="w-3 h-3 text-amber-600 rounded"
                  />
                  <span className="text-[10px] font-bold text-amber-800">Risk İşaretle (Toplu)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : selectedConnection ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-800">BAĞLANTI</h2>
            <button
              onClick={deleteSelected}
              className="p-1 hover:bg-red-50 rounded transition-colors text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-2 space-y-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 mb-1 block">ETİKET</label>
              <input
                type="text"
                value={selectedConnection.label || ''}
                onChange={(e) => updateConnectionLabel(selectedConnection.id, e.target.value)}
                className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white"
                placeholder="Veri Akışı..."
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 mb-1 block">RENK</label>
                <div className="flex gap-1 flex-wrap">
                  {['#475569', '#0f172a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() => updateConnectionData(selectedConnection.id, 'color', color)}
                        className={`w-5 h-5 rounded-full border-2 hover:scale-110 transition-transform ${
                          (selectedConnection.color || '#475569') === color
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-white'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 mb-1 block">KALINLIK</label>
                <div className="flex gap-1">
                  {[1.5, 2, 3, 4].map((w) => (
                    <button
                      key={w}
                      onClick={() => updateConnectionData(selectedConnection.id, 'strokeWidth', w)}
                      className={`flex-1 p-1.5 border rounded text-[10px] ${
                        (selectedConnection.strokeWidth || 2) === w
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      {w}px
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-8 text-center">
          <FileText className="w-16 h-16 mb-4 opacity-20" />
          <h3 className="text-sm font-bold">SEÇİM YAPILMADI</h3>
          <p className="text-xs text-slate-400 mt-2">Bir Öğe seçin veya yeni bir Öğe ekleyin</p>
        </div>
      )}
    </div>
  );
};
