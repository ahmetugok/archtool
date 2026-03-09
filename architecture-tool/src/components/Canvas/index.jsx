import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Node } from './Node';
import { Connection } from './Connection';
import { CanvasGrid, SnapLines, SelectionBox } from './CanvasOverlay';
import { useDragDrop } from '../../hooks/useDragDrop';
import { getHandlesForNode, getHandleCoords } from '../../utils/geometry';
import { renderArrowHead } from '../../utils/arrows.jsx';
import { NODE_TYPES, HANDLES } from '../../constants';

export const Canvas = React.memo(({
  contentRef,
  nodes,
  connections,
  selectedNodeIds,
  selectedConnectionId,
  scale,
  pan,
  setScale,
  setPan,
  handleNodePointerDown,
  handleSpecificResizeStart,
  handleHandlePointerDown,
  handleConnectionSelect,
  handleConnectionControlPointDown,
  handleWaypointDown,
  handleConnectionDragStart,
  editingField,
  setEditingField,
  renderEditableField,
  setNotePopupNodeId,
  isConnecting,
  tempConnectionEnd,
  connectionStartInfo,
  hoveredHandle,
  isReconnecting,
  reconnectInfo,
  snapLines,
  selectionBox,
  isSelecting,
  isPanning,
  dragStartPos,
  setDragStartPos,
  setIsPanning,
  setIsSelecting,
  setSelectionBox,
  setSelectedNodeIds,
  setSelectedConnectionId,
  setShowQuickAddHandles,
  addNode,
}) => {
  const canvasRef = useRef(null);
  const { getWorldPos } = useDragDrop(canvasRef);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey || true) {
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      const newScale = Math.min(Math.max(0.1, scale + delta), 5);
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const scaleRatio = newScale / scale;
      const newPanX = mouseX - (mouseX - pan.x) * scaleRatio;
      const newPanY = mouseY - (mouseY - pan.y) * scaleRatio;
      setScale(newScale);
      setPan({ x: newPanX, y: newPanY });
    }
  }, [scale, pan, setScale, setPan]);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (cvs) {
      cvs.addEventListener('wheel', handleWheel, { passive: false });
      return () => cvs.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const handleCanvasPointerDown = useCallback((e) => {
    const target = e.target;
    const isNodeOrHandle =
      target.closest('[data-node-id]') ||
      target.closest('[data-handle]') ||
      target.tagName === 'path' ||
      target.tagName === 'circle';

    if (target.dataset.controlPoint) {
      return;
    }

    if (
      !target.tagName ||
      (target.tagName.toLowerCase() !== 'input' && target.tagName.toLowerCase() !== 'textarea')
    ) {
      setEditingField(null);
    }

    if (target.closest('.legend-box')) return;
    if (target.closest('.quick-add-handle')) return;

    if (e.button === 1 || (e.button === 0 && !isNodeOrHandle)) {
      if (e.shiftKey) {
        const pos = getWorldPos(e);
        setIsSelecting(true);
        setSelectionBox({ startX: pos.x, startY: pos.y, currentX: pos.x, currentY: pos.y });
      } else {
        setIsPanning(true);
        setDragStartPos({ x: e.clientX, y: e.clientY });
        if (!e.shiftKey) {
          setSelectedNodeIds([]);
          setSelectedConnectionId(null);
          setShowQuickAddHandles(false);
        }
      }
    }
  }, [getWorldPos, setEditingField, setIsSelecting, setSelectionBox, setIsPanning, setDragStartPos, setSelectedNodeIds, setSelectedConnectionId, setShowQuickAddHandles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const typeKey = e.dataTransfer.getData('application/reactflow');
    if (typeKey) {
      const pos = getWorldPos(e);
      addNode(typeKey, pos);
    }
  }, [getWorldPos, addNode]);

  return (
    <div
      ref={canvasRef}
      onPointerDown={handleCanvasPointerDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex-1 bg-[#f0f4f8] overflow-hidden ${
        isPanning ? 'cursor-grabbing' : isSelecting ? 'cursor-crosshair' : ''
      }`}
    >
      <CanvasGrid />
      <div
        ref={contentRef}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        className="will-change-transform"
      >
        <svg
          className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none"
          style={{ zIndex: 10 }}
        >
          {connections.map((conn) => (
            <Connection
              key={conn.id}
              conn={conn}
              nodes={nodes}
              selectedConnectionId={selectedConnectionId}
              isReconnecting={isReconnecting}
              reconnectInfo={reconnectInfo}
              tempConnectionEnd={tempConnectionEnd}
              handleConnectionSelect={handleConnectionSelect}
              handleConnectionControlPointDown={handleConnectionControlPointDown}
              handleWaypointDown={handleWaypointDown}
              handleConnectionDragStart={handleConnectionDragStart}
              renderArrowHead={renderArrowHead}
            />
          ))}

          {isConnecting && connectionStartInfo && (
            <path
              d={`M ${
                getHandleCoords(
                  nodes.find((n) => n.id === connectionStartInfo.nodeId),
                  connectionStartInfo.handle,
                  HANDLES
                ).x
              } ${
                getHandleCoords(
                  nodes.find((n) => n.id === connectionStartInfo.nodeId),
                  connectionStartInfo.handle,
                  HANDLES
                ).y
              } L ${tempConnectionEnd.x} ${tempConnectionEnd.y}`}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
          )}

          {isConnecting && hoveredHandle && (
            <circle
              cx={
                getHandleCoords(
                  nodes.find((n) => n.id === hoveredHandle.nodeId),
                  hoveredHandle.handle,
                  HANDLES
                ).x
              }
              cy={
                getHandleCoords(
                  nodes.find((n) => n.id === hoveredHandle.nodeId),
                  hoveredHandle.handle,
                  HANDLES
                ).y
              }
              r="8"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />
          )}
        </svg>

        {nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            hasRisk={node.hasRisk}
            editingField={editingField}
            setEditingField={setEditingField}
            renderEditableField={renderEditableField}
            setNotePopupNodeId={setNotePopupNodeId}
            handleNodePointerDown={handleNodePointerDown}
            handleSpecificResizeStart={handleSpecificResizeStart}
            handleHandlePointerDown={handleHandlePointerDown}
            getHandlesForNode={(n) => getHandlesForNode(n, HANDLES)}
          />
        ))}

        {snapLines && snapLines.length > 0 && <SnapLines snapLines={snapLines} />}
        {isSelecting && <SelectionBox box={selectionBox} />}
      </div>
    </div>
  );
});
