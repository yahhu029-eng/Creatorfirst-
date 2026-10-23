import { Heart, MessageCircle, Share2, Music2, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import type { Video } from "@/types";
import type { DemoState } from "@/hooks/useDemoState";
import { getCreatorById } from "@/data";
import { formatCount } from "@/lib/format";

interface ShortCardProps {
  video: Video;
  demo: DemoState;
  onCreatorClick: (creatorId: string) => void;
  onOpenComments: (videoId: string) => void;
}

export function ShortCard({ video, demo, onCreatorClick, onOpenComments }: ShortCardProps) {
  const creator = getCreatorById(video.creatorId);
  const liked = demo.isLiked(video.id);
  const likeCount = video.likes + (liked ? 1 : 0);
  const allComments = [...video.comments, ...(demo.extraComments[video.id] ?? [])];
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  if (!creator) return null;

  return (
    <div className="relative h-full w-full snap-center overflow-hidden bg-black">
      {/* Video / Thumbnail */}
      <div className="relative h-full w-full">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
      </div>

      {/* Top controls */}
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
        <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          Shorts
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted((m) => !m)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm active:scale-90"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm active:scale-90"
          >
            {playing ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
          </button>
        </div>
      </div>

      {/* Right action rail */}
      <div className="absolute bottom-24 right-3 flex flex-col items-center gap-5">
        <button
          onClick={() => demo.toggleLike(video.id)}
          className="flex flex-col items-center gap-1 active:scale-90"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <Heart
              size={26}
              className={liked ? "text-rose-500" : "text-white"}
              fill={liked ? "currentColor" : "none"}
            />
          </div>
          <span className={`text-xs font-semibold ${liked ? "text-rose-500" : "text-white"}`}>
            {formatCount(likeCount)}
          </span>
        </button>
        <button
          onClick={() => onOpenComments(video.id)}
          className="flex flex-col items-center gap-1 active:scale-90"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <MessageCircle size={26} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-white">
            {formatCount(allComments.length)}
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 active:scale-90">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <Share2 size={24} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-white">Share</span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-20 left-0 right-16 p-4">
        <button
          onClick={() => onCreatorClick(creator.id)}
          className="mb-2 flex items-center gap-2 active:scale-95"
        >
          <img
            src={creator.avatar}
            alt={creator.name}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-white/30"
          />
          <span className="text-sm font-bold text-white">@{creator.handle.slice(1)}</span>
        </button>
        <p className="text-sm font-medium leading-snug text-white">{video.title}</p>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-white/80">
          <Music2 size={12} />
          <span className="truncate">Original audio — {creator.name}</span>
        </div>
      </div>
    </div>
  );
}
