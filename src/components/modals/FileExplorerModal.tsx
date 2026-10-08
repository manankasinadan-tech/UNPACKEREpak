import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  File,
  FileArchive,
  FileCode,
  HardDrive,
  X,
  Search,
  Download,
  Trash2,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import { WorkspaceFile, WorkspaceLocation } from '../../types/uka';

interface FileExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: WorkspaceLocation;
  files: WorkspaceFile[];
}

export const FileExplorerModal: React.FC<FileExplorerModalProps> = ({
  isOpen,
  onClose,
  workspace,
  files,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'input' | 'unpacked' | 'output' | 'config'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isOpen) return null;

  const filteredFiles = files.filter((f) => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'config'
        ? f.path.includes('config')
        : f.category === activeCategory;
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Explorateur d'Espace UKA</h3>
              <p className="text-xs font-mono text-slate-400">{workspace}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Categories & Search */}
        <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                activeCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Tous ({files.length})
            </button>
            <button
              onClick={() => setActiveCategory('input')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                activeCategory === 'input'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              input/ ({files.filter((f) => f.category === 'input').length})
            </button>
            <button
              onClick={() => setActiveCategory('unpacked')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                activeCategory === 'unpacked'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              unpacked/ ({files.filter((f) => f.category === 'unpacked').length})
            </button>
            <button
              onClick={() => setActiveCategory('output')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                activeCategory === 'output'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              output/ ({files.filter((f) => f.category === 'output').length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrer un fichier..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* File Table */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
            {filteredFiles.map((file) => {
              const isDir = file.type === 'directory';
              const isImg = file.name.endsWith('.img');
              const isZip = file.name.endsWith('.zip');
              return (
                <div
                  key={file.path}
                  className="p-3 flex items-center justify-between gap-3 hover:bg-slate-850/60 transition-colors text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                      {isDir ? (
                        <Folder className="w-4 h-4 text-amber-400" />
                      ) : isZip || isImg ? (
                        <FileArchive className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <FileCode className="w-4 h-4 text-purple-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate flex items-center gap-2">
                        <span>{file.name}</span>
                        {file.fsType && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 uppercase">
                            {file.fsType}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                        {file.path}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-slate-300">{formatSize(file.size)}</div>
                    <div className="text-[10px] text-slate-500">{file.modifiedDate}</div>
                  </div>
                </div>
              );
            })}

            {filteredFiles.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                Aucun fichier trouvé dans ce répertoire.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Total : {filteredFiles.length} éléments affichés</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
