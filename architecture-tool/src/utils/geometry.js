export const getHandlesForNode = (node, HANDLES) => {
  if (node.type === 'LIFELINE') {
    const handles = [{ id: 't', x: 50, y: 0, cursor: 'ns-resize' }];
    for (let i = 1; i <= 9; i++) {
      handles.push({ id: `v${i}`, x: 50, y: i * 10, cursor: 'crosshair' });
    }
    handles.push({ id: 'b', x: 50, y: 100, cursor: 'ns-resize' });
    handles.push({ id: 'br', x: 100, y: 100, cursor: 'nwse-resize' });
    return handles;
  }
  return HANDLES;
};

export const toPaleColor = (hex, alpha = '33') => {
  if (!hex || typeof hex !== 'string') return hex;
  if (hex.startsWith('#') && hex.length === 7) return `${hex}${alpha}`;
  if (hex.startsWith('#') && hex.length === 4) {
    const r = hex[1];
    const g = hex[2];
    const b = hex[3];
    return `#${r}${r}${g}${g}${b}${b}${alpha}`;
  }
  return hex;
};

export const getNodeRect = (node) => ({
  x: node.x,
  y: node.y,
  width: node.width || 160,
  height: node.height || 100,
});

export const getHandleCoords = (node, handleId, HANDLES) => {
  const rect = getNodeRect(node);
  const h = (node.type === 'LIFELINE' ? getHandlesForNode(node, HANDLES) : HANDLES).find(
    (x) => x.id === handleId
  );
  if (!h) return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  return {
    x: rect.x + (rect.width * h.x) / 100,
    y: rect.y + (rect.height * h.y) / 100,
  };
};

export const getBezierPathAndAngle = (
  start,
  end,
  sourceHandle,
  targetHandle,
  type,
  curvature = 0.5,
  controlPoint,
  waypoints = null
) => {
  if (type === 'step' && waypoints && waypoints.length > 0) {
    let path = `M ${start.x} ${start.y}`;
    for (const wp of waypoints) {
      path += ` L ${wp.x} ${wp.y}`;
    }
    path += ` L ${end.x} ${end.y}`;
    const lastWp = waypoints[waypoints.length - 1];
    const angle = Math.atan2(end.y - lastWp.y, end.x - lastWp.x);
    const midIdx = Math.floor(waypoints.length / 2);
    const midWp = waypoints[midIdx] || waypoints[0];
    return { path, angle, midX: midWp.x, midY: midWp.y, waypoints };
  }

  if (type === 'step') {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    let path = '';
    let angle = 0;
    let midX = (start.x + end.x) / 2;
    let midY = (start.y + end.y) / 2;
    let generatedWaypoints = [];

    const srcDir =
      sourceHandle === 'r' ? 'right' :
      sourceHandle === 'l' ? 'left' :
      sourceHandle === 't' ? 'up' :
      sourceHandle === 'b' ? 'down' :
      sourceHandle && sourceHandle.includes('r') ? 'right' :
      sourceHandle && sourceHandle.includes('l') ? 'left' :
      sourceHandle && sourceHandle.includes('t') ? 'up' :
      sourceHandle && sourceHandle.includes('b') ? 'down' : 'right';

    const tgtDir =
      targetHandle === 'l' ? 'left' :
      targetHandle === 'r' ? 'right' :
      targetHandle === 't' ? 'up' :
      targetHandle === 'b' ? 'down' :
      targetHandle && targetHandle.includes('l') ? 'left' :
      targetHandle && targetHandle.includes('r') ? 'right' :
      targetHandle && targetHandle.includes('t') ? 'up' :
      targetHandle && targetHandle.includes('b') ? 'down' : 'left';

    const isHorizontalSrc = srcDir === 'left' || srcDir === 'right';
    const isHorizontalTgt = tgtDir === 'left' || tgtDir === 'right';

    if (isHorizontalSrc && isHorizontalTgt) {
      const midXPos = (start.x + end.x) / 2;
      path = `M ${start.x} ${start.y} L ${midXPos} ${start.y} L ${midXPos} ${end.y} L ${end.x} ${end.y}`;
      angle = dx > 0 ? 0 : Math.PI;
      midX = midXPos;
      midY = (start.y + end.y) / 2;
      generatedWaypoints = [
        { x: midXPos, y: start.y },
        { x: midXPos, y: end.y },
      ];
    } else if (!isHorizontalSrc && !isHorizontalTgt) {
      const midYPos = (start.y + end.y) / 2;
      path = `M ${start.x} ${start.y} L ${start.x} ${midYPos} L ${end.x} ${midYPos} L ${end.x} ${end.y}`;
      angle = dy > 0 ? Math.PI / 2 : -Math.PI / 2;
      midX = (start.x + end.x) / 2;
      midY = midYPos;
      generatedWaypoints = [
        { x: start.x, y: midYPos },
        { x: end.x, y: midYPos },
      ];
    } else if (isHorizontalSrc && !isHorizontalTgt) {
      path = `M ${start.x} ${start.y} L ${end.x} ${start.y} L ${end.x} ${end.y}`;
      angle = dy > 0 ? Math.PI / 2 : -Math.PI / 2;
      midX = end.x;
      midY = start.y;
      generatedWaypoints = [{ x: end.x, y: start.y }];
    } else {
      path = `M ${start.x} ${start.y} L ${start.x} ${end.y} L ${end.x} ${end.y}`;
      angle = dx > 0 ? 0 : Math.PI;
      midX = start.x;
      midY = end.y;
      generatedWaypoints = [{ x: start.x, y: end.y }];
    }

    return { path, angle, midX, midY, generatedWaypoints };
  }

  if (type === 'straight') {
    const path = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    return { path, angle, midX: (start.x + end.x) / 2, midY: (start.y + end.y) / 2 };
  }

  if (controlPoint) {
    const path = `M ${start.x} ${start.y} Q ${controlPoint.x} ${controlPoint.y} ${end.x} ${end.y}`;
    const angle = Math.atan2(end.y - controlPoint.y, end.x - controlPoint.x);
    return { path, angle, midX: controlPoint.x, midY: controlPoint.y };
  }

  const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  const baseOffset = Math.min(dist * 0.25, 50);
  const offset = baseOffset * (curvature * 2);

  let cp1x = start.x,
    cp1y = start.y,
    cp2x = end.x,
    cp2y = end.y;

  if (sourceHandle.includes('t') || sourceHandle.startsWith('v')) cp1y -= offset;
  else if (sourceHandle.startsWith('v')) {
    if (end.x > start.x) cp1x += offset;
    else cp1x -= offset;
  } else {
    if (sourceHandle.includes('t')) cp1y -= offset;
    if (sourceHandle.includes('b')) cp1y += offset;
    if (sourceHandle.includes('l')) cp1x -= offset;
    if (sourceHandle.includes('r')) cp1x += offset;
  }

  if (targetHandle.startsWith('v')) {
    if (start.x > end.x) cp2x += offset;
    else cp2x -= offset;
  } else {
    if (targetHandle.includes('t')) cp2y -= offset;
    if (targetHandle.includes('b')) cp2y += offset;
    if (targetHandle.includes('l')) cp2x -= offset;
    if (targetHandle.includes('r')) cp2x += offset;
  }

  const path = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
  const tangentX = 3 * (end.x - cp2x);
  const tangentY = 3 * (end.y - cp2y);
  const angle = Math.atan2(tangentY, tangentX);

  const t = 0.5;
  const midX =
    (1 - t) * (1 - t) * (1 - t) * start.x +
    3 * (1 - t) * (1 - t) * t * cp1x +
    3 * (1 - t) * t * t * cp2x +
    t * t * t * end.x;
  const midY =
    (1 - t) * (1 - t) * (1 - t) * start.y +
    3 * (1 - t) * (1 - t) * t * cp1y +
    3 * (1 - t) * t * t * cp2y +
    t * t * t * end.y;

  return { path, angle, midX, midY };
};
