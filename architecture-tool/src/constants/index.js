import {
  Server,
  Database,
  Globe,
  Smartphone,
  User,
  Activity,
  Box,
  Keyboard,
  GitBranch,
  BoxSelect,
  ArrowDown,
  PlayCircle,
  StopCircle,
  Layout,
} from 'lucide-react';

export const NODE_TYPES = {
  SERVER: { label: 'BACKEND', icon: Server, style: 'bg-white text-slate-900', headerColor: 'bg-blue-100' },
  DATABASE: { label: 'VERİTABANI', icon: Database, style: 'bg-white text-slate-900', headerColor: 'bg-green-100' },
  WEB: { label: 'WEB PORTAL', icon: Globe, style: 'bg-white text-slate-900', headerColor: 'bg-purple-100' },
  MOBILE: { label: 'MOBİL APP', icon: Smartphone, style: 'bg-white text-slate-900', headerColor: 'bg-pink-100' },
  USER: { label: 'KULLANICI', icon: User, style: 'bg-white text-slate-900', headerColor: 'bg-yellow-100' },
  PROCESS: { label: 'SÜREÇ', icon: Activity, style: 'bg-white text-slate-900', headerColor: 'bg-orange-100' },
  COMPONENT: { label: 'RAPOR', icon: Box, style: 'bg-white text-slate-900', headerColor: 'bg-gray-100' },
  MANUAL: { label: 'MANUEL GİRİŞ', icon: Keyboard, style: 'bg-white text-slate-900', headerColor: 'bg-slate-200' },
  DECISION: { label: 'KONTROL / SORGU', icon: GitBranch, style: 'bg-white text-slate-900', headerColor: 'bg-amber-100' },
  UML_CLASS: { label: 'UML SINIF', icon: BoxSelect, style: 'bg-white text-slate-900', headerColor: 'bg-white' },
  LIFELINE: { label: 'YAŞAM ÇİZGİSİ', icon: ArrowDown, style: 'bg-transparent', headerColor: 'bg-white border-slate-900' },
  START: { label: 'BAŞLANGIÇ', icon: PlayCircle, style: 'bg-yellow-100 border-4 border-green-500 border-dashed text-slate-900 rounded-full', headerColor: 'bg-transparent' },
  END: { label: 'BİTİŞ', icon: StopCircle, style: 'bg-yellow-100 border-4 border-red-500 border-dashed text-slate-900 rounded-full', headerColor: 'bg-transparent' },
  SWIMLANE: { label: 'KULVAR / ALAN', icon: Layout, style: 'bg-slate-50/50 border-slate-300 border-dashed text-slate-400', headerColor: 'bg-transparent' },
};

export const BADGE_COLORS = [
  { id: 'slate', class: 'bg-slate-100 text-slate-800 border-slate-200' },
  { id: 'shell-yellow', class: 'bg-[#FBCE07] text-slate-900 border-yellow-400' },
  { id: 'shell-red', class: 'bg-[#DD1D21] text-white border-red-700' },
  { id: 'blue', class: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'green', class: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'red', class: 'bg-red-100 text-red-800 border-red-200' },
  { id: 'yellow', class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 'purple', class: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'orange', class: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'pink', class: 'bg-pink-100 text-pink-800 border-pink-200' },
];

export const BG_COLORS = [
  { id: 'white', hex: '#ffffff', label: 'Beyaz' },
  { id: 'shell-yellow', hex: '#FBCE07', label: 'Shell Sarısı' },
  { id: 'shell-red', hex: '#DD1D21', label: 'Shell Kırmızısı' },
  { id: 'blue', hex: '#eff6ff', label: 'Mavi' },
  { id: 'green', hex: '#f0fdf4', label: 'Yeşil' },
  { id: 'red', hex: '#fef2f2', label: 'Kırmızı' },
  { id: 'yellow', hex: '#fefce8', label: 'Sarı' },
  { id: 'purple', hex: '#faf5ff', label: 'Mor' },
  { id: 'orange', hex: '#fff7ed', label: 'Turuncu' },
  { id: 'gray', hex: '#f8fafc', label: 'Gri' },
];

export const BORDER_COLORS = [
  { id: 'dark', hex: '#0f172a', label: 'Siyah' },
  { id: 'shell-yellow', hex: '#FBCE07', label: 'Shell Sarısı' },
  { id: 'shell-red', hex: '#DD1D21', label: 'Shell Kırmızısı' },
  { id: 'shell-blue', hex: '#003C88', label: 'Shell Mavisi' },
  { id: 'blue', hex: '#2563eb', label: 'Mavi' },
  { id: 'green', hex: '#16a34a', label: 'Yeşil' },
  { id: 'red', hex: '#dc2626', label: 'Kırmızı' },
  { id: 'purple', hex: '#9333ea', label: 'Mor' },
  { id: 'orange', hex: '#ea580c', label: 'Turuncu' },
];

export const HANDLES = [
  { id: 'tl', label: 'Sol Üst', x: 0, y: 0, cursor: 'nwse-resize' },
  { id: 't', label: 'Üst', x: 50, y: 0, cursor: 'ns-resize' },
  { id: 'tr', label: 'Sağ Üst', x: 100, y: 0, cursor: 'nesw-resize' },
  { id: 'l', label: 'Sol', x: 0, y: 50, cursor: 'ew-resize' },
  { id: 'r', label: 'Sağ', x: 100, y: 50, cursor: 'ew-resize' },
  { id: 'bl', label: 'Sol Alt', x: 0, y: 100, cursor: 'nesw-resize' },
  { id: 'b', label: 'Alt', x: 50, y: 100, cursor: 'ns-resize' },
  { id: 'br', label: 'Sağ Alt', x: 100, y: 100, cursor: 'nwse-resize' },
];

export const INITIAL_NODES = [];
export const INITIAL_CONNECTIONS = [];
