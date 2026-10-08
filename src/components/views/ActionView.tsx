import React from 'react';
import { SidebarTab, WorkspaceLocation, PartitionMetadata, WorkspaceFile, SigningKey } from '../../types/uka';
import { UnpackView } from './UnpackView';
import { RepackView } from './RepackView';
import { SignerView } from './SignerView';
import { MetaGenView } from './MetaGenView';

interface ActionViewProps {
  activeSidebarTab: SidebarTab;
  workspace: WorkspaceLocation;
  files: WorkspaceFile[];
  partitions: PartitionMetadata[];
  keys: SigningKey[];
  isProcessing: boolean;
  progress: number;
  statusText: string;
  onRefresh: () => void;
  onOpenExplorer: () => void;
  onSelectSidebarTab: (tab: SidebarTab) => void;
}

export const ActionView: React.FC<ActionViewProps> = ({
  activeSidebarTab,
  workspace,
  files,
  partitions,
  keys,
  isProcessing,
  progress,
  statusText,
  onRefresh,
  onOpenExplorer,
  onSelectSidebarTab,
}) => {
  return (
    <div className="space-y-4">
      {/* Mobile Quick Switcher pills for the sidebar categories */}
      <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectSidebarTab('unpack')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
            activeSidebarTab === 'unpack'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          Unpack
        </button>
        <button
          onClick={() => onSelectSidebarTab('repack')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
            activeSidebarTab === 'repack'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          Repack
        </button>
        <button
          onClick={() => onSelectSidebarTab('signer')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
            activeSidebarTab === 'signer'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          SIGNER
        </button>
        <button
          onClick={() => onSelectSidebarTab('metagen')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
            activeSidebarTab === 'metagen'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          MetaGen
        </button>
      </div>

      {/* Render the appropriate sidebar tool */}
      {activeSidebarTab === 'unpack' && (
        <UnpackView
          workspace={workspace}
          files={files}
          partitions={partitions}
          isProcessing={isProcessing}
          progress={progress}
          statusText={statusText}
          onRefresh={onRefresh}
          onOpenExplorer={onOpenExplorer}
        />
      )}

      {activeSidebarTab === 'repack' && (
        <RepackView
          workspace={workspace}
          partitions={partitions}
          isProcessing={isProcessing}
          progress={progress}
          statusText={statusText}
          onRefresh={onRefresh}
          onOpenExplorer={onOpenExplorer}
        />
      )}

      {activeSidebarTab === 'signer' && (
        <SignerView
          workspace={workspace}
          files={files}
          keys={keys}
          isProcessing={isProcessing}
          progress={progress}
          statusText={statusText}
          onRefresh={onRefresh}
          onOpenExplorer={onOpenExplorer}
        />
      )}

      {activeSidebarTab === 'metagen' && (
        <MetaGenView
          workspace={workspace}
          partitions={partitions}
          isProcessing={isProcessing}
          onRefresh={onRefresh}
          onOpenExplorer={onOpenExplorer}
        />
      )}
    </div>
  );
};
