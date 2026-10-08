import React, { useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Laptop,
  FolderOpen,
  Shield,
  HelpCircle,
  Terminal,
  History,
  Sparkles,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  HardDrive,
  Info,
} from 'lucide-react';
import { ukaEngineInstance } from '../../services/ukaEngine';
import { UKA_CHANGELOG, UKA_COMMAND_LIST } from '../../data/ukaConstants';
import { ExecutionMode, WorkspaceLocation } from '../../types/uka';

interface SettingsViewProps {
  theme: 'light' | 'dark' | 'system';
  onChangeTheme: (theme: 'light' | 'dark' | 'system') => void;
  workspace: WorkspaceLocation;
  mode: ExecutionMode;
  onRefresh: () => void;
  onOpenExplorer: () => void;
  onOpenGitHubExport: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  theme,
  onChangeTheme,
  workspace,
  mode,
  onRefresh,
  onOpenExplorer,
  onOpenGitHubExport,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'commands' | 'help' | 'changelog'>('general');
  const [customWorkspaceInput, setCustomWorkspaceInput] = useState<string>('');

  const handleSetWorkspace = (path: WorkspaceLocation) => {
    ukaEngineInstance.setWorkspace(path);
    onRefresh();
  };

  const handleCustomWorkspaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customWorkspaceInput.trim()) {
      handleSetWorkspace(customWorkspaceInput.trim());
      setCustomWorkspaceInput('');
    }
  };

  const handleToggleMode = (newMode: ExecutionMode) => {
    ukaEngineInstance.setMode(newMode);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-850 via-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Paramètres & Documentation UKA</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configuration de l'environnement, thèmes, commandes et historique complet hors-ligne.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto scrollbar-none pb-0.5">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeSubTab === 'general'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Général & Espace
        </button>
        <button
          onClick={() => setActiveSubTab('commands')}
          className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeSubTab === 'commands'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Liste des Commandes ({UKA_COMMAND_LIST.length})
        </button>
        <button
          onClick={() => setActiveSubTab('help')}
          className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeSubTab === 'help'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Aide & Guide ROM
        </button>
        <button
          onClick={() => setActiveSubTab('changelog')}
          className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 transition-all shrink-0 ${
            activeSubTab === 'changelog'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Changelog Offline ({UKA_CHANGELOG.length})
        </button>
      </div>

      {/* 1. General Settings */}
      {activeSubTab === 'general' && (
        <div className="space-y-6">
          {/* Theme Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Thème de l'interface
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => onChangeTheme('light')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/40'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-semibold">Clair</span>
              </button>

              <button
                onClick={() => onChangeTheme('dark')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/40'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-semibold">Sombre</span>
              </button>

              <button
                onClick={() => onChangeTheme('system')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'system'
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 ring-1 ring-cyan-500/40'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Laptop className="w-5 h-5 text-slate-300" />
                <span className="text-xs font-semibold">Système</span>
              </button>
            </div>
          </div>

          {/* Workspace Chooser */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. Choix de l'espace de travail (Workspace)
              </h3>
              <button
                onClick={onOpenExplorer}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Ouvrir l'explorateur</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Contrairement à l'ancien module Magisk figé, vous pouvez choisir d'opérer directement
              dans <span className="text-white font-mono">/data/local/uka</span> (pour accès rapide sous root)
              ou dans un dossier dédié <span className="text-white font-mono">/sdcard/SUPEROM</span> sur votre stockage interne.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => handleSetWorkspace('/data/local/uka')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  workspace === '/data/local/uka'
                    ? 'bg-slate-800 border-cyan-500 text-white ring-1 ring-cyan-500/30'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    Mode Root Recommandé
                  </span>
                  {workspace === '/data/local/uka' && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                </div>
                <div className="font-bold text-xs font-mono text-slate-200">/data/local/uka</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Emplacement historique UKA. Très rapide, supporte les montages loop Linux sans restriction.
                </p>
              </div>

              <div
                onClick={() => handleSetWorkspace('/sdcard/SUPEROM')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  workspace === '/sdcard/SUPEROM'
                    ? 'bg-slate-800 border-cyan-500 text-white ring-1 ring-cyan-500/30'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">
                    Stockage Interne
                  </span>
                  {workspace === '/sdcard/SUPEROM' && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                </div>
                <div className="font-bold text-xs font-mono text-slate-200">/sdcard/SUPEROM</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Dossier SUPEROM dans la mémoire interne. Accessible depuis n'importe quel gestionnaire de fichiers Android (MT Manager, ZArchiver).
                </p>
              </div>
            </div>

            {/* Custom workspace input */}
            <form onSubmit={handleCustomWorkspaceSubmit} className="pt-2">
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Ou définir un chemin personnalisé :
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customWorkspaceInput}
                  onChange={(e) => setCustomWorkspaceInput(e.target.value)}
                  placeholder="ex: /storage/emulated/0/Download/Kitchen"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold rounded-xl border border-slate-700"
                >
                  Appliquer
                </button>
              </div>
            </form>
          </div>

          {/* Root vs Non-Root Mode Toggle */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              3. Mode d'exécution (Root vs Non-Root)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleToggleMode('non-root')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  mode === 'non-root'
                    ? 'bg-emerald-500/15 border-emerald-500 text-white ring-1 ring-emerald-500/30'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-emerald-300">Mode Non-Root (Userspace)</span>
                  {mode === 'non-root' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Fonctionne sur n'importe quel smartphone non rooté. Utilise les binaires portés en espace utilisateur (erofs-utils, 7z, make_ext4fs, apksigner Java).
                </p>
              </button>

              <button
                onClick={() => handleToggleMode('root')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  mode === 'root'
                    ? 'bg-rose-500/15 border-rose-500 text-white ring-1 ring-rose-500/30'
                    : 'bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-rose-300">Mode Root (Magisk / KernelSU / APatch)</span>
                  {mode === 'root' && <CheckCircle className="w-4 h-4 text-rose-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Accès complet au noyau Linux via 'su'. Permet le montage en direct de loop devices et la modification des partitions système à chaud.
                </p>
              </button>
            </div>
          </div>

          {/* GitHub Action Export Banner */}
          <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <h4 className="font-bold text-white text-sm">Compilation Prête pour GitHub Actions</h4>
              </div>
              <p className="text-xs text-slate-300 max-w-xl">
                Le dépôt inclut le fichier de workflow <span className="font-mono text-cyan-300">.github/workflows/android.yml</span>.
                Vous pouvez le pousser directement sur GitHub pour générer votre APK standalone !
              </p>
            </div>

            <button
              onClick={onOpenGitHubExport}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 shrink-0 active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Voir le Workflow & Instructions</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Commands Reference */}
      {activeSubTab === 'commands' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Référence des Commandes UKA Unpacker</h3>
          </div>
          <p className="text-xs text-slate-400">
            Ces commandes peuvent être saisies directement dans l'onglet <strong>Console</strong>.
          </p>

          <div className="space-y-3">
            {UKA_COMMAND_LIST.map((item) => (
              <div
                key={item.cmd}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5"
              >
                <div className="font-mono font-bold text-xs text-cyan-300">{item.cmd}</div>
                <div className="text-xs text-slate-300">{item.desc}</div>
                <div className="text-[11px] text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  Exemple : {item.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Help & Manual */}
      {activeSubTab === 'help' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Guide Complet d'Utilisation UKA</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm text-cyan-300">1. Déballer une ROM (Unpack)</h4>
              <p>
                Placez votre fichier ROM (fichier .zip, payload.bin ou super.img) dans le dossier{' '}
                <span className="font-mono text-white">{workspace}/input/</span>. Dans l'onglet Action &gt; Unpack,
                choisissez le type de fichier et cliquez sur "Lancer le Déballage".
              </p>
              <p className="text-slate-400">
                UKA extrait les partitions dans <span className="font-mono text-white">unpacked/</span> et analyse automatiquement
                le système de fichiers (EROFS ou EXT4), les permissions (fs_config) et les contextes SELinux (file_contexts).
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm text-emerald-300">2. Modifier les fichiers</h4>
              <p>
                Vous pouvez modifier, supprimer des applications système (debloat), ou en ajouter de nouvelles
                dans <span className="font-mono text-white">{workspace}/unpacked/system/</span>.
              </p>
              <p className="text-slate-400">
                Si vous ajoutez de nouveaux APK ou fichiers binaires, rendez-vous dans l'onglet <strong>MetaGen</strong> et
                cliquez sur "Synchroniser fs_config & SELinux" pour attribuer automatiquement les droits de sécurité requis.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm text-amber-300">3. Repacker à l'identique (Mirroring)</h4>
              <p>
                Rendez-vous dans l'onglet Action &gt; Repack. Le moteur intelligent UKA sait exactement quel format
                votre image d'origine utilisait (par exemple EROFS avec compression lz4hc et inodes 64-bit).
              </p>
              <p className="text-slate-400">
                Vous obtiendrez un fichier d'image prêt à être flashé dans <span className="font-mono text-white">{workspace}/output/</span>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm text-blue-300">4. Créer un portage GSI</h4>
              <p>
                Dans l'onglet PORTER, sélectionnez votre image GSI source et le vendor de votre appareil.
                L'outil applique les patchs magiskboot au boot.img pour contourner dm-verity et le chiffrement forcé,
                injecte les overlays Treble et produit une image bootable.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Offline Changelog */}
      {activeSubTab === 'changelog' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Historique Complet des Versions (Changelog Offline)</h3>
          </div>

          <div className="space-y-4">
            {UKA_CHANGELOG.map((item) => (
              <div
                key={item.version}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm text-cyan-300">{item.version}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{item.date}</span>
                </div>
                <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-300">
                  {item.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
