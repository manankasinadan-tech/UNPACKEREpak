import React, { useState } from 'react';
import {
  ArchiveRestore,
  FileArchive,
  Layers,
  Cpu,
  CheckCircle,
  AlertCircle,
  FileCode,
  FolderOpen,
  ArrowRight,
  HardDrive,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { ukaEngineInstance } from '../../services/ukaEngine';
import { PartitionMetadata, WorkspaceFile, WorkspaceLocation } from '../../types/uka';

interface UnpackViewProps {
  workspace: WorkspaceLocation;
  files: WorkspaceFile[];
  partitions: PartitionMetadata[];
  isProcessing: boolean;
  progress: number;
  statusText: string;
  onRefresh: () => void;
  onOpenExplorer: () => void;
}

export const UnpackView: React.FC<UnpackViewProps> = ({
  workspace,
  files,
  partitions,
  isProcessing,
  progress,
  statusText,
  onRefresh,
  onOpenExplorer,
}) => {
  const [selectedSourceType, setSelectedSourceType] = useState<'zip' | 'payload' | 'super' | 'single_img'>('zip');
  const [selectedFile, setSelectedFile] = useState<string>('LineageOS_21.0_arm64_bgN.zip');
  const [customFileInput, setCustomFileInput] = useState<string>('');
  const [extractOptions, setExtractOptions] = useState({
    autoDetectFs: true,
    dumpFileContexts: true,
    generateFsConfig: true,
    createMirrorProfile: true,
    decompressBrotli: true,
  });

  const sourceTypes = [
    {
      id: 'zip' as const,
      title: 'ROM ZIP Flashable',
      desc: 'Archive complète (MIUI/HyperOS, OxygenOS, LineageOS, Pixel, AOSP, ozip)',
      badge: 'ROM Complète',
      recommendedFile: 'LineageOS_21.0_arm64_bgN.zip',
    },
    {
      id: 'payload' as const,
      title: 'Payload.bin',
      desc: 'Mises à jour OTA Google / OnePlus / Nothing / Motorola (Protobuf v2)',
      badge: 'OTA Dumper',
      recommendedFile: 'payload.bin',
    },
    {
      id: 'super' as const,
      title: 'Super.img',
      desc: 'Partition dynamique Android 10+ (lpunpack : system, vendor, product, odm)',
      badge: 'Dynamic Partitions',
      recommendedFile: 'super.img',
    },
    {
      id: 'single_img' as const,
      title: 'Image Brute (.img)',
      desc: 'system.img, vendor.img, boot.img, recovery.img (EROFS, EXT4, Sparse)',
      badge: 'Image Unique',
      recommendedFile: 'system.img',
    },
  ];

  const handleSelectType = (type: typeof selectedSourceType) => {
    setSelectedSourceType(type);
    const found = sourceTypes.find((s) => s.id === type);
    if (found) {
      setSelectedFile(found.recommendedFile);
    }
  };

  const handleStartUnpack = async () => {
    const target = customFileInput.trim() || selectedFile;
    await ukaEngineInstance.unpackTarget(selectedSourceType, target);
    onRefresh();
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <ArchiveRestore className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Unpacker Multi-Format UKA</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Détection Auto Miroir
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Déballe n'importe quel fichier de ROM (ZIP, payload.bin, super.img ou image brute).
                Le format exact (EROFS/EXT4, permissions, file_contexts) est mémorisé pour le repack identique.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenExplorer}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors self-start sm:self-center"
          >
            <FolderOpen className="w-4 h-4 text-amber-400" />
            <span>Parcourir {workspace === '/data/local/uka' ? '/data/local' : 'SUPEROM'}</span>
          </button>
        </div>
      </div>

      {/* Format Selection Cards */}
      <div>
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          1. Choisissez le type de fichier source à déballer
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sourceTypes.map((item) => {
            const isSelected = selectedSourceType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectType(item.id)}
                className={`text-left p-3.5 rounded-xl border transition-all relative ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-md ring-1 ring-cyan-500/40'
                    : 'bg-slate-850 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    {item.badge}
                  </span>
                  {isSelected && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                </div>
                <div className="font-semibold text-sm mb-1">{item.title}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* File selection in Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          2. Fichier source détecté dans l'espace ({workspace}/input)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {files
            .filter((f) => f.category === 'input')
            .map((file) => {
              const isSelected = selectedFile === file.name && !customFileInput;
              return (
                <div
                  key={file.name}
                  onClick={() => {
                    setSelectedFile(file.name);
                    setCustomFileInput('');
                  }}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 ring-1 ring-cyan-500/30 text-white'
                      : 'bg-slate-850/80 border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileArchive className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {formatSize(file.size)} • {file.modifiedDate}
                      </p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />}
                </div>
              );
            })}
        </div>

        {/* Custom file or path input */}
        <div className="pt-2">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Ou spécifier un nom / chemin de fichier personnalisé :
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customFileInput}
              onChange={(e) => setCustomFileInput(e.target.value)}
              placeholder="ex: input/OxygenOS_14_OnePlus12.zip ou /data/local/UnpackerSystem/system.img"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Advanced Unpack Options */}
        <div className="pt-2 border-t border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Options intelligentes du moteur UKA
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={extractOptions.createMirrorProfile}
                onChange={(e) =>
                  setExtractOptions({ ...extractOptions, createMirrorProfile: e.target.checked })
                }
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Générer profil miroir (unpack_info.json pour repack 1:1)</span>
            </label>

            <label className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={extractOptions.dumpFileContexts}
                onChange={(e) =>
                  setExtractOptions({ ...extractOptions, dumpFileContexts: e.target.checked })
                }
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Extraire file_contexts & fs_config exacts</span>
            </label>

            <label className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={extractOptions.autoDetectFs}
                onChange={(e) =>
                  setExtractOptions({ ...extractOptions, autoDetectFs: e.target.checked })
                }
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Détection automatique EROFS vs EXT4 vs F2FS</span>
            </label>

            <label className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={extractOptions.decompressBrotli}
                onChange={(e) =>
                  setExtractOptions({ ...extractOptions, decompressBrotli: e.target.checked })
                }
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Décompression automatique .br et sdat2img</span>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Destination : <span className="font-mono text-cyan-300">{workspace}/unpacked/</span>
          </div>

          <button
            onClick={handleStartUnpack}
            disabled={isProcessing}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              isProcessing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/25 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Traitement UKA en cours ({progress}%)...</span>
              </>
            ) : (
              <>
                <ArchiveRestore className="w-4 h-4" />
                <span>Lancer le Déballage (Unpack)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Extracted Partitions List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Partitions Actuellement Extraites ({partitions.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Prêtes pour modification & repack
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Partition</th>
                <th className="py-2.5 px-3">Système de fichiers</th>
                <th className="py-2.5 px-3">Taille</th>
                <th className="py-2.5 px-3">Fichiers / Dossiers</th>
                <th className="py-2.5 px-3">SELinux & fs_config</th>
                <th className="py-2.5 px-3">Point de montage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {partitions.map((part) => (
                <tr key={part.name} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {part.name}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-cyan-300 border border-slate-700">
                      {part.fsType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">{formatSize(part.sizeBytes)}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">
                    {part.fileCount} fichiers / {part.dirCount} dirs
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      Capturé (1:1)
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{part.mountPoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
