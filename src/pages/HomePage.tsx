import { Flame, ChevronRight, Sparkles, TrendingUp, Heart } from "lucide-react";
import type { DemoState } from "@/hooks/useDemoState";
import { getRegularVideos, getShorts, getSmallCreators, getCreatorById } from "@/data";
import { VideoCard } from "@/components/VideoCard";
import { FollowButton } from "@/components/FollowButton";
import { formatCount } from "@/lib/format";

interface HomePageProps {
  demo: DemoState;
  onCreatorClick: (creatorId: string) => void;
  onVideoClick: (videoId: string) => void;
  onOpenComments: (videoId: string) => void;
  onOpenShorts: (startIndex: number) => void;
  onDiscoverMore: () => void;
}

export function HomePage({
  demo,
  onCreatorClick,
  onVideoClick,
  onOpenComments,
  onOpenShorts,
  onDiscoverMore,
}: HomePageProps) {
  const regularVideos = getRegularVideos(demo.userVideos);
  const shorts = getShorts(demo.userVideos);
  const smallCreators = getSmallCreators();

  return (
    <div className="space-y-6 pb-24">
      {/* Trending banner */}
      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-600/30 via-orange-500/20 to-transparent p-4 ring-1 ring-white/10">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-orange-400" />
            <span className="text-sm font-bold text-white">Trending Now</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            The hottest clips from creators across CreatorFirst
          </p>
        </div>
      </section>

      {/* Your uploads section (only if user has uploaded) */}
      {demo.userVideos.length > 0 && (
        <section>
          <div className="flex items-center gap-2 px-4">
            <Sparkles size={18} className="text-amber-400" />
            <h2 className="text-base font-bold text-white">Your Uploads</h2>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
              {demo.userVideos.length} local
            </span>
          </div>
          <p className="mt-1 px-4 text-xs text-gray-500">
            Saved on this device — not publicly shared
          </p>
          <div className="mt-3 space-y-4 px-4">
            {demo.userVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                demo={demo}
                onCreatorClick={onCreatorClick}
                onVideoClick={onVideoClick}
                onOpenComments={onOpenComments}
              />
            ))}
          </div>
        </section>
      )}

      {/* Shorts row */}
      <section>
        <div className="flex items-center justify-between px-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-white">
            <span className="text-rose-400">Shorts</span>
          </h2>
          <button
            onClick={() => onOpenShorts(0)}
            className="flex items-center text-xs font-medium text-rose-400 active:scale-95"
          >
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden">
          {shorts.map((short) => {
            const creator = getCreatorById(short.creatorId);
            if (!creator) return null;
            const liked = demo.isLiked(short.id);
            return (
              <button
                key={short.id}
                onClick={() => onOpenShorts(0)}
                className="group relative w-[140px] shrink-0 overflow-hidden rounded-2xl bg-[#16161e] active:scale-95"
              >
                <div className="aspect-[9/16] w-full overflow-hidden">
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="line-clamp-2 text-xs font-semibold leading-tight text-white">
                    {short.title}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <Heart
                      size={11}
                      className={liked ? "text-rose-500" : "text-white/70"}
                      fill={liked ? "currentColor" : "none"}
                    />
                    <span className="text-[10px] text-white/70">
                      {formatCount(short.likes + (liked ? 1 : 0))}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main feed */}
      <section>
        <div className="flex items-center gap-2 px-4">
          <TrendingUp size={18} className="text-rose-400" />
          <h2 className="text-base font-bold text-white">Recommended</h2>
        </div>
        <div className="mt-3 space-y-4 px-4">
          {regularVideos
            .filter((v) => !v.isUserUploaded)
            .map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                demo={demo}
                onCreatorClick={onCreatorClick}
                onVideoClick={onVideoClick}
                onOpenComments={onOpenComments}
              />
            ))}
        </div>
      </section>

      {/* Discover small creators */}
      <section>
        <div className="flex items-center justify-between px-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-white">
            <Sparkles size={18} className="text-amber-400" />
            Discover New Creators
          </h2>
          <button
            onClick={onDiscoverMore}
            className="flex items-center text-xs font-medium text-rose-400 active:scale-95"
          >
            More <ChevronRight size={14} />
          </button>
        </div>
        <p className="mt-1 px-4 text-xs text-gray-500">
          Rising stars worth following before they blow up
        </p>
        <div className="mt-3 flex gap-3 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden">
          {smallCreators.map((creator) => (
            <div
              key={creator.id}
              className="w-[160px] shrink-0 rounded-2xl border border-white/5 bg-[#16161e] p-3"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-amber-400/30"
                />
                <h3 className="mt-2 truncate text-sm font-semibold text-white">{creator.name}</h3>
                <p className="text-xs text-gray-500">{formatCount(creator.followers)} followers</p>
                <div className="mt-3 w-full">
                  <FollowButton creator={creator} demo={demo} />
                </div>
                <button
                  onClick={() => onCreatorClick(creator.id)}
                  className="mt-2 text-xs text-gray-400 underline-offset-2 hover:underline"
                >
                  View profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
