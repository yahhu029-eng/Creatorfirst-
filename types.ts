export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  bio: string;
  followers: number;
  following: number;
  totalLikes: number;
  isVerified?: boolean;
  isSmallCreator?: boolean;
  category: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  creatorId: string;
  views: number;
  likes: number;
  uploadDate: string;
  duration: string;
  description: string;
  isShort: boolean;
  comments: Comment[];
  category?: string;
  /** Blob URL for user-uploaded videos — only valid for the current session */
  videoUrl?: string;
  /** True when this video was uploaded by the user in this or a prior session */
  isUserUploaded?: boolean;
}

export type TabKey = "home" | "discover" | "upload" | "profile";

export type ViewKey =
  | { tab: TabKey }
  | { tab: "settings" }
  | { tab: "creator"; creatorId: string }
  | { tab: "shorts"; startIndex: number }
  | { tab: "video"; videoId: string };
