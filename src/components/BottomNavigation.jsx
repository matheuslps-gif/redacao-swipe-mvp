import React from 'react';

const navItems = [
  { path: 'hoje', icon: 'event_upcoming', label: 'Hoje' },
  { path: 'cards', icon: 'style', label: 'Cards' },
  { path: 'progresso', icon: 'insights', label: 'Progresso' },
  { path: 'perfil', icon: 'account_circle', label: 'Perfil' },
];

export default function BottomNavigation({ activePath = 'hoje', onNavigate }) {
  return (
    <nav
      className="fixed bottom-0 w-full z-50 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-4px_16px_rgba(0,40,48,0.04)]"
      data-active-classes="text-primary-container font-label-md"
    >
      <div className="max-w-[480px] mx-auto h-16 px-space-md flex items-center justify-around">
        {navItems.map(({ path, icon, label }) => {
          const isActive = activePath === path;
          return (
            <button
              key={path}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center w-14 h-12 transition-colors cursor-pointer ${
                isActive
                  ? 'text-primary-container font-label-md font-bold'
                  : 'text-on-surface-variant hover:text-on-surface font-label-md'
              }`}
              onClick={() => onNavigate?.(path)}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {icon}
              </span>
              <span className="font-label-md text-label-md mt-0.5">{label}</span>
              {isActive && (
                <div className="active-indicator w-1 h-1 rounded-full bg-primary-container mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
