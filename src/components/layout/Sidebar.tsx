import React from 'react';
import {
  ArchiveRestore,
  PackageCheck,
  KeyRound,
  Binary,
  Layers,
  HardDrive,
  FolderOpen,
  X,
  FileCode2,
  CheckCircle2,
} from 'lucide-react';
import { SidebarTab, WorkspaceLocation } from '../../types/uka';

interface SidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  workspace: WorkspaceLocation;
  unpackedCount: number;
  outputCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  workspace,
  unpackedCount,
  outputCount,
}) => {
  const navItems = [
    {
      id: 'unpack' as SidebarTab,
      label: 'Unpack',
      subtitle: 'ROM Zip, Payload, Super & IMG',
      icon: ArchiveRestore,
      color: 'text-cyan-400',
      activeBg: 'bg-cyan-500/15 border-cyan-500/50 text-cyan-200',
      badge: 'Multi-Format',
    },
    {
      id: 'repack' as SidebarTab,
      label: 'Repack',
      subtitle: 'Miroir Intelligent & ROM Flashable',
      icon: PackageCheck,
      color: 'text-emerald-400',
      activeBg: 'bg-emerald-500/15 border-emerald-500/50 text-emerald-200',
      badge: 'Miroir 1:1',
    },
    {
      id: 'signer' as SidebarTab,
      label: 'SIGNER',
      subtitle: 'Génération Clés & Signature APK',
      icon: KeyRound,
      color: 'text-amber-400',
      activeBg: 'bg-amber-500/15 border-amber-500/50 text-amber-200',
      badge: 'v1/v2/v3/v4',
    },
    {
      id: 'metagen' as SidebarTab,
      label: 'MetaGen',
      subtitle: 'oat, odex, vdex, fsvmeta & fs_config',
      icon: Binary,
      color: 'text-purple-400',
      activeBg: 'bg-purple-500/15 border-purple-500/50 text-purple-200',
      badge: 'AOT Tools',
    },
  ];

  const handleItemClick = (id: SidebarTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-[57px] bottom-0 left-0 z-50 md:z-20 w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } h-screen md:h-[calc(100vh-57px)]`}
      >
        {/* Top: Header on mobile + Navigation title */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-slate-800 md:hidden">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white tracking-wide">OKA KITCHEN</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-4 py-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Atelier UKA Unpacker
            </p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 group relative ${
                      isActive
                        ? `${item.activeBg} shadow-sm ring-1 ring-cyan-500/20`
                        : 'border-transparent text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg mt-0.5 transition-colors ${
                        isActive ? 'bg-slate-900/80' : 'bg-slate-800 group-hover:bg-slate-750'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-sm tracking-wide">
                          {item.label}
                        </span>
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-800/90 text-slate-300 border border-slate-700">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>

                    {isActive && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 bg-cyan-400 rounded-r-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Workspace Status Card */}
        <div className="p-4 border-t border-slate-800/90 bg-slate-950/40">
          <div className="bg-slate-850/80 rounded-xl p-3 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Espace Actif
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                Synchronisé
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-800 truncate">
              <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{workspace}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800/60">
                <div className="text-slate-400">Partitions</div>
                <div className="font-bold text-cyan-300">{unpackedCount} extraites</div>
              </div>
              <div className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800/60">
                <div className="text-slate-400">Sorties</div>
                <div className="font-bold text-emerald-300">{outputCount} fichiers</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
