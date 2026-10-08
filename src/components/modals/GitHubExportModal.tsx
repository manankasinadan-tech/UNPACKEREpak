import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Copy,
  Check,
  Terminal,
  Download,
  Github,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { GITHUB_WORKFLOW_TEMPLATE } from '../../data/ukaConstants';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedWorkflow, setCopiedWorkflow] = useState<boolean>(false);
  const [copiedCommands, setCopiedCommands] = useState<boolean>(false);

  if (!isOpen) return null;

  const gitCommands = `git init
git add .
git commit -m "Feat: UKA Kitchen Mobile APK Suite"
git branch -M main
git remote add origin https://github.com/VOTRE_PSEUDO/uka-android-kitchen.git
git push -u origin main`;

  const handleCopyWorkflow = () => {
    navigator.clipboard.writeText(GITHUB_WORKFLOW_TEMPLATE);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2000);
  };

  const handleCopyCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/60 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Prêt pour GitHub Actions (Compilation APK)</h3>
              <p className="text-xs text-slate-400">
                Poussez sur GitHub pour compiler et télécharger automatiquement votre .apk autonome
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-slate-300">
          {/* Quick Step by Step */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-cyan-400">
              Instructions pour lancer la compilation sur GitHub
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center text-xs">
                  1
                </div>
                <div className="font-semibold text-white">Créez un dépôt GitHub</div>
                <p className="text-slate-400 text-[11px]">
                  Rendez-vous sur github.com et créez un nouveau dépôt vide (public ou privé).
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-xs">
                  2
                </div>
                <div className="font-semibold text-white">Poussez le code (git push)</div>
                <p className="text-slate-400 text-[11px]">
                  Le fichier <span className="font-mono text-cyan-300">.github/workflows/android.yml</span> est déjà créé dans votre projet.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs">
                  3
                </div>
                <div className="font-semibold text-white">Récupérez l'APK</div>
                <p className="text-slate-400 text-[11px]">
                  Dans l'onglet "Actions" de votre dépôt GitHub, téléchargez l'artéfact <span className="font-mono text-emerald-300">.apk</span> généré !
                </p>
              </div>
            </div>
          </div>

          {/* Commands to run */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Commandes Git à exécuter :</span>
              <button
                onClick={handleCopyCommands}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-[11px]"
              >
                {copiedCommands ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCommands ? 'Copié !' : 'Copier les commandes'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed">
              {gitCommands}
            </pre>
          </div>

          {/* Workflow preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Fichier de CI/CD inclus (.github/workflows/android.yml) :</span>
              <button
                onClick={handleCopyWorkflow}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono text-[11px]"
              >
                {copiedWorkflow ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWorkflow ? 'Copié !' : 'Copier le YAML'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48 scrollbar-thin">
              {GITHUB_WORKFLOW_TEMPLATE}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
          >
            Compris, je vais pusher sur GitHub
          </button>
        </div>
      </div>
    </div>
  );
};
