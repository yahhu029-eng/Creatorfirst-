import { Search, Bell, Settings } from "lucide-react";

interface AppHeaderProps {
  title?: string;
  showSearch?: boolean;
  onSearchClick?: () => void;
  onSettingsClick?: () => void;
}

export function AppHeader({
  title,
  showSearch = true,
  onSearchClick,
  onSettingsClick,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-500">
            <span className="text-sm font-black text-white">C</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            {title ?? "CreatorFirst"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {showSearch && (
            <button
              onClick={onSearchClick}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white active:scale-90"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          )}
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white active:scale-90"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
