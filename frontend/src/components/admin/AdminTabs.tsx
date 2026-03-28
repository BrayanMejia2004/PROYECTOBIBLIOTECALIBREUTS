import { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: ReactNode;
}

interface AdminTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function AdminTabs({ tabs, activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative flex items-center gap-2 px-5 py-3 rounded-xl font-medium 
              transition-all duration-200 whitespace-nowrap
              ${isActive
                ? 'bg-[#c3d62f] text-[#132F20] shadow-sm'
                : 'bg-white/50 dark:bg-[#1a2e24]/50 text-[#132F20] dark:text-gray-300 border border-[#c3d62f]/20 hover:bg-[#c3d62f]/10'
              }
            `}
          >
            <span className="w-5 h-5">{tab.icon}</span>
            <span>{tab.label}</span>
            {isActive && (
              <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#132F20] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
