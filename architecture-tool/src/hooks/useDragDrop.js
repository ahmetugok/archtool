import { useStore } from '../store/useStore';

export const useDragDrop = (canvasRef) => {
  const scale = useStore((state) => state.scale);
  const pan = useStore((state) => state.pan);

  const getWorldPos = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    return {
      x: (clientX - rect.left - pan.x) / scale,
      y: (clientY - rect.top - pan.y) / scale,
    };
  };

  return { getWorldPos };
};
