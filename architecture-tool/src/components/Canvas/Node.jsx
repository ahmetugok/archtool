import React, { useRef, useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { getNodeRect, toPaleColor } from '../../utils/geometry';
import {
  FileText,
  Plus,
  Trash2,
  Copy,
  ArrowRight,
} from 'lucide-react';

export const Node = React.memo(({
  node,
  hasRisk,
  editingField,
  setEditingField,
  renderEditableField,
  setNotePopupNodeId,
  handleNodePointerDown,
  handleSpecificResizeStart,
  handleHandlePointerDown,
  getHandlesForNode,
}) => {
  const selectedNodeIds = useStore((state) => state.selectedNodeIds);
  const isSelected = selectedNodeIds.includes(node.id);

  return (
    <div
      data-node-id={node.id}
      onPointerDown={(e) => handleNodePointerDown(e, node.id)}
      className={`absolute select-none cursor-move transition-shadow duration-150 ${
        isSelected ? 'ring-2 ring-blue-500 shadow-xl z-50' : 'hover:shadow-lg z-10'
      } ${node.locked ? 'ring-2 ring-red-500' : ''}`}
      style={{
        left: node.x,
        top: node.y,
        width: Math.max(50, node.width || 160),
        height: Math.max(50, node.height || 100),
        backgroundColor: node.backgroundColor || toPaleColor('#ffffff', '55'),
        border: `${node.borderWidth ?? 1}px ${node.borderStyle || 'solid'} ${node.borderColor || '#0f172a'}`,
        borderRadius: `${node.borderRadius ?? 10}px`,
        boxShadow: node.customShadow || '0 4px 6px rgba(0,0,0,0.1)',
        opacity: (node.bgOpacity || 100) / 100,
        pointerEvents: 'auto',
      }}
    >
      <div className="flex flex-col h-full overflow-hidden relative">
        <div
          className="flex items-center justify-between px-2 shrink-0 border-b border-black/10"
          style={{
            height: `${node.headerHeight || 32}px`,
            backgroundColor: node.borderColor || '#0f172a',
            color: node.headerFontColor || '#ffffff',
            borderRadius: `${node.borderRadius ?? 10}px ${node.borderRadius ?? 10}px 0 0`,
          }}
        >
          <div
            className="flex-1 min-w-0"
            style={{
              fontSize: `${node.headerFontSize || 10}px`,
              fontWeight: node.headerFontWeight || 800,
              fontFamily: node.headerFontFamily || "'Segoe UI', sans-serif",
            }}
          >
            {renderEditableField(node, 'owner', 'w-full text-center tracking-wider opacity-90 truncate')}
          </div>
        </div>

        <div className="flex-1 px-2.5 py-1.5 overflow-y-auto relative">
          <div
            className="mb-1"
            style={{
              fontSize: `${node.titleFontSize || 12}px`,
              fontWeight: node.titleFontWeight || 700,
              fontFamily: node.titleFontFamily || "'Segoe UI', sans-serif",
              color: node.titleFontColor || '#1f2937',
            }}
          >
            {renderEditableField(node, 'title', 'w-full')}
          </div>

          <div
            style={{
              fontSize: `${node.descriptionFontSize || 10}px`,
              fontWeight: node.descriptionFontWeight || 400,
              fontFamily: node.descriptionFontFamily || "'Segoe UI', sans-serif",
              lineHeight: node.descriptionLineHeight || 1.4,
              color: node.descriptionFontColor || '#64748b',
            }}
          >
            {renderEditableField(node, 'description', 'w-full h-full', {}, 'textarea')}
          </div>

          {node.note && (
            <div
              className="absolute bottom-1.5 left-1.5 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setNotePopupNodeId(node.id);
              }}
            >
              <div className="w-5 h-5 rounded bg-amber-100 border border-amber-300 flex items-center justify-center hover:bg-amber-200 hover:scale-110 transition-all shadow-sm">
                <FileText className="w-3 h-3 text-amber-600" />
              </div>
            </div>
          )}

          {node.tag && (
            <div
              className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded text-[9px] font-semibold"
              style={{
                backgroundColor: node.tagBgColor || '#e2e8f0',
                color: node.tagTextColor || '#475569',
                border: `1px solid ${node.tagBorderColor || '#cbd5e1'}`,
              }}
            >
              {renderEditableField(node, 'tag', 'bg-transparent text-center', {
                color: 'inherit',
                fontSize: 'inherit',
              })}
            </div>
          )}
        </div>
      </div>

      {isSelected && (
        <>
          {getHandlesForNode(node).map((h) => (
            <div
              key={h.id}
              data-handle={h.id}
              data-node-id={node.id}
              onPointerDown={(e) => {
                if (e.shiftKey) handleSpecificResizeStart(e, node.id, h.id);
                else handleHandlePointerDown(e, node.id, h.id);
              }}
              className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full hover:scale-150 transition-transform"
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: e => e.shiftKey ? h.cursor : 'crosshair',
                zIndex: 60,
              }}
              title={h.label}
            />
          ))}
        </>
      )}
    </div>
  );
});
