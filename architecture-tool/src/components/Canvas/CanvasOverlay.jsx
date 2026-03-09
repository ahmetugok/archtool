import React from 'react';

export const CanvasGrid = () => (
  <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />
);

export const SnapLines = ({ snapLines }) => {
  return snapLines.map((line, idx) => {
    if (line.type === 'vertical') {
      return (
        <div
          key={`snap-v-${idx}`}
          className="absolute border-l border-blue-500 z-50 pointer-events-none border-dashed"
          style={{
            left: line.x,
            top: line.y1,
            height: line.y2 - line.y1,
            transform: 'translateX(-50%)'
          }}
        />
      );
    } else {
      return (
        <div
          key={`snap-h-${idx}`}
          className="absolute border-t border-blue-500 z-50 pointer-events-none border-dashed"
          style={{
            top: line.y,
            left: line.x1,
            width: line.x2 - line.x1,
            transform: 'translateY(-50%)'
          }}
        />
      );
    }
  });
};

export const SelectionBox = ({ box }) => {
  if (!box) return null;
  const left = Math.min(box.startX, box.currentX);
  const top = Math.min(box.startY, box.currentY);
  const width = Math.abs(box.startX - box.currentX);
  const height = Math.abs(box.startY - box.currentY);

  return (
    <div
      className="selection-box"
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  );
};
