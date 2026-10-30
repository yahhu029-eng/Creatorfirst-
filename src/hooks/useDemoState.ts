import { useCallback, useState, useEffect } from "react";
import type { Video } from "@/types";

/**
 * Demo-only interactive state persisted to localStorage.
 * Likes, follows, comments survive page reloads.
 * User-uploaded video metadata is also saved (but blob URLs are
 * session-only — the actual video file is not stored).
 */

const STORAGE_KEYS = {
  likes: "cf_likedVideos",
  follows: "cf_followedCreators",
  comments: "cf_extraComments",
  userVideos: "cf_userVideos",
};

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function loadRecord(key: string): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function loadUserVideos(key: string): Video[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as Video[];
  } catch {
    return [];
  }
}

export interface DemoComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export function useDemoState() {
  const [likedVideos, setLikedVideos] = useState<Set<string>>(() => loadSet(STORAGE_KEYS.likes));
  const [followedCreators, setFollowedCreators] = useState<Set<string>>(() =>
    loadSet(STORAGE_KEYS.follows)
  );
  const [extraComments, setExtraComments] = useState<Record<string, DemoComment[]>>(() =>
    loadRecord(STORAGE_KEYS.comments) as Record<string, DemoComment[]>
  );
  const [userVideos, setUserVideos] = useState<Video[]>(() => loadUserVideos(STORAGE_KEYS.userVideos));

  // Persist to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.likes, JSON.stringify([...likedVideos]));
  }, [likedVideos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.follows, JSON.stringify([...followedCreators]));
  }, [followedCreators]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.comments, JSON.stringify(extraComments));
  }, [extraComments]);

  useEffect(() => {
    // Strip videoUrl before saving — blob URLs are session-only
    const storable = userVideos.map(({ videoUrl: _vu, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEYS.userVideos, JSON.stringify(storable));
  }, [userVideos]);

  const toggleLike = useCallback((videoId: string) => {
    setLikedVideos((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) next.delete(videoId);
      else next.add(videoId);
      return next;
    });
  }, []);

  const toggleFollow = useCallback((creatorId: string) => {
    setFollowedCreators((prev) => {
      const next = new Set(prev);
      if (next.has(creatorId)) next.delete(creatorId);
      else next.add(creatorId);
      return next;
    });
  }, []);

  const addComment = useCallback((videoId: string, text: string) => {
    const comment: DemoComment = {
      id: `user-${Date.now()}`,
      authorName: "You",
      authorAvatar:
        "https://images.pexels.com/photos/32449512/pexels-photo-32449512.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      text,
      timestamp: "just now",
      likes: 0,
    };
    setExtraComments((prev) => ({
      ...prev,
      [videoId]: [...(prev[videoId] ?? []), comment],
    }));
  }, []);
    const removeUserVideo = useCallback((videoId: string) => {
    setUserVideos((prev) => prev.filter((video) => video.id !== videoId));
  }, []);

  const addUserVideo = useCallback((video: Video) => {
    setUserVideos((prev) => [video, ...prev]);
  }, []);

  const isLiked = useCallback((videoId: string) => likedVideos.has(videoId), [likedVideos]);
  const isFollowing = useCallback(
    (creatorId: string) => followedCreators.has(creatorId),
    [followedCreators]
  );

  return {
    likedVideos,
    followedCreators,
    extraComments,
    userVideos,
    toggleLike,
    toggleFollow,
    addComment,
    addUserVideo,
    removeUserVideo,
    isLiked,
    isFollowing,
  };
}

export type DemoState = ReturnType<typeof useDemoState>;
