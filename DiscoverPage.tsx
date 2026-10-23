import { Sparkles, TrendingUp, Flame, Music, Dumbbell, Gamepad2, Plane, Palette, Code, Heart } from "lucide-react";
import { useState } from "react";
import type { DemoState } from "@/hooks/useDemoState";
import { creators, getSmallCreators, getVideosByCreator } from "@/data";
import { FollowButton } from "@/components/FollowButton";
import { formatCount } from "@/lib/format";
import type { Creator } from "@/types";

interface DiscoverPageProps {
  demo: DemoState;
  onCreatorClick: (creatorId: string) => void;
}

const categoryIcons: Record<string, typeof Music> = {
  Gaming: Gamepad2,
  Food: Flame,
  Travel: Plane,
  Music: Music,
  Fitness: Dumbbell,
  Art: Palette,
  Tech: Code,
  Beauty: Sparkles,
  Dance: Music,
};

export function DiscoverPage({ demo, onCreatorClick }: DiscoverPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const smallCreators = getSmallCreators();
  const allCreators = creators;

  const categories = ["All", "Gaming", "Food", "Travel", "Music", "Fitness", "Art", "Tech", "Beauty", "Dance"];

  const filteredCreators =
    activeCategory === "All"
      ? allCreators
      : allCreators.filter((c) => c.category === activeCategory);

  return (
    <div className="space-y-6 pb-24">
      {/* Hero */}
      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-rose-500/10 to-transparent p-5 ring-1 ring-white/10">
          <div className="flex items-center gap-2">
            <Sparkles size={22} className="text-amber-400" />
            <h2 className="text-lg font-bold text-white">Discover Creators</h2>
          </div>
          <p className="mt-1 text-sm text-gray-400">
            Find rising creators and explore new voices across every category.
          </p>
        </div>
      </section>

      {/* Category chips */}
      <section>
        <div className="flex gap-2 overflow-x-auto px-4 pb-1 [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => {
            const Icon = cat !== "All" ? categoryIcons[cat] : TrendingUp;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-all active:scale-95 ${
                  active
                    ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/20"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                <Icon size={15} />
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured small creators */}
      {activeCategory === "All" && (
        <section>
          <div className="flex items-center gap-2 px-4">
            <TrendingUp size={18} className="text-amber-400" />
            <h3 className="text-base font-bold text-white">Rising Stars</h3>
          </div>
          <p className="mt-1 px-4 text-xs text-gray-500">
            Small creators with under 5K followers — be early
          </p>
          <div className="mt-3 space-y-3 px-4">
            {smallCreators.map((creator: Creator) => {
              const creatorVideos = getVideosByCreator(creator.id, demo.userVideos);
              const totalViews = creatorVideos.reduce((sum, v) => sum + v.views, 0);
              return (
                <div
                  key={creator.id}
                  className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#16161e] p-3"
                >
                  <button onClick={() => onCreatorClick(creator.id)} className="active:scale-95">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-amber-400/30"
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <button onClick={() => onCreatorClick(creator.id)} className="text-left">
                      <h4 className="truncate text-sm font-bold text-white">{creator.name}</h4>
                      <p className="truncate text-xs text-gray-500">{creator.handle}</p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-600">
                        <span className="flex items-center gap-0.5">
                          <Heart size={10} className="text-rose-500" fill="currentColor" />
                          {formatCount(creator.totalLikes)}
                        </span>
                        <span>·</span>
                        <span>{formatCount(totalViews)} views</span>
                        <span>·</span>
                        <span>{creator.category}</span>
                      </div>
                    </button>
                  </div>
                  <FollowButton creator={creator} demo={demo} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* All creators grid */}
      <section>
        <h3 className="px-4 text-base font-bold text-white">
          {activeCategory === "All" ? "All Creators" : `${activeCategory} Creators`}
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3 px-4">
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="overflow-hidden rounded-2xl border border-white/5 bg-[#16161e]"
            >
              <button
                onClick={() => onCreatorClick(creator.id)}
                className="block w-full active:scale-95"
              >
                <img
                  src={creator.banner ?? creator.avatar}
                  alt={creator.name}
                  className="h-20 w-full object-cover"
                  loading="lazy"
                />
              </button>
              <div className="p-3">
                <div className="-mt-8 mb-2 flex justify-start">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-[#16161e]"
                  />
                </div>
                <button onClick={() => onCreatorClick(creator.id)} className="text-left">
                  <h4 className="truncate text-sm font-bold text-white">{creator.name}</h4>
                  <p className="text-xs text-gray-500">{formatCount(creator.followers)} followers</p>
                </button>
                <div className="mt-2">
                  <FollowButton creator={creator} demo={demo} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
