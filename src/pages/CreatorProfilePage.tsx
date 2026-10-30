import { useEffect, useState } from "react";
import { BadgeCheck, Heart, Video as VideoIcon, Share2, Pencil, Grid3x3 } from "lucide-react";
import type { Creator, Video } from "@/types";
import type { DemoState } from "@/hooks/useDemoState";
import { getVideosByCreator, getVideoById } from "@/data";
import { supabase } from "@/lib/supabase";
import { FollowButton } from "@/components/FollowButton";
import { formatCount } from "@/lib/format";

interface CreatorProfilePageProps {
  creator: Creator;
  demo: DemoState;
  onVideoClick: (videoId: string) => void;
  onOpenShorts: (startIndex: number) => void;
  isCurrentUser?: boolean;
}

export function CreatorProfilePage({
  creator,
  demo,
  onVideoClick,
  onOpenShorts,
  isCurrentUser = false,
}: CreatorProfilePageProps) {
  const [tab, setTab] = useState<"videos" | "shorts" | "liked">("videos");
  const [showEditProfile, setShowEditProfile] = useState(false);
const [profileName, setProfileName] = useState(creator.name);
const [profileBio, setProfileBio] = useState(creator.bio);
  const [profileAvatar, setProfileAvatar] = useState(creator.avatar);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  useEffect(() => {
  async function loadProfile() {
    if (!isCurrentUser) return;

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("display_name, bio, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Profile loading error:", error.message);
      return;
    }

    setProfileName(
      data?.display_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      creator.name
    );

    if (data?.bio != null) {
      setProfileBio(data.bio);
    }
    if (data?.avatar_url) {
  setProfileAvatar(data.avatar_url);
    }
}
    

  loadProfile();
}, [isCurrentUser, creator.name]);

  
  const [cloudVideos, setCloudVideos] = useState<Video[]>([]);
  const [debugMessage, setDebugMessage] = useState("वीडियो लोड हो रही हैं...");
  const getVideoDuration = (url: string): Promise<string> =>
  new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      const seconds = Math.floor(video.duration);

      if (!Number.isFinite(seconds)) {
        resolve("0:00");
      } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        resolve(
          `${minutes}:${String(remainingSeconds).padStart(2, "0")}`
        );
      }

      video.remove();
    };

    video.onerror = () => resolve("0:00");
    video.src = url;
  });

  useEffect(() => {
    async function loadCloudVideos() {
      if (!isCurrentUser) return;

      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;
      console.log("Profile user:", authData.user?.id);
      setDebugMessage("Login user ID: " + (authData.user?.id || "नहीं मिला"));

      if (!user) return;

      const { data, error } = await supabase
  .from("Videos")
  .select("*");

      if (error) {
        console.error("Profile videos loading error:", error.message);
        return;
      }

      if (data) {
console.log("Profile videos found:", data.length);
setDebugMessage("Supabase videos found: " + data.length);

const videosWithDuration = await Promise.all(
data.map(async (row) => ({
id: String(row.id),
title: row.title || "Untitled Video",
thumbnail: "",
creatorId: creator.id,
views: 0,
likes: 0,
uploadDate: "Recently",
duration: await getVideoDuration(row.video_url),
description: "",
isShort: false,
comments: [],
videoUrl: row.video_url,
isUserUploaded: true,
}))
);

setCloudVideos(videosWithDuration);
      }
    }

    loadCloudVideos();
  }, [isCurrentUser, creator.id]);
  

  // For current user, use userVideos from demo state
  
const allVideos = [
  ...getVideosByCreator(creator.id, demo.userVideos),
  ...(isCurrentUser ? cloudVideos : []),
];
  

  const regularVideos = allVideos.filter((v) => !v.isShort);
  const shorts = allVideos.filter((v) => v.isShort);

  // Liked videos — only show for current user
  const likedVideos: Video[] = isCurrentUser
    ? [...demo.likedVideos]
        .map((id) => getVideoById(id, demo.userVideos))
        .filter((v): v is Video => v !== undefined)
    : [];

  const displayedVideos: Video[] =
    tab === "videos" ? regularVideos : tab === "shorts" ? shorts : likedVideos;

  // Dynamic stats for current user
  const dynamicFollowers = isCurrentUser
    ? creator.followers + demo.followedCreators.size
    : creator.followers + (demo.isFollowing(creator.id) ? 1 : 0);
  const dynamicFollowing = isCurrentUser
    ? creator.following + demo.followedCreators.size
    : creator.following;
  const dynamicTotalLikes = isCurrentUser
    ? creator.totalLikes +
      demo.userVideos.reduce((sum, v) => sum + v.likes + (demo.isLiked(v.id) ? 1 : 0), 0)
    : creator.totalLikes;

  
async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    alert("Please login again.");
    return;
  }

  const extension = file.name.split(".").pop() || "jpg";
  const path = `avatars/${user.id}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("Videos")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    alert("Photo upload failed: " + uploadError.message);
    return;
  }

  const { data: urlData } = supabase.storage
    .from("Videos")
    .getPublicUrl(path);

  const avatarUrl = urlData.publicUrl;

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: profileName,
    avatar_url: avatarUrl,
    bio: profileBio,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    alert("Profile save failed: " + profileError.message);
    return;
  }

  setProfileAvatar(avatarUrl);
  alert("Profile photo updated!");
}
  

  async function saveProfile() {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  if (!user) {
    alert("Please login again.");
    return;
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: profileName,
    bio: profileBio,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    alert("Profile save failed: " + error.message);
    return;
  }

  alert("Profile updated successfully!");
  setShowEditProfile(false);
  }

  return (
    <div className="pb-24">
      <p className="px-4 py-2 text-xs text-gray-400">
  {debugMessage}
</p>
      {/* Banner */}
      <div className="relative h-32 w-full overflow-hidden">
        {creator.banner ? (
          <img src={creator.banner} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-rose-600/30 to-orange-500/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      </div>

      {/* Profile header */}
      <div className="relative -mt-12 px-4">
        <div className="flex items-end justify-between">
         <div className="relative">
  <img
    src={profileAvatar || creator.avatar}
    alt={profileName}
    onClick={() => setShowPhotoPreview(true)}
    className="h-24 w-24 rounded-full object-cover ring-4 ring-[#0a0a0f]"
  />
  {isCurrentUser && (
    <>
      <label
        htmlFor="profile-photo-input"
        className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-rose-500 p-2 text-white"
      >
        <Pencil size={14} />
      </label>
      <input
        id="profile-photo-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoChange}
      />
    </>
  )}
</div>
          {isCurrentUser ? (
            <button
  onClick={() => setShowEditProfile(true)}
  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-300 active:scale-95"
>
  <Pencil size={16} />
  Edit
</button>
          ) : (
            <div className="flex items-center gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-gray-300 active:scale-90">
                <Share2 size={18} />
              </button>
              <FollowButton creator={creator} demo={demo} />
            </div>
          )}
        </div>

        {/* Name & handle */}
        <div className="mt-3">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold text-white">{profileName}</h1>
            {creator.isVerified && <BadgeCheck size={20} className="text-sky-400" />}
            {creator.isSmallCreator && (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                RISING
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{creator.handle}</p>
          <p className="mt-2 text-sm text-gray-400">{profileBio}</p>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-5">
          <div>
            <span className="text-base font-bold text-white">{formatCount(dynamicFollowers)}</span>
            <span className="ml-1 text-xs text-gray-500">followers</span>
          </div>
          <div>
            <span className="text-base font-bold text-white">{formatCount(dynamicFollowing)}</span>
            <span className="ml-1 text-xs text-gray-500">following</span>
          </div>
          <div>
            <span className="text-base font-bold text-white">{formatCount(dynamicTotalLikes)}</span>
            <span className="ml-1 text-xs text-gray-500">likes</span>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-3 text-sm leading-relaxed text-gray-300">{creator.profilebio}</p>

        {/* Category tag */}
        <div className="mt-3">
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-400">
            {creator.category}
          </span>
        </div>
      </div>

      {showEditProfile && (
  <div className="mx-4 mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
    <h2 className="mb-4 text-lg font-bold text-white">
      Edit Profile
    </h2>

    <label className="mb-1 block text-sm text-gray-300">
      Profile Name
    </label>
    <input
      value={profileName}
      onChange={(e) => setProfileName(e.target.value)}
      className="mb-4 w-full rounded-lg border border-white/10 bg-black/30 p-3 text-white"
      placeholder="Your name"
    />

    <label className="mb-1 block text-sm text-gray-300">
      Bio
    </label>
    <textarea
      value={profileBio}
      onChange={(e) => setProfileBio(e.target.value)}
      className="mb-4 w-full rounded-lg border border-white/10 bg-black/30 p-3 text-white"
      placeholder="About you"
      rows={3}
    />

    <div className="flex gap-2">
      <button
        onClick={saveProfile}
        className="rounded-lg bg-rose-500 px-4 py-2 font-semibold text-white"
      >
        Save Changes
      </button>

      <button
        onClick={() => setShowEditProfile(false)}
        className="rounded-lg border border-white/20 px-4 py-2 text-gray-300"
      >
        Cancel
      </button>
    </div>
  </div>
)}

      {/* Tabs */}
      <div className="mt-5 border-b border-white/10">
        <div className="mx-auto flex max-w-md">
          {[
            { key: "videos" as const, label: "Videos", icon: VideoIcon, count: regularVideos.length },
            { key: "shorts" as const, label: "Shorts", icon: Grid3x3, count: shorts.length },
            { key: "liked" as const, label: "Liked", icon: Heart, count: likedVideos.length },
          ].map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
                tab === key ? "text-white" : "text-gray-500"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon size={16} fill={tab === key && key === "liked" ? "currentColor" : "none"} />
                <span className="text-sm font-semibold">{label}</span>
                {count > 0 && <span className="text-xs text-gray-600">({count})</span>}
              </div>
              {tab === key && (
                <div className="absolute -bottom-px left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div className="mx-auto mt-4 max-w-md px-4">
        {tab === "liked" && !isCurrentUser && (
          <div className="py-12 text-center">
            <Heart size={32} className="mx-auto mb-2 text-gray-700" />
            <p className="text-sm text-gray-500">Liked videos are private</p>
          </div>
        )}

        {tab === "liked" && isCurrentUser && likedVideos.length === 0 && (
          <div className="py-12 text-center">
            <Heart size={32} className="mx-auto mb-2 text-gray-700" />
            <p className="text-sm text-gray-500">
              Videos you like will appear here. Tap the heart on any video to like it.
            </p>
          </div>
        )}

        {tab === "liked" && isCurrentUser && likedVideos.length > 0 && (
          <div className="space-y-4">
            {likedVideos.map((video) => (
              <button
                key={video.id}
                onClick={() => onVideoClick(video.id)}
                className="group flex w-full gap-3 rounded-xl p-1 text-left active:scale-[0.98]"
              >
                <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] text-white">
                    {video.duration}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatCount(video.views)} views · {video.uploadDate}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                    <Heart size={11} className="text-rose-500" fill="currentColor" />
                    {formatCount(video.likes + 1)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {tab === "videos" && displayedVideos.length === 0 && (
          <div className="py-12 text-center">
            <VideoIcon size={32} className="mx-auto mb-2 text-gray-700" />
            <p className="text-sm text-gray-500">
              {isCurrentUser
                ? "No videos yet. Upload one from the Upload tab!"
                : "No videos yet"}
            </p>
          </div>
        )}

        {tab === "videos" && displayedVideos.length > 0 && (
          <div className="space-y-4">
            {displayedVideos.map((video) => (
              <button
                key={video.id}
                onClick={() => onVideoClick(video.id)}
                className="group flex w-full gap-3 rounded-xl p-1 text-left active:scale-[0.98]"
              >
                <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-lg">
                  {video.videoUrl ? (
                    <video
                      src={video.videoUrl}
                      className="h-full w-full object-cover"
                      muted
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] text-white">
                    {video.duration}
                  </span>
                  {video.isUserUploaded && (
                    <span className="absolute left-1 top-1 rounded bg-amber-500/90 px-1 py-0.5 text-[8px] font-bold text-black">
                      YOURS
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatCount(video.views)} views · {video.uploadDate}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                    <Heart
                      size={11}
                      className={demo.isLiked(video.id) ? "text-rose-500" : "text-rose-500/60"}
                      fill="currentColor"
                    />
                    {formatCount(video.likes + (demo.isLiked(video.id) ? 1 : 0))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {tab === "shorts" && displayedVideos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {displayedVideos.map((short) => (
              <button
                key={short.id}
                onClick={() => onOpenShorts(0)}
                className="group relative aspect-[9/16] overflow-hidden rounded-xl active:scale-95"
              >
                
<div className="relative">
  <img
  src={profileAvatar || creator.avatar}
  alt={profileName}
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPhotoPreview(true);
  }}
  className="h-24 w-24 cursor-zoom-in rounded-full object-cover ring-4 ring-[#0a0a0f]"
/>

  {isCurrentUser && (
    <>
      <label
        htmlFor="profile-photo-input"
        className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-rose-500 p-2 text-white"
      >
        <Pencil size={14} />
      </label>

      <input
        id="profile-photo-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoChange}
      />
    </>
  )}
</div>
                
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5">
                  <p className="line-clamp-2 text-[10px] font-semibold leading-tight text-white">
                    {short.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-0.5">
                    <Heart size={9} className="text-white/80" fill="currentColor" />
                    <span className="text-[9px] text-white/80">{formatCount(short.likes)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        
        {tab === "shorts" && displayedVideos.length === 0 && (
          <p className="py-12 text-center text-sm text-gray-500">No shorts yet</p>
        )}
      </div>

      {showPhotoPreview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowPhotoPreview(false)}
        >
          <button
            type="button"
            aria-label="Close photo preview"
            className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-xl text-white"
            onClick={() => setShowPhotoPreview(false)}
          >
            ✕
          </button>

          <img
            src={profileAvatar || creator.avatar}
            alt={profileName}
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

