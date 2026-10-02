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
  past: [],
  future: [],

  setPages: (pages) => set({ pages }),
  setCurrentPageId: (id) => set({ currentPageId: id, past: [], future: [] }),

  addPage: () => {
    const state = get();
    const newPage = {
      id: crypto.randomUUID(),
      name: `Sayfa ${state.pages.length + 1}`,
      nodes: [],
      connections: [],
      legendItems: {},
    };
    set({ pages: [...state.pages, newPage], currentPageId: newPage.id, past: [], future: [] });
  },

  deletePage: (id) => {
    const state = get();
    if (state.pages.length <= 1) return;
    const remaining = state.pages.filter((p) => p.id !== id);
    const newCurrentId =
      state.currentPageId === id
        ? remaining[Math.max(0, state.pages.findIndex((p) => p.id === id) - 1)].id
        : state.currentPageId;
    set({ pages: remaining, currentPageId: newCurrentId, past: [], future: [] });
  },

  renamePage: (id, name) => {
    set((state) => ({
      pages: state.pages.map((p) => (p.id === id ? { ...p, name } : p)),
    }));
  },
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

  saveHistory: () => {
    const state = get();
    const currentPage = state.pages.find((p) => p.id === state.currentPageId);
    if (!currentPage) return;
    set((prev) => ({
      past: [
        ...prev.past.slice(-49),
        { nodes: [...currentPage.nodes], connections: [...currentPage.connections] },
      ],
      future: [],
    }));
  },

  undo: () => {
    const state = get();
    if (state.past.length === 0) return;
    const snapshot = state.past[state.past.length - 1];
    const currentPage = state.pages.find((p) => p.id === state.currentPageId);
    set((prev) => ({
      past: prev.past.slice(0, -1),
      future: [
        { nodes: [...currentPage.nodes], connections: [...currentPage.connections] },
        ...prev.future.slice(0, 49),
      ],
      pages: prev.pages.map((p) =>
        p.id === prev.currentPageId
          ? { ...p, nodes: snapshot.nodes, connections: snapshot.connections }
          : p
      ),
      selectedNodeIds: [],
      selectedConnectionId: null,
    }));
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return;
    const snapshot = state.future[0];
    const currentPage = state.pages.find((p) => p.id === state.currentPageId);
    set((prev) => ({
      past: [
        ...prev.past.slice(-49),
        { nodes: [...currentPage.nodes], connections: [...currentPage.connections] },
      ],
      future: prev.future.slice(1),
      pages: prev.pages.map((p) =>
        p.id === prev.currentPageId
          ? { ...p, nodes: snapshot.nodes, connections: snapshot.connections }
          : p
      ),
      selectedNodeIds: [],
      selectedConnectionId: null,
    }));
  },
}));
