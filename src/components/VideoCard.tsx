import { Heart, MessageCircle, Share2, MoreVertical, Play } from "lucide-react";
import { useEffect, useState } from "react";
import type { Video } from "@/types";
import type { DemoState } from "@/hooks/useDemoState";
import { getCreatorById } from "@/data";
import { formatCount } from "@/lib/format";
import { CreatorBadge } from "./CreatorBadge";

interface VideoCardProps {
  video: Video;
  demo: DemoState;
  onCreatorClick: (creatorId: string) => void;
  onVideoClick: (videoId: string) => void;
  onOpenComments: (videoId: string) => void;
}

export function VideoCard({ video, demo, onCreatorClick, onVideoClick, onOpenComments }: VideoCardProps) {
  const [actualDuration, setActualDuration] = useState<string | null>(null);
  const creator = getCreatorById(video.creatorId);
  const liked = demo.isLiked(video.id);
  const likeCount = video.likes + (liked ? 1 : 0);
  const allComments = [...video.comments, ...(demo.extraComments[video.id] ?? [])];

  if (!creator) return null;

  return (
    <article className="overflow-hidden rounded-2xl bg-[#16161e] shadow-lg shadow-black/30 transition-all hover:shadow-xl hover:shadow-black/40">
      {/* Thumbnail */}
      <button onClick={() => onVideoClick(video.id)} className="group relative block w-full overflow-hidden">
        <div className="aspect-video w-full overflow-hidden">
          {video.videoUrl ? (
            <video
              src={video.videoUrl}
              onLoadedMetadata={(event) => {
  const seconds = event.currentTarget.duration;
  if (Number.isFinite(seconds)) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    setActualDuration(`${mins}:${secs}`);
  }
}}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              muted
              preload="metadata"
            />
          ) : (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
          {actualDuration ?? video.duration}
        </div>
        {!video.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <Play size={22} className="ml-0.5 text-white" fill="white" />
            </div>
          </div>
        )}
        {video.isUserUploaded && (
          <div className="absolute left-2 top-2 rounded-md bg-amber-500/90 px-1.5 py-0.5 text-[10px] font-bold text-black">
            YOUR UPLOAD
          </div>
        )}
      </button>

      {/* Meta */}
      <div className="p-3">
        <div className="flex gap-3">
          <CreatorBadge creator={creator} size="sm" onClick={() => onCreatorClick(creator.id)} />
          <div className="flex-1">
            <button onClick={() => onVideoClick(video.id)} className="text-left">
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
                {video.title}
              </h3>
            </button>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
              <span>{formatCount(video.views)} views</span>
              <span>·</span>
              <span>{video.uploadDate}</span>
              {video.category && (
                <>
                  <span>·</span>
                  <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-gray-400">
                    {video.category}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
          <button
            onClick={() => demo.toggleLike(video.id)}
            className="flex items-center gap-1.5 transition-transform active:scale-90"
          >
            <Heart
              size={18}
              className={liked ? "text-rose-500" : "text-gray-400"}
              fill={liked ? "currentColor" : "none"}
            />
            <span className={`text-xs font-medium ${liked ? "text-rose-500" : "text-gray-400"}`}>
              {formatCount(likeCount)}
            </span>
          </button>
          <button
            onClick={() => onOpenComments(video.id)}
            className="flex items-center gap-1.5 text-gray-400 transition-transform active:scale-90"
          >
            <MessageCircle size={18} />
            <span className="text-xs font-medium">{formatCount(allComments.length)}</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-400 transition-transform active:scale-90">
            <Share2 size={18} />
            <span className="text-xs font-medium">Share</span>
          </button>
          <button className="text-gray-400 transition-transform active:scale-90">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
