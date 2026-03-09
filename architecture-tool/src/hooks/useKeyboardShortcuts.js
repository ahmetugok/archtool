import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useKeyboardShortcuts = (
  deleteSelected,
  copySelected,
  cutSelected,
  pasteCopied
) => {
  const selectedNodeIds = useStore((state) => state.selectedNodeIds);
  const setNodes = useStore((state) => state.setNodes);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput =
        document.activeElement.tagName === 'INPUT' ||
        document.activeElement.tagName === 'TEXTAREA';

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!isInput) deleteSelected();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (!isInput) copySelected();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        if (!isInput) {
          e.preventDefault();
          cutSelected();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (!isInput) pasteCopied();
      }
      if (selectedNodeIds.length > 0 && !isInput) {
        const step = e.shiftKey ? 1 : e.ctrlKey ? 20 : 5;
        let dx = 0,
          dy = 0;
        if (e.key === 'ArrowUp') dy = -step;
        else if (e.key === 'ArrowDown') dy = step;
        else if (e.key === 'ArrowLeft') dx = -step;
        else if (e.key === 'ArrowRight') dx = step;
        if (dx !== 0 || dy !== 0) {
          e.preventDefault();
          setNodes((prev) =>
            prev.map((n) =>
              selectedNodeIds.includes(n.id) ? { ...n, x: n.x + dx, y: n.y + dy } : n
            )
          );
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelected, copySelected, cutSelected, pasteCopied, selectedNodeIds, setNodes]);
};
