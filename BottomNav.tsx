import { Home, Compass, PlusCircle, User } from "lucide-react";
import type { TabKey } from "@/types";

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "discover", label: "Discover", icon: Compass },
  { key: "upload", label: "Upload", icon: PlusCircle },
  { key: "profile", label: "Profile", icon: User },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0d0d12]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {tabs.map(({ key, label, icon: Icon }) => {
          const active = activeTab === key;
          const isUpload = key === "upload";
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className="group flex flex-1 flex-col items-center gap-1 py-1 transition-transform active:scale-90"
              aria-label={label}
            >
              {isUpload ? (
                <div
                  className={`flex h-9 w-12 items-center justify-center rounded-xl transition-all ${
                    active
                      ? "bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-500/30"
                      : "bg-white/10 group-hover:bg-white/20"
                  }`}
                >
                  <Icon size={22} className="text-white" />
                </div>
              ) : (
                <Icon
                  size={24}
                  className={`transition-colors ${
                    active ? "text-rose-400" : "text-gray-500 group-hover:text-gray-300"
                  }`}
                  fill={active ? "currentColor" : "none"}
                  strokeWidth={active ? 2.2 : 1.8}
                />
              )}
              <span
                className={`text-[10px] font-medium tracking-wide transition-colors ${
                  active ? "text-rose-400" : "text-gray-500 group-hover:text-gray-300"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
