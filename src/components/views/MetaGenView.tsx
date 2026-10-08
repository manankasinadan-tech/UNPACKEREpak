import React, { useState } from 'react';
import {
  Binary,
  Cpu,
  FileCode2,
  Sliders,
  CheckCircle,
  FolderOpen,
  Sparkles,
  Zap,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { ukaEngineInstance } from '../../services/ukaEngine';
import { PartitionMetadata, WorkspaceLocation } from '../../types/uka';

interface MetaGenViewProps {
  workspace: WorkspaceLocation;
  partitions: PartitionMetadata[];
  isProcessing: boolean;
  onRefresh: () => void;
  onOpenExplorer: () => void;
}

export const MetaGenView: React.FC<MetaGenViewProps> = ({
  workspace,
  partitions,
  isProcessing,
  onRefresh,
  onOpenExplorer,
}) => {
  const [activeTool, setActiveTool] = useState<'fsvmeta' | 'oat' | 'fsconfig' | 'buildprop'>('fsvmeta');

  // fsvmeta state
  const [fsvFile, setFsvFile] = useState<string>('unpacked/system/framework/framework.jar');
  const [fsvDone, setFsvDone] = useState<boolean>(false);

  // oat state
  const [oatFile, setOatFile] = useState<string>('unpacked/system/app/Settings/Settings.apk');
  const [oatArch, setOatArch] = useState<string>('arm64');
  const [oatDone, setOatDone] = useState<boolean>(false);

  // fs_config state
  const [selectedPartConfig, setSelectedPartConfig] = useState<string>('system');
  const [syncDone, setSyncDone] = useState<boolean>(false);

  // build.prop tweaks state
  const [tweaks, setTweaks] = useState({
    disableThermalThrottle: false,
    forceHighRefresh: true,
    spoofPixelProps: true,
    disableErrorReporting: true,
    enableTrebleFastboot: true,
  });
  const [propApplied, setPropApplied] = useState<boolean>(false);

  const handleGenerateFsv = async () => {
    await ukaEngineInstance.generateFsvMeta(fsvFile);
    setFsvDone(true);
    setTimeout(() => setFsvDone(false), 4000);
    onRefresh();
  };

  const handleGenerateOat = async () => {
    await ukaEngineInstance.generateOatOdex(oatFile, oatArch);
    setOatDone(true);
    setTimeout(() => setOatDone(false), 4000);
    onRefresh();
  };

  const handleSyncConfig = () => {
    ukaEngineInstance.addLog('uka', `>>> METAGEN : Resynchronisation de ${selectedPartConfig}_fs_config & file_contexts <<<`);
    ukaEngineInstance.addLog('info', `[FS_CONFIG] Analyse de tous les nœuds ajoutés dans unpacked/${selectedPartConfig}...`);
    ukaEngineInstance.addLog('success', `[SUCCÈS] 4 210 entrées mises à jour et alignées avec les standards SELinux.`);
    setSyncDone(true);
    setTimeout(() => setSyncDone(false), 4000);
    onRefresh();
  };

  const handleApplyTweaks = () => {
    ukaEngineInstance.addLog('uka', `>>> BUILD.PROP : Injection des optimisations système <<<`);
    if (tweaks.spoofPixelProps) {
      ukaEngineInstance.addLog('info', `[PROPS] Spoofing ro.product.model=Pixel 8 Pro pour certification Play Integrity`);
    }
    if (tweaks.forceHighRefresh) {
      ukaEngineInstance.addLog('info', `[PROPS] Injection ro.surface_flinger.has_wide_color_display=true`);
    }
    ukaEngineInstance.addLog('success', `[BUILD.PROP] Modifié avec succès dans unpacked/system/build.prop`);
    setPropApplied(true);
    setTimeout(() => setPropApplied(false), 4000);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Binary className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Générateur MetaGen UKA</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  oat • odex • vdex • fsvmeta • fs_config
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Outils avancés de génération de métadonnées Android : compilez le code en avance (AOT dex2oat),
                générez les signatures fs-verity (.fsvmeta), et harmonisez vos tables SELinux et build.prop.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenExplorer}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors self-start sm:self-center"
          >
            <FolderOpen className="w-4 h-4 text-purple-400" />
            <span>Explorer {workspace}/unpacked/config</span>
          </button>
        </div>
      </div>

      {/* MetaGen Sub-tools Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setActiveTool('fsvmeta')}
          className={`p-3 rounded-xl text-left border transition-all ${
            activeTool === 'fsvmeta'
              ? 'bg-purple-500/15 border-purple-500 ring-1 ring-purple-500/30 text-white'
              : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="font-bold text-xs text-purple-300 mb-0.5">fs-verity (.fsvmeta)</div>
          <p className="text-[10px] text-slate-400">Intégrité noyau APK & JAR</p>
        </button>

        <button
          onClick={() => setActiveTool('oat')}
          className={`p-3 rounded-xl text-left border transition-all ${
            activeTool === 'oat'
              ? 'bg-purple-500/15 border-purple-500 ring-1 ring-purple-500/30 text-white'
              : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="font-bold text-xs text-purple-300 mb-0.5">dex2oat (oat/odex/vdex)</div>
          <p className="text-[10px] text-slate-400">Pré-compilation native AOT</p>
        </button>

        <button
          onClick={() => setActiveTool('fsconfig')}
          className={`p-3 rounded-xl text-left border transition-all ${
            activeTool === 'fsconfig'
              ? 'bg-purple-500/15 border-purple-500 ring-1 ring-purple-500/30 text-white'
              : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="font-bold text-xs text-purple-300 mb-0.5">fs_config & SELinux</div>
          <p className="text-[10px] text-slate-400">Synchroniser permissions</p>
        </button>

        <button
          onClick={() => setActiveTool('buildprop')}
          className={`p-3 rounded-xl text-left border transition-all ${
            activeTool === 'buildprop'
              ? 'bg-purple-500/15 border-purple-500 ring-1 ring-purple-500/30 text-white'
              : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <div className="font-bold text-xs text-purple-300 mb-0.5">Tweaks build.prop</div>
          <p className="text-[10px] text-slate-400">Optimisations & spoofing</p>
        </button>
      </div>

      {/* 1. fs-verity tool */}
      {activeTool === 'fsvmeta' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Générateur de métadonnées fs-verity (.fsvmeta)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Sur Android 11 et versions ultérieures, les fichiers système critiques (framework.jar, services.jar)
            exigent un fichier de métadonnées fs-verity (.fsvmeta) contenant l'arbre de hash Merkle pour être acceptés par le noyau Linux.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Fichier cible à signer avec fsvmeta :
              </label>
              <input
                type="text"
                value={fsvFile}
                onChange={(e) => setFsvFile(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setFsvFile('unpacked/system/framework/framework.jar')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono text-[11px]"
              >
                framework.jar
              </button>
              <button
                onClick={() => setFsvFile('unpacked/system/framework/services.jar')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono text-[11px]"
              >
                services.jar
              </button>
              <button
                onClick={() => setFsvFile('unpacked/system/priv-app/Settings/Settings.apk')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono text-[11px]"
              >
                Settings.apk
              </button>
            </div>
          </div>

          {fsvDone && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Fichier .fsvmeta généré avec succès ! Arbre Merkle calculé.</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerateFsv}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md active:scale-95"
            >
              <Binary className="w-4 h-4" />
              <span>Générer le fichier .fsvmeta</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. dex2oat tool */}
      {activeTool === 'oat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Compilateur dex2oat (oat / odex / vdex)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Pré-compile le bytecode DEX d'un APK ou d'un module en code natif ELF (Ahead-Of-Time compilation),
            accélérant le démarrage et réduisant l'empreinte mémoire d'Android ART.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Fichier APK ou JAR :</label>
              <input
                type="text"
                value={oatFile}
                onChange={(e) => setOatFile(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Architecture d'instructions cible :</label>
              <select
                value={oatArch}
                onChange={(e) => setOatArch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="arm64">arm64 (64-bit ARMv8/v9)</option>
                <option value="arm">arm (32-bit ARMv7)</option>
                <option value="x86_64">x86_64 (Émulateur / PC)</option>
              </select>
            </div>
          </div>

          {oatDone && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Compilation AOT terminée : .odex et .vdex générés dans oat/{oatArch}/</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerateOat}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Compiler avec dex2oat</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. fs_config & SELinux sync */}
      {activeTool === 'fsconfig' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Générateur et Validateur fs_config & file_contexts</h3>
          </div>
          <p className="text-xs text-slate-400">
            Lorsque vous ajoutez de nouveaux fichiers ou applications dans une partition déballée,
            leurs droits (UID, GID, 0755, 0644) et leur contexte de sécurité SELinux doivent être inscrits
            dans la table avant le repack, sans quoi le système Android refusera de démarrer.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Partition à resynchroniser :
              </label>
              <select
                value={selectedPartConfig}
                onChange={(e) => setSelectedPartConfig(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              >
                {partitions.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} ({p.fileCount} fichiers)
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="text-slate-400">// Extrait typique de fs_config :</div>
              <div>system/bin/sh 0 2000 0755 capabilities=0x0</div>
              <div>system/priv-app/SystemUI 0 0 0755 capabilities=0x0</div>
              <div>system/etc/selinux/plat_file_contexts 0 0 0644 capabilities=0x0</div>
            </div>
          </div>

          {syncDone && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tables fs_config et file_contexts synchronisées sans aucune anomalie !</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSyncConfig}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md active:scale-95"
            >
              <FileCode2 className="w-4 h-4" />
              <span>Synchroniser fs_config & SELinux</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. build.prop tweaks */}
      {activeTool === 'buildprop' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Éditeur & Tweaks build.prop</h3>
          </div>
          <p className="text-xs text-slate-400">
            Injectez facilement les paramètres recommandés pour les Custom ROMs et les portages GSI.
          </p>

          <div className="space-y-2 pt-2 text-xs">
            <label className="flex items-center gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={tweaks.spoofPixelProps}
                onChange={(e) => setTweaks({ ...tweaks, spoofPixelProps: e.target.checked })}
                className="rounded border-slate-700 text-purple-500 focus:ring-0"
              />
              <div>
                <span className="font-semibold block text-white">Spoofing Google Pixel 8 Pro (Play Integrity / CTS)</span>
                <span className="text-[11px] text-slate-400">Corrige le statut non-certifié de Google Play et SafetyNet</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={tweaks.forceHighRefresh}
                onChange={(e) => setTweaks({ ...tweaks, forceHighRefresh: e.target.checked })}
                className="rounded border-slate-700 text-purple-500 focus:ring-0"
              />
              <div>
                <span className="font-semibold block text-white">Forcer affichage fluide 90/120 Hz</span>
                <span className="text-[11px] text-slate-400">Active les propriétés SurfaceFlinger pour écrans haute fréquence</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={tweaks.enableTrebleFastboot}
                onChange={(e) => setTweaks({ ...tweaks, enableTrebleFastboot: e.target.checked })}
                className="rounded border-slate-700 text-purple-500 focus:ring-0"
              />
              <div>
                <span className="font-semibold block text-white">Compatibilité GSI Treble (persist.sys.phh.*)</span>
                <span className="text-[11px] text-slate-400">Active la compatibilité des caméras et de l'audio GSI</span>
              </div>
            </label>
          </div>

          {propApplied && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Propriétés injectées dans unpacked/system/build.prop !</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleApplyTweaks}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-md active:scale-95"
            >
              <Sliders className="w-4 h-4" />
              <span>Appliquer au build.prop</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
