import React from 'react';
import {
  Wrench,
  Smartphone,
  Terminal,
  Settings,
} from 'lucide-react';
import { MainNavTab, SidebarTab } from '../../types/uka';

interface BottomNavProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  activeSidebarTab: SidebarTab;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  activeSidebarTab,
}) => {
  const getActionLabel = () => {
    switch (activeSidebarTab) {
      case 'unpack':
        return 'Action (Unpack)';
      case 'repack':
        return 'Action (Repack)';
      case 'signer':
        return 'Action (Signer)';
      case 'metagen':
        return 'Action (MetaGen)';
      default:
        return 'Action';
    }
  };

  const navItems = [
    {
      id: 'action' as MainNavTab,
      label: getActionLabel(),
      shortLabel: 'Action',
      icon: Wrench,
      description: 'Rubrique sélectionnée dans la barre latérale',
    },
    {
      id: 'porter' as MainNavTab,
      label: 'PORTER GSI',
      shortLabel: 'PORTER',
      icon: Smartphone,
      description: 'Studio de portage Treble GSI',
    },
    {
      id: 'console' as MainNavTab,
      label: 'Console',
      shortLabel: 'Console',
      icon: Terminal,
      description: 'Terminal & Commandes UKA',
    },
    {
      id: 'settings' as MainNavTab,
      label: 'Paramètres',
      shortLabel: 'Paramètres',
      icon: Settings,
      description: 'Thèmes, Espace, Aide & Changelog',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-300">
      <div className="max-w-4xl mx-auto px-2">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
                  isActive
                    ? 'text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200 font-medium'
                }`}
              >
                {/* Active indicator top bar */}
                {isActive && (
                  <span className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full" />
                )}

                <div
                  className={`p-1.5 rounded-lg transition-transform ${
                    isActive ? 'scale-110 bg-cyan-500/10' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <span className="text-[11px] truncate max-w-[75px] sm:max-w-none">
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
