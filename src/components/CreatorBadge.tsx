import { BadgeCheck } from "lucide-react";
import type { Creator } from "@/types";
import { formatCount } from "@/lib/format";

interface CreatorBadgeProps {
  creator: Creator;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  showHandle?: boolean;
}

export function CreatorBadge({ creator, onClick, size = "md", showHandle = false }: CreatorBadgeProps) {
  const avatarSize = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const nameSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  return (
    <button onClick={onClick} className="group flex items-center gap-2.5 text-left active:scale-95">
      <img
        src={creator.avatar}
        alt={creator.name}
        className={`${avatarSize} rounded-full object-cover ring-2 ring-white/10 transition-all group-hover:ring-rose-500/50`}
      />
      <div className="min-w-0">
        <div className={`flex items-center gap-1 font-semibold text-white ${nameSize}`}>
          <span className="truncate">{creator.name}</span>
          {creator.isVerified && (
            <BadgeCheck size={size === "sm" ? 12 : 14} className="shrink-0 text-sky-400" />
          )}
        </div>
        {showHandle && (
          <p className="text-xs text-gray-500">
            {formatCount(creator.followers)} followers
          </p>
        )}
      </div>
    </button>
  );
}
