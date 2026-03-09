import React, { useState, useRef } from 'react';

export const Tooltip = ({ children, text, side = 'right' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      if (side === 'right') {
        setTooltipPos({ x: rect.right + 8, y: rect.top + rect.height / 2 });
      } else {
        setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top - 32 });
      }
    }
  };

  return (
    <>
      <div
        ref={buttonRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        className="relative"
      >
        {children}
      </div>
      {isHovered && text && (
        <div
          className="tooltip"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: side === 'right' ? 'translateY(-50%)' : 'translateX(-50%) translateY(-100%)',
          }}
        >
          {text}
        </div>
      )}
    </>
  );
};
