import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { ActionView } from './components/views/ActionView';
import { PorterView } from './components/views/PorterView';
import { ConsoleView } from './components/views/ConsoleView';
import { SettingsView } from './components/views/SettingsView';
import { FileExplorerModal } from './components/modals/FileExplorerModal';
import { GitHubExportModal } from './components/modals/GitHubExportModal';
import { ukaEngineInstance } from './services/ukaEngine';
import {
  ConsoleLogEntry,
  ExecutionMode,
  MainNavTab,
  PartitionMetadata,
  SidebarTab,
  SigningKey,
  WorkspaceFile,
  WorkspaceLocation,
} from './types/uka';

export default function App() {
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('unpack');
  const [activeNavTab, setActiveNavTab] = useState<MainNavTab>('action');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

  // Engine state
  const [workspace, setWorkspace] = useState<WorkspaceLocation>(ukaEngineInstance.getWorkspace());
  const [mode, setMode] = useState<ExecutionMode>(ukaEngineInstance.getMode());
  const [files, setFiles] = useState<WorkspaceFile[]>(ukaEngineInstance.getFiles());
  const [partitions, setPartitions] = useState<PartitionMetadata[]>(ukaEngineInstance.getPartitions());
  const [keys, setKeys] = useState<SigningKey[]>(ukaEngineInstance.getKeys());
  const [logs, setLogs] = useState<ConsoleLogEntry[]>(ukaEngineInstance.getLogs());
  const [isProcessing, setIsProcessing] = useState<boolean>(ukaEngineInstance.getIsProcessing());
  const [progress, setProgress] = useState<number>(ukaEngineInstance.getProgress());
  const [statusText, setStatusText] = useState<string>(ukaEngineInstance.getStatusText());

  // Modals state
  const [isExplorerOpen, setIsExplorerOpen] = useState<boolean>(false);
  const [isGitHubExportOpen, setIsGitHubExportOpen] = useState<boolean>(false);

  // Sync with engine
  const refreshEngineState = () => {
    setWorkspace(ukaEngineInstance.getWorkspace());
    setMode(ukaEngineInstance.getMode());
    setFiles(ukaEngineInstance.getFiles());
    setPartitions(ukaEngineInstance.getPartitions());
    setKeys(ukaEngineInstance.getKeys());
    setLogs(ukaEngineInstance.getLogs());
    setIsProcessing(ukaEngineInstance.getIsProcessing());
    setProgress(ukaEngineInstance.getProgress());
    setStatusText(ukaEngineInstance.getStatusText());
  };

  useEffect(() => {
    const unsubscribe = ukaEngineInstance.onLog((newLogs) => {
      setLogs(newLogs);
      setIsProcessing(ukaEngineInstance.getIsProcessing());
      setProgress(ukaEngineInstance.getProgress());
      setStatusText(ukaEngineInstance.getStatusText());
    });
    return () => unsubscribe();
  }, []);

  // Theme application
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // When a sidebar tab is selected, automatically ensure we are on the 'action' navigation pane
  const handleSelectSidebarTab = (tab: SidebarTab) => {
    setActiveSidebarTab(tab);
    setActiveNavTab('action');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Application Header */}
      <Header
        workspace={workspace}
        mode={mode}
        onToggleSidebar={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
        onOpenExplorer={() => setIsExplorerOpen(true)}
        onOpenGitHubExport={() => setIsGitHubExportOpen(true)}
        activeNavTab={activeNavTab}
        isProcessing={isProcessing}
        progress={progress}
        statusText={statusText}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        {/* Sidebar (Desktop sticky / Mobile slide-over) */}
        <Sidebar
          activeTab={activeSidebarTab}
          onSelectTab={handleSelectSidebarTab}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
          workspace={workspace}
          unpackedCount={partitions.length}
          outputCount={files.filter((f) => f.category === 'output').length}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-3 sm:p-5 lg:p-6 pb-24 md:pb-24">
          {activeNavTab === 'action' && (
            <ActionView
              activeSidebarTab={activeSidebarTab}
              workspace={workspace}
              files={files}
              partitions={partitions}
              keys={keys}
              isProcessing={isProcessing}
              progress={progress}
              statusText={statusText}
              onRefresh={refreshEngineState}
              onOpenExplorer={() => setIsExplorerOpen(true)}
              onSelectSidebarTab={handleSelectSidebarTab}
            />
          )}

          {activeNavTab === 'porter' && (
            <PorterView
              workspace={workspace}
              files={files}
              isProcessing={isProcessing}
              progress={progress}
              statusText={statusText}
              onRefresh={refreshEngineState}
              onOpenExplorer={() => setIsExplorerOpen(true)}
            />
          )}

          {activeNavTab === 'console' && (
            <ConsoleView
              workspace={workspace}
              mode={mode}
              logs={logs}
              onRefresh={refreshEngineState}
            />
          )}

          {activeNavTab === 'settings' && (
            <SettingsView
              theme={theme}
              onChangeTheme={setTheme}
              workspace={workspace}
              mode={mode}
              onRefresh={refreshEngineState}
              onOpenExplorer={() => setIsExplorerOpen(true)}
              onOpenGitHubExport={() => setIsGitHubExportOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Bottom Multi-pane Navigation Bar */}
      <BottomNav
        activeTab={activeNavTab}
        onSelectTab={setActiveNavTab}
        activeSidebarTab={activeSidebarTab}
      />

      {/* Workspace File Explorer Modal */}
      <FileExplorerModal
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        workspace={workspace}
        files={files}
      />

      {/* GitHub Actions & APK Compilation Modal */}
      <GitHubExportModal
        isOpen={isGitHubExportOpen}
        onClose={() => setIsGitHubExportOpen(false)}
      />
    </div>
  );
}
