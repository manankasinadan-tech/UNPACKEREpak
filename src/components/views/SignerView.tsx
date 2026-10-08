import React, { useState } from 'react';
import {
  KeyRound,
  FileCheck,
  ShieldCheck,
  Plus,
  Layers,
  Sparkles,
  RefreshCw,
  FolderOpen,
  CheckCircle,
  Copy,
  Hash,
} from 'lucide-react';
import { ukaEngineInstance } from '../../services/ukaEngine';
import { SigningKey, WorkspaceFile, WorkspaceLocation } from '../../types/uka';

interface SignerViewProps {
  workspace: WorkspaceLocation;
  files: WorkspaceFile[];
  keys: SigningKey[];
  isProcessing: boolean;
  progress: number;
  statusText: string;
  onRefresh: () => void;
  onOpenExplorer: () => void;
}

export const SignerView: React.FC<SignerViewProps> = ({
  workspace,
  files,
  keys,
  isProcessing,
  progress,
  statusText,
  onRefresh,
  onOpenExplorer,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'keys'>('single');
  const [selectedKey, setSelectedKey] = useState<string>(keys[0]?.alias || 'testkey');
  const [selectedApk, setSelectedApk] = useState<string>('unpacked/system/priv-app/SystemUI.apk');
  const [batchFolder, setBatchFolder] = useState<string>('unpacked/system/priv-app');
  const [applyZipalign, setApplyZipalign] = useState<boolean>(true);
  const [schemes, setSchemes] = useState({ v1: true, v2: true, v3: true, v4: true });

  // Key generation form
  const [newKeyAlias, setNewKeyAlias] = useState<string>('my_release_key');
  const [newKeyName, setNewKeyName] = useState<string>('My Custom Release Key (RSA 4096)');
  const [newKeyType, setNewKeyType] = useState<'RSA' | 'EC'>('RSA');
  const [newKeySize, setNewKeySize] = useState<number>(4096);
  const [showKeySuccess, setShowKeySuccess] = useState<boolean>(false);

  const handleSignSingle = async () => {
    await ukaEngineInstance.signApk(selectedApk, selectedKey, applyZipalign, schemes);
    onRefresh();
  };

  const handleSignBatch = async () => {
    await ukaEngineInstance.batchSignFolder(batchFolder, selectedKey);
    onRefresh();
  };

  const handleCreateKey = () => {
    if (!newKeyAlias.trim()) return;
    ukaEngineInstance.createSigningKey(newKeyAlias.trim(), newKeyName.trim(), newKeyType, newKeySize);
    setShowKeySuccess(true);
    setTimeout(() => setShowKeySuccess(false), 3000);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Module SIGNER UKA</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  apksigner + zipalign v1-v4
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Générez des clés cryptographiques privées (RSA/EC), signez un APK individuel ou
                signez l'intégralité des applications système d'une partition extraite en un clic.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenExplorer}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors self-start sm:self-center"
          >
            <FolderOpen className="w-4 h-4 text-amber-400" />
            <span>Explorer {workspace}/keys</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs within Signer */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('single')}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'single'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Signer un APK Unique
        </button>
        <button
          onClick={() => setActiveTab('batch')}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'batch'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Signer tout un dossier (Batch)
        </button>
        <button
          onClick={() => setActiveTab('keys')}
          className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'keys'
              ? 'border-amber-400 text-amber-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Gérer les Clés & Keystores ({keys.length})
        </button>
      </div>

      {/* 1. Single APK Signer */}
      {activeTab === 'single' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                1. Fichier APK à signer
              </label>
              <input
                type="text"
                value={selectedApk}
                onChange={(e) => setSelectedApk(e.target.value)}
                placeholder="ex: input/MyApp.apk ou unpacked/system/priv-app/SystemUI.apk"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                2. Clé de signature
              </label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              >
                {keys.map((k) => (
                  <option key={k.alias} value={k.alias}>
                    {k.alias} — {k.name} ({k.type} {k.keySize} bits)
                  </option>
                ))}
              </select>
            </div>

            {/* Signature Schemes & Zipalign */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300">Schémas de Signature Android :</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={schemes.v1}
                    onChange={(e) => setSchemes({ ...schemes, v1: e.target.checked })}
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>v1 (JAR Signature)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={schemes.v2}
                    onChange={(e) => setSchemes({ ...schemes, v2: e.target.checked })}
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>v2 (Android 7.0+)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={schemes.v3}
                    onChange={(e) => setSchemes({ ...schemes, v3: e.target.checked })}
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>v3 (Android 9.0+)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={schemes.v4}
                    onChange={(e) => setSchemes({ ...schemes, v4: e.target.checked })}
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>v4 (Android 11+)</span>
                </label>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                  <input
                    type="checkbox"
                    checked={applyZipalign}
                    onChange={(e) => setApplyZipalign(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>Exécuter zipalign (alignement des ressources sur 4 octets)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSignSingle}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                isProcessing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-600/25 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Signature en cours...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Signer et Aligner l'APK</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 2. Batch Signer */}
      {activeTab === 'batch' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Signature par lot (Tous les APKs d'une partition)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Recherche récursivement tous les fichiers APK dans le répertoire sélectionné
            (par exemple toutes les applications de la partition system ou vendor) et leur applique
            la signature et le zipalign.
          </p>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Dossier cible dans l'espace de travail
              </label>
              <input
                type="text"
                value={batchFolder}
                onChange={(e) => setBatchFolder(e.target.value)}
                placeholder="ex: unpacked/system/priv-app ou unpacked/system/app"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Quick choices */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setBatchFolder('unpacked/system/priv-app')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono text-[11px]"
              >
                /system/priv-app
              </button>
              <button
                onClick={() => setBatchFolder('unpacked/system/app')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono text-[11px]"
              >
                /system/app
              </button>
              <button
                onClick={() => setBatchFolder('unpacked/vendor/app')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono text-[11px]"
              >
                /vendor/app
              </button>
              <button
                onClick={() => setBatchFolder('unpacked/product/priv-app')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono text-[11px]"
              >
                /product/priv-app
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSignBatch}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                isProcessing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-600/25 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Signature par lot en cours ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Lancer la signature par lot</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 3. Key Management & Creation */}
      {activeTab === 'keys' && (
        <div className="space-y-6">
          {/* Key list */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <h3 className="text-sm font-bold text-white">Clés et Keystores Disponibles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {keys.map((k) => (
                <div
                  key={k.alias}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/90 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-400 font-mono">{k.alias}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {k.type} {k.keySize}
                    </span>
                  </div>
                  <div className="text-xs text-slate-200 font-medium">{k.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    SHA-256 : {k.fingerprint}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create new key card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Générer une Nouvelle Paire de Clés</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Alias de la clé :</label>
                <input
                  type="text"
                  value={newKeyAlias}
                  onChange={(e) => setNewKeyAlias(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nom / Description :</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Algorithme :</label>
                <select
                  value={newKeyType}
                  onChange={(e) => setNewKeyType(e.target.value as 'RSA' | 'EC')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                >
                  <option value="RSA">RSA (Compatible tous Android)</option>
                  <option value="EC">Elliptic Curves (ECDSA P-256)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Taille de la clé :</label>
                <select
                  value={newKeySize}
                  onChange={(e) => setNewKeySize(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                >
                  <option value={2048}>2048 bits</option>
                  <option value={4096}>4096 bits (Recommandé)</option>
                </select>
              </div>
            </div>

            {showKeySuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Paire de clés et certificat x509 générés et enregistrés dans keys/ !</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleCreateKey}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-md active:scale-95"
              >
                <KeyRound className="w-4 h-4" />
                <span>Générer la Clé Cryptographique</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
