import { useState } from "react";
import { UserPlus, Check, Sparkles } from "lucide-react";
import type { Creator } from "@/types";
import type { DemoState } from "@/hooks/useDemoState";
import { formatCount } from "@/lib/format";

interface FollowButtonProps {
  creator: Creator;
  demo: DemoState;
}

export function FollowButton({ creator, demo }: FollowButtonProps) {
  const following = demo.isFollowing(creator.id);
  const [pulse, setPulse] = useState(false);

  const handleClick = () => {
    demo.toggleFollow(creator.id);
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
  };

  if (following) {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-300 transition-all active:scale-95 ${
          pulse ? "scale-105" : ""
        }`}
      >
        <Check size={16} />
        Following
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition-all active:scale-95 ${
        pulse ? "scale-105" : ""
      }`}
    >
      {creator.isSmallCreator ? <Sparkles size={16} /> : <UserPlus size={16} />}
      Follow
    </button>
  );
}
