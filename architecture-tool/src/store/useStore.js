import { useState } from 'react';
import { create } from 'zustand';
import { INITIAL_CONNECTIONS, INITIAL_NODES } from '../constants';

const STORAGE_KEY_PAGES = 'arch_tool_pages_v1';
const STORAGE_KEY_CURRENT_PAGE = 'arch_tool_current_page';

const getInitialPages = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PAGES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const existingNodes = localStorage.getItem('arch_tool_nodes_v3');
    const existingConns = localStorage.getItem('arch_tool_conns_v3');
    const existingLegend = localStorage.getItem('arch_tool_legend_v3');
    return [
      {
        id: 'page_1',
        name: 'Sayfa 1',
        nodes: existingNodes ? JSON.parse(existingNodes) : INITIAL_NODES,
        connections: existingConns ? JSON.parse(existingConns) : INITIAL_CONNECTIONS,
        legendItems: existingLegend ? JSON.parse(existingLegend) : { SFS: 'Satış Finans Sistemi' },
      },
    ];
  } catch (e) {
    console.error('Pages load error:', e);
    return [
      {
        id: 'page_1',
        name: 'Sayfa 1',
        nodes: INITIAL_NODES,
        connections: INITIAL_CONNECTIONS,
        legendItems: {},
      },
    ];
  }
};

const getInitialCurrentPageId = (pages) => {
  try {
    const savedPageId = localStorage.getItem(STORAGE_KEY_CURRENT_PAGE);
    if (savedPageId && pages.some((p) => p.id === savedPageId)) {
      return savedPageId;
    }
  } catch (e) {}
  return pages[0]?.id || 'page_1';
};

const initialPages = getInitialPages();
const initialCurrentPageId = getInitialCurrentPageId(initialPages);

export const useStore = create((set, get) => ({
  pages: initialPages,
  currentPageId: initialCurrentPageId,
  selectedNodeIds: [],
  selectedConnectionId: null,
  scale: 1,
  pan: { x: 0, y: 0 },

  setPages: (pages) => set({ pages }),
  setCurrentPageId: (id) => set({ currentPageId: id }),
  setSelectedNodeIds: (ids) => set({ selectedNodeIds: typeof ids === 'function' ? ids(get().selectedNodeIds) : ids }),
  setSelectedConnectionId: (id) => set({ selectedConnectionId: id }),
  setScale: (scale) => set({ scale: typeof scale === 'function' ? scale(get().scale) : scale }),
  setPan: (pan) => set({ pan: typeof pan === 'function' ? pan(get().pan) : pan }),

  getNodes: () => {
    const state = get();
    return state.pages.find((p) => p.id === state.currentPageId)?.nodes || [];
  },
  getConnections: () => {
    const state = get();
    return state.pages.find((p) => p.id === state.currentPageId)?.connections || [];
  },

  setNodes: (updater) => {
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === state.currentPageId
          ? { ...p, nodes: typeof updater === 'function' ? updater(p.nodes) : updater }
          : p
      ),
    }));
  },

  setConnections: (updater) => {
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === state.currentPageId
          ? { ...p, connections: typeof updater === 'function' ? updater(p.connections) : updater }
          : p
      ),
    }));
  },

  updateNodeData: (id, field, value) => {
    get().setNodes((nodes) =>
      nodes.map((n) => (n.id === id ? { ...n, [field]: value } : n))
    );
  },

  updateMultipleNodesData: (ids, field, value) => {
    get().setNodes((nodes) =>
      nodes.map((n) => (ids.includes(n.id) ? { ...n, [field]: value } : n))
    );
  },
}));
