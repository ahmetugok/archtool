import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Plus, X } from 'lucide-react';

export const PageBar = () => {
  const pages = useStore((state) => state.pages);
  const currentPageId = useStore((state) => state.currentPageId);
  const setCurrentPageId = useStore((state) => state.setCurrentPageId);
  const addPage = useStore((state) => state.addPage);
  const deletePage = useStore((state) => state.deletePage);
  const renamePage = useStore((state) => state.renamePage);

  const [editingPageId, setEditingPageId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingPageId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingPageId]);

  const startRename = (page) => {
    setEditingPageId(page.id);
    setEditingName(page.name);
  };

  const commitRename = () => {
    if (editingPageId && editingName.trim()) {
      renamePage(editingPageId, editingName.trim());
    }
    setEditingPageId(null);
  };

  return (
    <div className="flex items-center h-8 bg-white border-t border-slate-200 shrink-0 px-1 gap-0.5 overflow-x-auto">
      {pages.map((page) => {
        const isActive = page.id === currentPageId;
        const isEditing = editingPageId === page.id;

        return (
          <div
            key={page.id}
            onClick={() => !isEditing && setCurrentPageId(page.id)}
            onDoubleClick={() => startRename(page)}
            className={`group flex items-center gap-1 px-2.5 py-0.5 rounded-t text-[11px] font-medium cursor-pointer shrink-0 transition-colors select-none ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename();
                  if (e.key === 'Escape') setEditingPageId(null);
                  e.stopPropagation();
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white text-slate-900 text-[11px] w-24 px-1 outline-none rounded"
              />
            ) : (
              <span className="max-w-[120px] truncate" title={page.name}>
                {page.name}
              </span>
            )}
            {pages.length > 1 && !isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePage(page.id);
                }}
                className={`ml-0.5 rounded p-0.5 transition-colors ${
                  isActive
                    ? 'opacity-70 hover:opacity-100 hover:bg-blue-500'
                    : 'opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-slate-200'
                }`}
                title="Sayfayı Sil"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        );
      })}

      <button
        onClick={addPage}
        className="flex items-center justify-center w-6 h-6 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 ml-0.5"
        title="Yeni Sayfa Ekle"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
