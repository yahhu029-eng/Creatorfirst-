import { useRef } from "react";
import { ChevronLeft } from "lucide-react";
import type { Video } from "@/types";
import type { DemoState } from "@/hooks/useDemoState";
import { getShorts } from "@/data";
import { ShortCard } from "./ShortCard";

interface ShortsViewerProps {
  startIndex: number;
  demo: DemoState;
  onBack: () => void;
  onCreatorClick: (creatorId: string) => void;
  onOpenComments: (videoId: string) => void;
}

export function ShortsViewer({
  startIndex,
  demo,
  onBack,
  onCreatorClick,
  onOpenComments,
}: ShortsViewerProps) {
  const shorts = getShorts(demo.userVideos);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm active:scale-90"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Scrollable shorts */}
      <div
        ref={containerRef}
        className="h-full w-full snap-y snap-mandatory overflow-y-auto scroll-smooth"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {shorts.map((video: Video) => (
          <div key={video.id} className="h-full w-full snap-start" style={{ scrollSnapAlign: "start" }}>
            <ShortCard
              video={video}
              demo={demo}
              onCreatorClick={onCreatorClick}
              onOpenComments={onOpenComments}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
