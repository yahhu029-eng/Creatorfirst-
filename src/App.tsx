import { useEffect } from "react";
import AuthPage from "@/pages/AuthPage";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import type { TabKey, ViewKey, Video } from "@/types";
import { useDemoState } from "@/hooks/useDemoState";
import { getCreatorById, getVideoById, currentUser } from "@/data";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { HomePage } from "@/pages/HomePage";
import { DiscoverPage } from "@/pages/DiscoverPage";
import { UploadPage } from "@/pages/UploadPage";
import { CreatorProfilePage } from "@/pages/CreatorProfilePage";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ShortsViewer } from "@/components/ShortsViewer";
import { CommentSheet } from "@/components/CommentSheet";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
const [checkingAuth, setCheckingAuth] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);



useEffect(() => {
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true);
        setAuthenticated(false);
      } else {
        setAuthenticated(!!session);
      }

      setCheckingAuth(false);
    }
  );

  supabase.auth.getSession()
    .then(({ data }) => {
      setAuthenticated(!!data.session);
    })
    .catch(() => {
      setAuthenticated(false);
    })
    .finally(() => {
      setCheckingAuth(false);
    });

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);

  const demo = useDemoState();
  const [cloudVideos, setCloudVideos] =
    useEffect(() => {
  async function loadCloudVideos() {
    const { data, error } = await supabase
      .from("Videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Cloud videos error:", error.message);
      return;
    }

    if (data) {
      const mapped: Video[] = data.map((row) => ({
        id: String(row.id),
        title: row.title ?? "Untitled Video",
        thumbnail: "",
        creatorId: "me",
        views: 0,
        likes: 0,
        uploadDate: "Recently",
        duration: "0:00",
        description: "",
        isShort: true,
        comments: [],
        videoUrl: row.video_url,
        isUserUploaded: true,
      }));

      setCloudVideos(mapped);
    }
  }

  loadCloudVideos();
}, []);
  useState<Video[]>([]);
const [view, setView] = useState<ViewKey>({ tab: "home" });
const [commentVideoId, setCommentVideoId] = useState<string | null>(null);

if (checkingAuth) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
      Loading CreatorFirst...
    </div>
  );
}

if (!authenticated || isPasswordRecovery) {
  return (
    <AuthPage
      onLogin={() => {
        setAuthenticated(true);
        setIsPasswordRecovery(false);
      }}
      isRecovery={isPasswordRecovery}
    />
  );
}

  const navigateTab = (tab: TabKey) => setView({ tab });

  const openCreator = (creatorId: string) => setView({ tab: "creator", creatorId });
  const openVideo = (videoId: string) => setView({ tab: "video", videoId });
  const openShorts = (startIndex: number) => setView({ tab: "shorts", startIndex });
  const goBack = () => setView({ tab: "home" });

  const commentVideo = commentVideoId ? getVideoById(commentVideoId, demo.userVideos) : null;

  // Fullscreen Shorts
  if (view.tab === "shorts") {
    return (
      <>
        <ShortsViewer
          startIndex={view.startIndex}
          demo={demo}
          onBack={goBack}
          onCreatorClick={openCreator}
          onOpenComments={setCommentVideoId}
        />
        {commentVideo && (
          <CommentSheet video={commentVideo} demo={demo} onClose={() => setCommentVideoId(null)} />
        )}
      </>
    );
  }

  // Fullscreen video player
  if (view.tab === "video") {
    const video = getVideoById(
  view.videoId,
  [...demo.userVideos, ...cloudVideos]
);
    if (video) {
      return (
        <>
          <VideoPlayer
            video={video}
            demo={demo}
            onClose={goBack}
            onCreatorClick={openCreator}
            onOpenComments={setCommentVideoId}
          />
          {commentVideo && (
            <CommentSheet video={commentVideo} demo={demo} onClose={() => setCommentVideoId(null)} />
          )}
        </>
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Sub-header for creator profile (back button) */}
      {view.tab === "creator" && (
        <div className="fixed left-0 right-0 top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
            <button
              onClick={goBack}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-300 hover:bg-white/10 active:scale-90"
            >
              <ChevronLeft size={22} />
            </button>
            <span className="text-sm font-semibold text-white">Profile</span>
          </div>
        </div>
      )}

      <div className={view.tab === "creator" ? "pt-14" : ""}>
        {view.tab !== "creator" && view.tab !== "upload" && <AppHeader />}
        {view.tab === "upload" && <AppHeader title="Upload" showSearch={false} />}

        <div className="mx-auto max-w-md">
          {view.tab === "home" && (
            <HomePage
              demo={demo}
              onCreatorClick={openCreator}
              onVideoClick={openVideo}
              onOpenComments={setCommentVideoId}
              onOpenShorts={openShorts}
              onDiscoverMore={() => navigateTab("discover")}
            />
          )}

          {view.tab === "discover" && (
            <DiscoverPage demo={demo} onCreatorClick={openCreator} />
          )}

          {view.tab === "upload" && (
            <UploadPage
              demo={demo}
              onUploaded={() => navigateTab("home")}
            />
          )}

          {view.tab === "profile" && (
            <CreatorProfilePage
              creator={currentUser}
              demo={demo}
              onVideoClick={openVideo}
              onOpenShorts={openShorts}
              isCurrentUser
            />
          )}

          {view.tab === "creator" && (() => {
            const creator = getCreatorById(view.creatorId);
            if (!creator) return <p className="p-4 text-gray-500">Creator not found</p>;
            return (
              <CreatorProfilePage
                creator={creator}
                demo={demo}
                onVideoClick={openVideo}
                onOpenShorts={openShorts}
              />
            );
          })()}
        </div>
      </div>

      <BottomNav
  activeTab={
    view.tab === "discover" ||
    view.tab === "upload" ||
    view.tab === "profile"
      ? view.tab
      : "home"
  }
  onTabChange={navigateTab}
/>

      {commentVideo && (
        <CommentSheet video={commentVideo} demo={demo} onClose={() => setCommentVideoId(null)} />
      )}
    </div>
  );
}

export default App;
