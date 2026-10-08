import React from 'react';
import {
  Folder,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Menu,
  HardDrive,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ExecutionMode, WorkspaceLocation } from '../../types/uka';

interface HeaderProps {
  workspace: WorkspaceLocation;
  mode: ExecutionMode;
  onToggleSidebar: () => void;
  onOpenExplorer: () => void;
  onOpenGitHubExport: () => void;
  activeNavTab: string;
  isProcessing: boolean;
  progress: number;
  statusText: string;
}

export const Header: React.FC<HeaderProps> = ({
  workspace,
  mode,
  onToggleSidebar,
  onOpenExplorer,
  onOpenGitHubExport,
  isProcessing,
  progress,
  statusText,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-3 sm:px-4 py-2.5">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 md:hidden"
            title="Menu latéral"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                  UKA UNPACKER
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  Mobile APK
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                ROM Kitchen & GSI Intelligent Repacker Suite
              </p>
            </div>
          </div>
        </div>

        {/* Center: Active status or progress */}
        {isProcessing && (
          <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-cyan-950/40 border border-cyan-500/40 rounded-full animate-pulse">
            <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-xs text-cyan-300 font-medium max-w-xs truncate">
              {statusText} ({progress}%)
            </span>
          </div>
        )}

        {/* Right: Workspace & Badges & Quick actions */}
        <div className="flex items-center gap-2">
          {/* Workspace badge */}
          <button
            onClick={onOpenExplorer}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-750 text-slate-300 border border-slate-700/80 text-xs transition-colors hover:border-slate-600 group"
            title="Explorer l'espace de travail"
          >
            <Folder className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="max-w-[110px] sm:max-w-[150px] truncate font-mono text-[11px] text-slate-300">
              {workspace === '/data/local/uka' ? '/data/local/uka' : 'SUPEROM'}
            </span>
          </button>

          {/* Root/Non-Root badge */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${
              mode === 'root'
                ? 'bg-rose-950/60 text-rose-300 border-rose-600/40'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40'
            }`}
            title={mode === 'root' ? 'Mode Root actif (su)' : 'Mode Non-Root actif (Stockage/Userspace)'}
          >
            {mode === 'root' ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[11px] font-bold">ROOT</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-bold">NON-ROOT</span>
              </>
            )}
          </div>

          {/* GitHub APK Export button */}
          <button
            onClick={onOpenGitHubExport}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            title="Exporter pour GitHub Action & Compiler APK"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Build APK</span>
          </button>
        </div>
      </div>

      {/* Mobile processing bar */}
      {isProcessing && (
        <div className="w-full mt-2 bg-slate-800 rounded-full h-1.5 overflow-hidden lg:hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-1.5 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </header>
  );
};
