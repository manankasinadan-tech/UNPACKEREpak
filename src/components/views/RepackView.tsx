import React, { useState } from 'react';
import {
  PackageCheck,
  Layers,
  FileCode,
  HardDrive,
  RefreshCw,
  Sparkles,
  CheckCircle,
  Archive,
  ArrowRight,
  FolderOpen,
  Sliders,
  Cpu,
  Info,
} from 'lucide-react';
import { ukaEngineInstance } from '../../services/ukaEngine';
import { FileSystemType, PartitionMetadata, WorkspaceLocation } from '../../types/uka';

interface RepackViewProps {
  workspace: WorkspaceLocation;
  partitions: PartitionMetadata[];
  isProcessing: boolean;
  progress: number;
  statusText: string;
  onRefresh: () => void;
  onOpenExplorer: () => void;
}

export const RepackView: React.FC<RepackViewProps> = ({
  workspace,
  partitions,
  isProcessing,
  progress,
  statusText,
  onRefresh,
  onOpenExplorer,
}) => {
  const [repackMode, setRepackMode] = useState<'mirror_single' | 'super' | 'flashable_zip'>('mirror_single');
  const [selectedPartition, setSelectedPartition] = useState<string>(partitions[0]?.name || 'system');
  const [formatOverride, setFormatOverride] = useState<FileSystemType>('auto');
  const [isSparse, setIsSparse] = useState<boolean>(false);
  const [customRomName, setCustomRomName] = useState<string>('SuperROM_Custom_Flashable_v1.0.zip');
  const [includeBootImg, setIncludeBootImg] = useState<boolean>(true);
  const [selectedSuperParts, setSelectedSuperParts] = useState<string[]>(['system', 'vendor', 'product', 'system_ext', 'odm']);

  const activePart = partitions.find((p) => p.name === selectedPartition) || partitions[0];

  const handleRepackSingle = async () => {
    await ukaEngineInstance.repackPartition(selectedPartition, formatOverride, isSparse);
    onRefresh();
  };

  const handleRepackSuper = async () => {
    await ukaEngineInstance.repackSuperImage(selectedSuperParts);
    onRefresh();
  };

  const handleRepackFlashableZip = async () => {
    await ukaEngineInstance.repackFlashableRomZip(customRomName);
    onRefresh();
  };

  const toggleSuperPart = (name: string) => {
    if (selectedSuperParts.includes(name)) {
      setSelectedSuperParts(selectedSuperParts.filter((p) => p !== name));
    } else {
      setSelectedSuperParts([...selectedSuperParts, name]);
    }
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
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Moteur de Repack Intelligent UKA</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Mirroring 100% Identique
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Reconstitue l'image avec exactement le même système de fichiers (EROFS/EXT4), structure, permissions
                et contextes SELinux qu'à l'origine, garantissant un démarrage parfait du système.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenExplorer}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors self-start sm:self-center"
          >
            <FolderOpen className="w-4 h-4 text-emerald-400" />
            <span>Dossier Sortie : {workspace}/output</span>
          </button>
        </div>
      </div>

      {/* Repack Mode Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setRepackMode('mirror_single')}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            repackMode === 'mirror_single'
              ? 'bg-emerald-500/15 border-emerald-500 ring-1 ring-emerald-500/30 text-white'
              : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
              Miroir 1:1
            </span>
            {repackMode === 'mirror_single' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          </div>
          <div className="font-semibold text-sm text-slate-200">Image de Partition (.img)</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Repacker system.img, vendor.img, product.img au format d'origine
          </p>
        </button>

        <button
          onClick={() => setRepackMode('super')}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            repackMode === 'super'
              ? 'bg-emerald-500/15 border-emerald-500 ring-1 ring-emerald-500/30 text-white'
              : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
              LPMAKE
            </span>
            {repackMode === 'super' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          </div>
          <div className="font-semibold text-sm text-slate-200">Super.img Dynamique</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Assembler toutes les partitions dynamiques dans super.img
          </p>
        </button>

        <button
          onClick={() => setRepackMode('flashable_zip')}
          className={`p-3.5 rounded-xl text-left border transition-all ${
            repackMode === 'flashable_zip'
              ? 'bg-emerald-500/15 border-emerald-500 ring-1 ring-emerald-500/30 text-white'
              : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
              Custom ROM
            </span>
            {repackMode === 'flashable_zip' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          </div>
          <div className="font-semibold text-sm text-slate-200">ZIP Flashable Complet</div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Créer un ZIP pour Recovery (TWRP/OrangeFox) avec scripts
          </p>
        </button>
      </div>

      {/* 1. Mode: Mirror Single Partition */}
      {repackMode === 'mirror_single' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Sélectionnez la partition à recompiler
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {partitions.map((p) => {
                const isSelected = selectedPartition === p.name;
                return (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPartition(p.name)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/30 text-white'
                        : 'bg-slate-850 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">
                      {p.fsType} • {formatSize(p.sizeBytes)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mirror Inspection Card */}
          {activePart && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Profil de Repack Miroir Détecté pour '{activePart.name}'
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Correspondance 1:1 Active
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Système de fichiers</div>
                  <div className="font-bold text-white uppercase mt-0.5">{activePart.fsType}</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Taille Allouée</div>
                  <div className="font-bold text-white font-mono mt-0.5">{formatSize(activePart.sizeBytes)}</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Block Size</div>
                  <div className="font-bold text-white font-mono mt-0.5">{activePart.blockSize} octets</div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Contextes SELinux</div>
                  <div className="font-bold text-emerald-400 mt-0.5">fs_config & contexts</div>
                </div>
              </div>
            </div>
          )}

          {/* Custom overrides if needed */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Personnalisation du Repack (Optionnel)
              </span>
              <span className="text-[11px] text-slate-500">
                Laissez sur "Automatique" pour reproduire le format original
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Convertir le système de fichiers :</label>
                <select
                  value={formatOverride}
                  onChange={(e) => setFormatOverride(e.target.value as FileSystemType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="auto">Automatique (Même format que déballé : {activePart?.fsType})</option>
                  <option value="erofs">EROFS (Lecture seule ultra-rapide et compressée lz4hc)</option>
                  <option value="ext4">EXT4 (Support Read-Write complet pour modification facile)</option>
                  <option value="f2fs">F2FS (Optimisé mémoire flash)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isSparse}
                    onChange={(e) => setIsSparse(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Compresser en format clairsemé (img2simg sparse)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleRepackSingle}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                isProcessing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/25 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Repack en cours ({progress}%)...</span>
                </>
              ) : (
                <>
                  <PackageCheck className="w-4 h-4" />
                  <span>Recompiler '{selectedPartition}.img' à l'identique</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 2. Mode: Super.img Dynamic LPMAKE */}
      {repackMode === 'super' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Générateur Super.img (Partitions dynamiques Android avec lpmake)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Sélectionnez les partitions qui feront partie du conteneur super.img. UKA calculera
            automatiquement la géométrie des blocs et la taille du groupe principal.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
            {['system', 'vendor', 'product', 'system_ext', 'odm'].map((name) => {
              const isChecked = selectedSuperParts.includes(name);
              return (
                <div
                  key={name}
                  onClick={() => toggleSuperPart(name)}
                  className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                    isChecked
                      ? 'bg-slate-800 border-emerald-500 text-white ring-1 ring-emerald-500/30'
                      : 'bg-slate-850 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-bold text-xs">{name}</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-1">
                    {isChecked ? 'Inclus' : 'Exclu'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Taille totale du groupe 'main_a' :</span>
              <span className="font-mono text-white font-bold">6.00 GB (6 442 450 944 octets)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Metadata Slots :</span>
              <span className="font-mono text-white">3 (Slots A/B/C)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Sortie :</span>
              <span className="font-mono text-emerald-400">{workspace}/output/super_repacked.img</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleRepackSuper}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                isProcessing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/25 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Compilation super.img ({progress}%)...</span>
                </>
              ) : (
                <>
                  <PackageCheck className="w-4 h-4" />
                  <span>Compiler super.img (lpmake)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 3. Mode: Flashable ZIP ROM */}
      {repackMode === 'flashable_zip' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Créateur de Custom ROM Flashable (.zip)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Crée une archive complète flashable par recovery (TWRP, OrangeFox) avec update-binary dynamique,
            updater-script configuré, inclusion du boot.img et signature automatique.
          </p>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Nom du fichier de la Custom ROM :
              </label>
              <input
                type="text"
                value={customRomName}
                onChange={(e) => setCustomRomName(e.target.value)}
                placeholder="SuperROM_v1.0.zip"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={includeBootImg}
                  onChange={(e) => setIncludeBootImg(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>Inclure le noyau boot.img (Kernel + Ramdisk init)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>Signer l'archive avec la clé testkey AOSP</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>Générer un script de dynamic partitions pour TWRP</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleRepackFlashableZip}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                isProcessing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/25 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Génération ROM ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  <span>Générer la ROM Flashable (.zip)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
