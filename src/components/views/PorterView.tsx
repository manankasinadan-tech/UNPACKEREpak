import React, { useState } from 'react';
import {
  Smartphone,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  FolderOpen,
  CheckCircle,
  FileCode,
  ShieldAlert,
  Zap,
  Sliders,
  Terminal,
} from 'lucide-react';
import { ukaEngineInstance } from '../../services/ukaEngine';
import { GsiPortConfig, WorkspaceFile, WorkspaceLocation } from '../../types/uka';

interface PorterViewProps {
  workspace: WorkspaceLocation;
  files: WorkspaceFile[];
  isProcessing: boolean;
  progress: number;
  statusText: string;
  onRefresh: () => void;
  onOpenExplorer: () => void;
}

export const PorterView: React.FC<PorterViewProps> = ({
  workspace,
  files,
  isProcessing,
  progress,
  statusText,
  onRefresh,
  onOpenExplorer,
}) => {
  const [portConfig, setPortConfig] = useState<GsiPortConfig>({
    gsiSourceName: 'LineageOS_21_GSI_arm64.img',
    vendorBaseName: 'Stock_Pixel_Vendor.img',
    androidVersion: '15',
    architecture: 'arm64',
    patchBoot: true,
    selinuxMode: 'permissive',
    disableDmVerity: true,
    disableForcedEncryption: true,
    convertErofsToExt4: false,
    injectPhhTreble: true,
    fixVendorManifest: true,
    generateFastbootScript: true,
  });

  const [portSuccess, setPortSuccess] = useState<boolean>(false);

  const handleStartPorting = async () => {
    const success = await ukaEngineInstance.runGsiPorter(portConfig);
    if (success) {
      setPortSuccess(true);
      setTimeout(() => setPortSuccess(false), 5000);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-500/30 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Studio de Portage GSI (Treble)</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Project Treble Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Adaptez n'importe quelle Generic System Image (AOSP, Pixel Experience, LineageOS, crDroid)
                sur la base propriétaire (Vendor + Boot) de votre appareil spécifique.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenExplorer}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors self-start sm:self-center"
          >
            <FolderOpen className="w-4 h-4 text-blue-400" />
            <span>Dossier GSI : {workspace}/output</span>
          </button>
        </div>
      </div>

      {/* Main Porting Configuration Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-5">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            1. Fichiers sources pour le portage
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Image GSI Source (Generic System Image) :</label>
              <input
                type="text"
                value={portConfig.gsiSourceName}
                onChange={(e) => setPortConfig({ ...portConfig, gsiSourceName: e.target.value })}
                placeholder="ex: LineageOS_21_GSI.img"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Base Vendor Stock de l'appareil cible :</label>
              <input
                type="text"
                value={portConfig.vendorBaseName}
                onChange={(e) => setPortConfig({ ...portConfig, vendorBaseName: e.target.value })}
                placeholder="ex: vendor.img de votre téléphone"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Architecture & Target Android Version */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-slate-800 pt-4">
          <div>
            <label className="block text-slate-400 mb-1">Architecture du processeur (CPU) :</label>
            <select
              value={portConfig.architecture}
              onChange={(e) => setPortConfig({ ...portConfig, architecture: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            >
              <option value="arm64">ARM64 (a64 / arm64-v8a 64-bit)</option>
              <option value="arm32_binder64">ARM32 Binder64 (Appareils A/B 32-bit CPU)</option>
              <option value="arm">ARM32 standard</option>
              <option value="x86_64">x86_64 (Émulateurs)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Mode SELinux cible :</label>
            <select
              value={portConfig.selinuxMode}
              onChange={(e) => setPortConfig({ ...portConfig, selinuxMode: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            >
              <option value="permissive">Permissive (Recommandé pour 1er boot GSI sans plantage)</option>
              <option value="enforcing">Enforcing (Sécurité stricte)</option>
            </select>
          </div>
        </div>

        {/* Boot & Kernel Patching Modules */}
        <div className="border-t border-slate-800 pt-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            2. Correctifs de compatibilité Treble & Noyau
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <label className="flex items-center gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={portConfig.patchBoot}
                onChange={(e) => setPortConfig({ ...portConfig, patchBoot: e.target.checked })}
                className="rounded border-slate-700 text-blue-500 focus:ring-0"
              />
              <div>
                <span className="font-semibold block text-white">Patcher le boot.img (magiskboot)</span>
                <span className="text-[11px] text-slate-400">Désactive la signature AVB et permet le démarrage GSI</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={portConfig.disableDmVerity}
                onChange={(e) => setPortConfig({ ...portConfig, disableDmVerity: e.target.checked })}
                className="rounded border-slate-700 text-blue-500 focus:ring-0"
              />
              <div>
                <span className="font-semibold block text-white">Désactiver dm-verity</span>
                <span className="text-[11px] text-slate-400">Évite les bootloops causés par la vérification de partition modifiée</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={portConfig.disableForcedEncryption}
                onChange={(e) => setPortConfig({ ...portConfig, disableForcedEncryption: e.target.checked })}
                className="rounded border-slate-700 text-blue-500 focus:ring-0"
              />
              <div>
                <span className="font-semibold block text-white">Désactiver le chiffrement forcé (fstab)</span>
                <span className="text-[11px] text-slate-400">Empêche le blocage au premier démarrage si userdata n'est pas formaté</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={portConfig.injectPhhTreble}
                onChange={(e) => setPortConfig({ ...portConfig, injectPhhTreble: e.target.checked })}
                className="rounded border-slate-700 text-blue-500 focus:ring-0"
              />
              <div>
                <span className="font-semibold block text-white">Injecter scripts & overlays PHH Treble</span>
                <span className="text-[11px] text-slate-400">Corrige luminosité, audio in-call et caméra sur de nombreux modèles</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={portConfig.fixVendorManifest}
                onChange={(e) => setPortConfig({ ...portConfig, fixVendorManifest: e.target.checked })}
                className="rounded border-slate-700 text-blue-500 focus:ring-0"
              />
              <div>
                <span className="font-semibold block text-white">Aligner compatibility_matrix.xml</span>
                <span className="text-[11px] text-slate-400">Résout les incompatibilités HIDL/AIDL entre system et vendor</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={portConfig.generateFastbootScript}
                onChange={(e) => setPortConfig({ ...portConfig, generateFastbootScript: e.target.checked })}
                className="rounded border-slate-700 text-blue-500 focus:ring-0"
              />
              <div>
                <span className="font-semibold block text-white">Générer script fastboot (flash_all)</span>
                <span className="text-[11px] text-slate-400">Commandes prêtes à exécuter pour flasher en mode Fastbootd</span>
              </div>
            </label>
          </div>
        </div>

        {portSuccess && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block">Portage GSI terminé avec succès !</span>
              <span className="text-slate-300 text-[11px]">
                Image générée : output/GSI_Ported_System.img et scripts de flashage prêts.
              </span>
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Temps estimé : <span className="text-white font-semibold">~30 secondes</span>
          </div>

          <button
            onClick={handleStartPorting}
            disabled={isProcessing}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              isProcessing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-blue-600/25 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                <span>Portage GSI en cours ({progress}%)...</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4" />
                <span>Lancer le Portage GSI Treble</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
