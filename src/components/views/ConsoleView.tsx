import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Trash2,
  Copy,
  Check,
  Send,
  ShieldAlert,
  ShieldCheck,
  CornerDownLeft,
  Sparkles,
} from 'lucide-react';
import { ukaEngineInstance } from '../../services/ukaEngine';
import { ConsoleLogEntry, ExecutionMode, WorkspaceLocation } from '../../types/uka';

interface ConsoleViewProps {
  workspace: WorkspaceLocation;
  mode: ExecutionMode;
  logs: ConsoleLogEntry[];
  onRefresh: () => void;
}

export const ConsoleView: React.FC<ConsoleViewProps> = ({
  workspace,
  mode,
  logs,
  onRefresh,
}) => {
  const [inputCmd, setInputCmd] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copied, setCopied] = useState<boolean>(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on logs change
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRunCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cmd = inputCmd.trim();
    if (!cmd) return;

    // Add to history
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputCmd('');

    await ukaEngineInstance.executeCommand(cmd);
    onRefresh();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputCmd(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputCmd('');
      } else {
        setHistoryIndex(nextIndex);
        setInputCmd(history[nextIndex]);
      }
    }
  };

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearLogs = () => {
    ukaEngineInstance.clearLogs();
    onRefresh();
  };

  const runQuickCommand = async (cmd: string) => {
    setInputCmd(cmd);
    await ukaEngineInstance.executeCommand(cmd);
    onRefresh();
  };

  const getLogColorClass = (type: ConsoleLogEntry['type']) => {
    switch (type) {
      case 'uka':
        return 'text-cyan-400 font-bold';
      case 'success':
        return 'text-emerald-400 font-semibold';
      case 'error':
        return 'text-rose-400 font-semibold';
      case 'warning':
        return 'text-amber-400 font-medium';
      case 'cmd':
        return 'text-sky-300 font-mono';
      default:
        return 'text-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Console Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:px-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">Terminal UKA & Historique</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {logs.length} logs
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Root Mode Toggle */}
          <button
            onClick={() => {
              const newMode = mode === 'root' ? 'non-root' : 'root';
              ukaEngineInstance.setMode(newMode);
              onRefresh();
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              mode === 'root'
                ? 'bg-rose-950/60 text-rose-300 border-rose-600/50'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50'
            }`}
          >
            {mode === 'root' ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>{mode === 'root' ? 'su (Root)' : 'sh (Non-Root)'}</span>
          </button>

          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700"
            title="Copier les logs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleClearLogs}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-rose-400 border border-slate-700"
            title="Vider la console"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Command Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
          Raccourcis :
        </span>
        <button
          onClick={() => runQuickCommand('uka help')}
          className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 text-cyan-300 font-mono text-[11px] shrink-0"
        >
          uka help
        </button>
        <button
          onClick={() => runQuickCommand('uka status')}
          className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 text-cyan-300 font-mono text-[11px] shrink-0"
        >
          uka status
        </button>
        <button
          onClick={() => runQuickCommand('uka unpack input/super.img')}
          className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 text-cyan-300 font-mono text-[11px] shrink-0"
        >
          uka unpack super.img
        </button>
        <button
          onClick={() => runQuickCommand('uka repack system --sparse')}
          className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 text-emerald-300 font-mono text-[11px] shrink-0"
        >
          uka repack system
        </button>
        <button
          onClick={() => runQuickCommand('uka repack-super')}
          className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 text-emerald-300 font-mono text-[11px] shrink-0"
        >
          uka repack-super
        </button>
        <button
          onClick={() => runQuickCommand('uka signer sign MyApp.apk')}
          className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 text-amber-300 font-mono text-[11px] shrink-0"
        >
          uka signer sign
        </button>
        <button
          onClick={() => runQuickCommand('uka clean')}
          className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px] shrink-0"
        >
          uka clean
        </button>
      </div>

      {/* Black Terminal Screen */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs shadow-2xl flex flex-col h-[460px]">
        {/* Terminal output box */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
          {logs.map((log) => (
            <div key={log.id} className="leading-relaxed flex items-start gap-2">
              <span className="text-[10px] text-slate-600 select-none shrink-0 pt-0.5">
                {log.timestamp}
              </span>
              <pre className={`whitespace-pre-wrap font-mono break-all ${getLogColorClass(log.type)}`}>
                {log.text}
              </pre>
            </div>
          ))}
          <div ref={terminalBottomRef} />
        </div>

        {/* Command Input Prompt Form */}
        <form
          onSubmit={handleRunCommand}
          className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-2"
        >
          <div className="flex items-center gap-1 font-mono text-xs select-none text-emerald-400 shrink-0 font-bold">
            <span className="text-cyan-400">uka</span>
            <span className="text-slate-500">:</span>
            <span className="text-amber-300 max-w-[120px] truncate">{workspace.split('/').pop()}</span>
            <span>{mode === 'root' ? '#' : '$'}</span>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tapez une commande (ex: uka unpack, uka repack system, uka help)..."
            className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-slate-600"
            autoFocus
          />

          <button
            type="submit"
            className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
            title="Exécuter"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
