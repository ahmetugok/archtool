import React from 'react';
import { useStore } from '../../store/useStore';
import { getBezierPathAndAngle, getHandleCoords } from '../../utils/geometry';
import { renderArrow } from '../../utils/arrows.jsx';
import { HANDLES } from '../../constants';

export const Connection = React.memo(({
  conn,
  nodes,
  selectedConnectionId,
  isReconnecting,
  reconnectInfo,
  tempConnectionEnd,
  handleConnectionSelect,
  handleConnectionControlPointDown,
  handleWaypointDown,
  handleConnectionDragStart,
  renderArrowHead,
}) => {
  const isSelected = selectedConnectionId === conn.id;
  const sourceNode = nodes.find((n) => n.id === conn.from);
  const targetNode = nodes.find((n) => n.id === conn.to);

  if (!sourceNode || !targetNode) return null;

  let start = getHandleCoords(sourceNode, conn.sourceHandle || 'r', HANDLES);
  let end = getHandleCoords(targetNode, conn.targetHandle || 'l', HANDLES);

  if (isReconnecting && reconnectInfo.connectionId === conn.id) {
    if (reconnectInfo.type === 'source') start = tempConnectionEnd;
    else end = tempConnectionEnd;
  }

  const pathData = getBezierPathAndAngle(
    start,
    end,
    conn.sourceHandle || 'r',
    conn.targetHandle || 'l',
    conn.type || 'straight',
    conn.curvature !== undefined ? conn.curvature : 0.5,
    conn.controlPoint,
    conn.waypoints
  );

  const { path, angle, midX, midY, waypoints } = pathData;

  const startAngle = Math.atan2(end.y - start.y, end.x - start.x);

  return (
    <g
      key={conn.id}
      onClick={(e) => handleConnectionSelect(e, conn.id)}
      className="cursor-pointer"
    >
      <path
        d={path}
        fill="none"
        stroke={isSelected ? '#3b82f6' : conn.color || '#94a3b8'}
        strokeWidth={(conn.strokeWidth || 2) + 12}
        opacity={0.01}
      />
      <path
        d={path}
        fill="none"
        stroke={isSelected ? '#3b82f6' : conn.color || '#94a3b8'}
        strokeWidth={conn.strokeWidth || 2}
        strokeDasharray={conn.dashed ? '5,5' : 'none'}
        className={conn.animated ? 'animated-arrow' : ''}
        style={{ pointerEvents: 'none' }}
      />

      {conn.startArrow && conn.startArrow !== 'none' &&
        renderArrow(
          renderArrowHead(
            conn.startArrow,
            start.x,
            start.y,
            startAngle + Math.PI,
            isSelected ? '#3b82f6' : conn.color || '#94a3b8',
            conn.strokeWidth ? conn.strokeWidth / 2 : 1
          )
        )}
      {conn.endArrow && conn.endArrow !== 'none' &&
        renderArrow(
          renderArrowHead(
            conn.endArrow,
            end.x,
            end.y,
            angle,
            isSelected ? '#3b82f6' : conn.color || '#94a3b8',
            conn.strokeWidth ? conn.strokeWidth / 2 : 1
          )
        )}

      {conn.label && (
        <g transform={`translate(${midX}, ${midY})`}>
          <rect
            x={-conn.label.length * 4 - 8}
            y="-10"
            width={conn.label.length * 8 + 16}
            height="20"
            fill="white"
            rx="4"
            opacity="0.9"
            stroke={isSelected ? '#3b82f6' : '#e2e8f0'}
          />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fontSize="10"
            fill="#475569"
            fontWeight="bold"
            pointerEvents="none"
          >
            {conn.label}
          </text>
        </g>
      )}

      {isSelected && (
        <>
          <circle
            cx={midX}
            cy={midY}
            r="6"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
            onPointerDown={(e) => handleConnectionControlPointDown(e, conn.id)}
            data-control-point="true"
            className="cursor-move"
          />
          {waypoints &&
            waypoints.map((wp, idx) => (
              <circle
                key={`wp-${idx}`}
                cx={wp.x}
                cy={wp.y}
                r="4"
                fill="#ec4899"
                stroke="white"
                strokeWidth="1"
                onPointerDown={(e) => handleWaypointDown(e, conn.id, idx)}
                data-control-point="true"
                className="cursor-move"
              />
            ))}

          <circle
            cx={start.x}
            cy={start.y}
            r="8"
            fill="white"
            stroke="#3b82f6"
            strokeWidth="2"
            onPointerDown={(e) => handleConnectionDragStart(e, conn.id, 'source')}
            className="cursor-crosshair hover:scale-150 transition-transform"
          />
          <circle
            cx={end.x}
            cy={end.y}
            r="8"
            fill="white"
            stroke="#3b82f6"
            strokeWidth="2"
            onPointerDown={(e) => handleConnectionDragStart(e, conn.id, 'target')}
            className="cursor-crosshair hover:scale-150 transition-transform"
          />
        </>
      )}
    </g>
  );
});
