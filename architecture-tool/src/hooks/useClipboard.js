import React, { useRef, useState } from 'react';
import { useStore } from '../store/useStore';

export const useClipboard = () => {
  const selectedNodeIds = useStore((state) => state.selectedNodeIds);
  const getNodes = useStore((state) => state.getNodes);
  const getConnections = useStore((state) => state.getConnections);
  const setNodes = useStore((state) => state.setNodes);
  const setConnections = useStore((state) => state.setConnections);
  const setSelectedNodeIds = useStore((state) => state.setSelectedNodeIds);

  const copiedNodesRef = useRef([]);
  const copiedConnectionsRef = useRef([]);
  const isCutRef = useRef(false);

  const copySelected = () => {
    if (selectedNodeIds.length > 0) {
      copiedNodesRef.current = getNodes().filter((n) => selectedNodeIds.includes(n.id));
      copiedConnectionsRef.current = getConnections().filter(
        (c) => selectedNodeIds.includes(c.from) && selectedNodeIds.includes(c.to)
      );
      isCutRef.current = false;
    }
  };

  const cutSelected = () => {
    if (selectedNodeIds.length > 0) {
      copiedNodesRef.current = getNodes().filter((n) => selectedNodeIds.includes(n.id));
      copiedConnectionsRef.current = getConnections().filter(
        (c) => selectedNodeIds.includes(c.from) && selectedNodeIds.includes(c.to)
      );
      isCutRef.current = true;
      setNodes((prev) => prev.filter((n) => !selectedNodeIds.includes(n.id)));
      setConnections((prev) =>
        prev.filter((c) => !selectedNodeIds.includes(c.from) && !selectedNodeIds.includes(c.to))
      );
      setSelectedNodeIds([]);
    }
  };

  const pasteCopied = () => {
    const copiedNodes = copiedNodesRef.current;
    const copiedConnections = copiedConnectionsRef.current;
    const isCut = isCutRef.current;

    if (copiedNodes.length > 0) {
      const idMap = {};
      const newNodes = copiedNodes.map((node) => {
        const newId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
        idMap[node.id] = newId;
        return {
          ...node,
          id: newId,
          x: node.x + 30,
          y: node.y + 30,
          title: isCut ? node.title : node.title + ' (Kopya)',
        };
      });
      const newConns = copiedConnections
        .map((conn) => ({
          ...conn,
          id: 'conn_' + Date.now() + Math.random().toString(36).substr(2, 5),
          from: idMap[conn.from] || conn.from,
          to: idMap[conn.to] || conn.to,
        }))
        .filter((c) => idMap[c.from] && idMap[c.to]);

      setNodes((prev) => [...prev, ...newNodes]);
      setConnections((prev) => [...prev, ...newConns]);
      setSelectedNodeIds(newNodes.map((n) => n.id));

      if (isCut) {
        copiedNodesRef.current = [];
        copiedConnectionsRef.current = [];
        isCutRef.current = false;
      }
    }
  };

  const deleteSelected = () => {
    const selectedConnectionId = useStore.getState().selectedConnectionId;
    if (selectedNodeIds.length > 0) {
      setNodes((prev) => prev.filter((n) => !selectedNodeIds.includes(n.id)));
      setConnections((prev) =>
        prev.filter((c) => !selectedNodeIds.includes(c.from) && !selectedNodeIds.includes(c.to))
      );
      setSelectedNodeIds([]);
    } else if (selectedConnectionId) {
      setConnections((prev) => prev.filter((c) => c.id !== selectedConnectionId));
      useStore.getState().setSelectedConnectionId(null);
    }
  };

  return { copySelected, cutSelected, pasteCopied, deleteSelected };
};
