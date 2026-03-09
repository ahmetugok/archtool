import React from 'react';

export const renderArrowHead = (type, tipX, tipY, angle, color = '#0f172a', size = 1) => {
  if (type === 'none') return null;

  const len = 12 * size;
  const wid = 6 * size;

  if (type === 'standard') {
    const baseX = tipX - len * Math.cos(angle);
    const baseY = tipY - len * Math.sin(angle);
    const left = {
      x: baseX - wid * Math.sin(angle),
      y: baseY + wid * Math.cos(angle),
    };
    const right = {
      x: baseX + wid * Math.sin(angle),
      y: baseY - wid * Math.cos(angle),
    };
    return {
      type: 'path',
      d: `M ${tipX} ${tipY} L ${left.x} ${left.y} L ${right.x} ${right.y} Z`,
      fill: color,
    };
  }

  if (type === 'open') {
    const left = {
      x: tipX - len * Math.cos(angle) - wid * Math.sin(angle),
      y: tipY - len * Math.sin(angle) + wid * Math.cos(angle),
    };
    const right = {
      x: tipX - len * Math.cos(angle) + wid * Math.sin(angle),
      y: tipY - len * Math.sin(angle) - wid * Math.cos(angle),
    };
    return {
      type: 'path',
      d: `M ${left.x} ${left.y} L ${tipX} ${tipY} L ${right.x} ${right.y}`,
      fill: 'none',
      stroke: color,
    };
  }

  if (type === 'circle') {
    const centerX = tipX - len * 0.6 * Math.cos(angle);
    const centerY = tipY - len * 0.6 * Math.sin(angle);
    return {
      type: 'circle',
      x: centerX,
      y: centerY,
      r: 5 * size,
      fill: 'white',
      stroke: color,
    };
  }

  if (type === 'filledCircle') {
    const centerX = tipX - len * 0.6 * Math.cos(angle);
    const centerY = tipY - len * 0.6 * Math.sin(angle);
    return {
      type: 'circle',
      x: centerX,
      y: centerY,
      r: 5 * size,
      fill: color,
      stroke: color,
    };
  }

  if (type === 'diamond') {
    const centerX = tipX - len * Math.cos(angle);
    const centerY = tipY - len * Math.sin(angle);
    const d = wid * 0.9;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const points = [
      { x: centerX + d * cos, y: centerY + d * sin },
      { x: centerX - d * sin, y: centerY + d * cos },
      { x: centerX - d * cos, y: centerY - d * sin },
      { x: centerX + d * sin, y: centerY - d * cos },
    ];
    return {
      type: 'path',
      d: `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y} L ${points[3].x} ${points[3].y} Z`,
      fill: 'white',
      stroke: color,
    };
  }

  if (type === 'filledDiamond') {
    const centerX = tipX - len * Math.cos(angle);
    const centerY = tipY - len * Math.sin(angle);
    const d = wid * 0.9;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const points = [
      { x: centerX + d * cos, y: centerY + d * sin },
      { x: centerX - d * sin, y: centerY + d * cos },
      { x: centerX - d * cos, y: centerY - d * sin },
      { x: centerX + d * sin, y: centerY - d * cos },
    ];
    return {
      type: 'path',
      d: `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y} L ${points[3].x} ${points[3].y} Z`,
      fill: color,
      stroke: color,
    };
  }

  return null;
};

export const renderArrow = (arrowData, isShadow = false) => {
  if (!arrowData) return null;

  if (arrowData.type === 'path') {
    return (
      <path
        d={arrowData.d}
        fill={isShadow ? '#000' : arrowData.fill || 'none'}
        stroke={isShadow ? '#000' : arrowData.stroke || arrowData.fill}
        strokeWidth={isShadow ? '3' : '2'}
        opacity={isShadow ? 0.15 : 1}
        strokeLinejoin="round"
      />
    );
  }

  if (arrowData.type === 'circle') {
    return (
      <circle
        cx={arrowData.x}
        cy={arrowData.y}
        r={arrowData.r}
        fill={isShadow ? '#000' : arrowData.fill}
        stroke={isShadow ? '#000' : arrowData.stroke}
        strokeWidth={isShadow ? '3' : '2'}
        opacity={isShadow ? 0.15 : 1}
      />
    );
  }

  return null;
};
