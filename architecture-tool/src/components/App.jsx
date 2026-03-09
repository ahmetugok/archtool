import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAI } from '../hooks/useAI';
import { Sidebar } from './Sidebar';
import { PropertiesPanel } from './PropertiesPanel';
import { Canvas } from './Canvas';
import { useClipboard } from '../hooks/useClipboard';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import toast, { Toaster } from 'react-hot-toast';

export const App = () => {
  const {
    pages,
    currentPageId,
    setCurrentPageId,
    selectedNodeIds,
    setSelectedNodeIds,
    selectedConnectionId,
    setSelectedConnectionId,
    scale,
    setScale,
    pan,
    setPan,
    getNodes,
    getConnections,
    setNodes,
    setConnections,
  } = useStore();

  const nodes = getNodes();
  const connections = getConnections();

  const [isLeftPanelExpanded, setIsLeftPanelExpanded] = useState(false);
  const [isLeftPanelPinned, setIsLeftPanelPinned] = useState(() => {
    const saved = localStorage.getItem('left_panel_pinned');
    return saved === 'true';
  });
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    temel: true,
    gorunum: false,
    yazi: false,
    boyut: false,
  });

  const toggleSection = (section) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const [editingField, setEditingField] = useState(null);
  const [notePopupNodeId, setNotePopupNodeId] = useState(null);

  const [isConnecting, setIsConnecting] = useState(false);
  const [tempConnectionEnd, setTempConnectionEnd] = useState({ x: 0, y: 0 });
  const [connectionStartInfo, setConnectionStartInfo] = useState(null);
  const [hoveredHandle, setHoveredHandle] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectInfo, setReconnectInfo] = useState(null);

  const [snapLines, setSnapLines] = useState([]);
  const [selectionBox, setSelectionBox] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [showQuickAddHandles, setShowQuickAddHandles] = useState(false);

  const contentRef = React.useRef(null);

  const { callAI, isAiLoading } = useAI();
  const { deleteSelected, copySelected, cutSelected, pasteCopied } = useClipboard();
  useKeyboardShortcuts(deleteSelected, copySelected, cutSelected, pasteCopied);

  const handleAiArchitectureAudit = async () => {
    if (nodes.length) {
      const res = await callAI(
        `Sen İş Analistisin. Veri: ${JSON.stringify({
          nodes,
          connections,
        })}. Türkçe Rapor: 1.Süreç 2.Risk 3.Öneri 4.Sistem Tasarım Soruları`
      );
      if (res) {
        toast.success('Rapor başarıyla oluşturuldu');
      }
    }
  };

  const handleAiNodeDescription = async (selectedNode) => {
    if (selectedNode) {
      const res = await callAI(
        `Bileşen: ${selectedNode.title}. Tip: ${selectedNode.type}. Görevi? (Kısa, Türkçe)`
      );
      if (res) {
        useStore.getState().updateNodeData(selectedNode.id, 'description', res);
        toast.success('Açıklama yapay zeka tarafından eklendi');
      }
    }
  };

  const renderEditableField = (node, field, className, style = {}, elementType = 'input') => {
    const isEditing = editingField?.nodeId === node.id && editingField?.field === field;
    const value = node[field] || '';

    if (isEditing) {
      if (elementType === 'textarea') {
        return (
          <textarea
            autoFocus
            value={value}
            onChange={(e) => useStore.getState().updateNodeData(node.id, field, e.target.value)}
            onBlur={() => setEditingField(null)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`w-full h-full bg-white text-slate-900 p-1 outline-blue-500 rounded resize-none text-[11px] font-mono leading-snug ${className}`}
            style={style}
          />
        );
      }
      return (
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => useStore.getState().updateNodeData(node.id, field, e.target.value)}
          onBlur={() => setEditingField(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setEditingField(null);
            e.stopPropagation();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`w-full h-full bg-white text-slate-900 px-1 outline-blue-500 rounded ${className}`}
          style={style}
        />
      );
    }

    if (elementType === 'textarea') {
      return (
        <div
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditingField({ nodeId: node.id, field });
          }}
          className={`cursor-text hover:bg-black/5 rounded min-h-[40px] w-full h-full whitespace-pre-wrap ${className}`}
          style={style}
          title="Çift tıkla düzenle"
        >
          {value || <span className="italic opacity-50">Süreç detayı...</span>}
        </div>
      );
    }

    return (
      <span
        onDoubleClick={(e) => {
          e.stopPropagation();
          setEditingField({ nodeId: node.id, field });
        }}
        className={`cursor-text hover:bg-black/5 rounded px-0.5 min-w-[10px] inline-block ${className}`}
        style={style}
        title="Çift tıkla düzenle"
      >
        {value || (field === 'stepNumber' ? '-' : '')}
      </span>
    );
  };

  const addNode = (typeKey, dropPos = null) => {
    // simplified addNode
    const id = Date.now().toString();
    const newNode = {
      id,
      type: typeKey,
      x: dropPos ? dropPos.x : 100,
      y: dropPos ? dropPos.y : 100,
      width: 160,
      height: 100,
      title: 'İşlem Adı',
    };
    setNodes((prev) => [...prev, newNode]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden text-slate-800 text-sm selection:bg-blue-200">
      <Toaster position="top-right" />
      <Sidebar
        isLeftPanelExpanded={isLeftPanelExpanded}
        setIsLeftPanelExpanded={setIsLeftPanelExpanded}
        isLeftPanelPinned={isLeftPanelPinned}
        setIsLeftPanelPinned={setIsLeftPanelPinned}
        showLeftPanel={showLeftPanel}
        setShowLeftPanel={setShowLeftPanel}
        handleAiArchitectureAudit={handleAiArchitectureAudit}
        isAiLoading={isAiLoading}
        nodes={nodes}
      />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="flex-1 flex relative">
          <Canvas
            contentRef={contentRef}
            nodes={nodes}
            connections={connections}
            selectedNodeIds={selectedNodeIds}
            selectedConnectionId={selectedConnectionId}
            scale={scale}
            pan={pan}
            setScale={setScale}
            setPan={setPan}
            editingField={editingField}
            setEditingField={setEditingField}
            renderEditableField={renderEditableField}
            setNotePopupNodeId={setNotePopupNodeId}
            isConnecting={isConnecting}
            tempConnectionEnd={tempConnectionEnd}
            connectionStartInfo={connectionStartInfo}
            hoveredHandle={hoveredHandle}
            isReconnecting={isReconnecting}
            reconnectInfo={reconnectInfo}
            snapLines={snapLines}
            selectionBox={selectionBox}
            isSelecting={isSelecting}
            isPanning={isPanning}
            dragStartPos={dragStartPos}
            setDragStartPos={setDragStartPos}
            setIsPanning={setIsPanning}
            setIsSelecting={setIsSelecting}
            setSelectionBox={setSelectionBox}
            setSelectedNodeIds={setSelectedNodeIds}
            setSelectedConnectionId={setSelectedConnectionId}
            setShowQuickAddHandles={setShowQuickAddHandles}
            addNode={addNode}
            handleNodePointerDown={() => {}}
            handleSpecificResizeStart={() => {}}
            handleHandlePointerDown={() => {}}
            handleConnectionSelect={() => {}}
            handleConnectionControlPointDown={() => {}}
            handleWaypointDown={() => {}}
            handleConnectionDragStart={() => {}}
          />
          <PropertiesPanel
            deleteSelected={deleteSelected}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            handleAiNodeDescription={handleAiNodeDescription}
            isAiLoading={isAiLoading}
          />
        </div>
      </div>
    </div>
  );
};
