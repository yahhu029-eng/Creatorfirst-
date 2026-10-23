import { X, Heart, MessageCircle, Share2, Play } from "lucide-react";
import type { Video } from "@/types";
import type { DemoState } from "@/hooks/useDemoState";
import { getCreatorById } from "@/data";
import { formatCount } from "@/lib/format";
import { CreatorBadge } from "./CreatorBadge";
import { FollowButton } from "./FollowButton";

interface VideoPlayerProps {
  video: Video;
  demo: DemoState;
  onClose: () => void;
  onCreatorClick: (creatorId: string) => void;
  onOpenComments: (videoId: string) => void;
}

export function VideoPlayer({
  video,
  demo,
  onClose,
  onCreatorClick,
  onOpenComments,
}: VideoPlayerProps) {
  const creator = getCreatorById(video.creatorId);
  const liked = demo.isLiked(video.id);
  const likeCount = video.likes + (liked ? 1 : 0);
  const allComments = [...video.comments, ...(demo.extraComments[video.id] ?? [])];

  if (!creator) return null;

  return (
    <div className="fixed inset-0 z-[55] flex flex-col bg-black">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm active:scale-90"
      >
        <X size={22} />
      </button>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Player area */}
        <div className="relative aspect-video w-full bg-black">
          {video.videoUrl ? (
            <video
              src={video.videoUrl}
              className="h-full w-full object-cover"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <Play size={30} className="ml-1 text-white" fill="white" />
                  </div>
                  <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    Sample video — playback not available
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Meta */}
        <div className="mx-auto max-w-md space-y-4 p-4">
          {/* Creator row */}
          <div className="flex items-center justify-between">
            <CreatorBadge creator={creator} size="md" showHandle onClick={() => onCreatorClick(creator.id)} />
            {!video.isUserUploaded && <FollowButton creator={creator} demo={demo} />}
          </div>

          {/* Title */}
          <h2 className="text-base font-bold leading-snug text-white">{video.title}</h2>

          {/* Stats + category */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <span>{formatCount(video.views)} views</span>
            <span>·</span>
            <span>{video.uploadDate}</span>
            {video.category && (
              <>
                <span>·</span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-gray-300">
                  {video.category}
                </span>
              </>
            )}
            {video.isUserUploaded && (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-400">
                Your upload
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 border-y border-white/5 py-3">
            <button
              onClick={() => demo.toggleLike(video.id)}
              className="flex items-center gap-2 active:scale-90"
            >
              <Heart
                size={22}
                className={liked ? "text-rose-500" : "text-gray-400"}
                fill={liked ? "currentColor" : "none"}
              />
              <span className={`text-sm font-semibold ${liked ? "text-rose-500" : "text-gray-400"}`}>
                {formatCount(likeCount)}
              </span>
            </button>
            <button
              onClick={() => onOpenComments(video.id)}
              className="flex items-center gap-2 text-gray-400 active:scale-90"
            >
              <MessageCircle size={22} />
              <span className="text-sm font-semibold">{formatCount(allComments.length)}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-400 active:scale-90">
              <Share2 size={22} />
              <span className="text-sm font-semibold">Share</span>
            </button>
          </div>

          {/* Description */}
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-sm leading-relaxed text-gray-300">{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
