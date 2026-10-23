import { useState } from "react";
import { X, Send, Heart } from "lucide-react";
import type { Video } from "@/types";
import type { DemoState } from "@/hooks/useDemoState";
import { formatCount } from "@/lib/format";

interface CommentSheetProps {
  video: Video;
  demo: DemoState;
  onClose: () => void;
}

export function CommentSheet({ video, demo, onClose }: CommentSheetProps) {
  const [input, setInput] = useState("");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const allComments = [...video.comments, ...(demo.extraComments[video.id] ?? [])];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    demo.addComment(video.id, input.trim());
    setInput("");
  };

  const toggleCommentLike = (id: string) => {
    setLikedComments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-[61] max-h-[75vh] animate-slide-up rounded-t-3xl border-t border-white/10 bg-[#16161e]">
        <div className="mx-auto max-w-md">
          {/* Handle */}
          <div className="flex justify-center pt-3">
            <div className="h-1 w-10 rounded-full bg-white/20" />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="text-base font-bold text-white">
              {formatCount(allComments.length)} Comments
            </h3>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 active:scale-90"
            >
              <X size={18} />
            </button>
          </div>

          {/* Comments list */}
          <div className="max-h-[45vh] space-y-4 overflow-y-auto px-4 pb-4">
            {allComments.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">
                No comments yet. Be the first to comment!
              </p>
            )}
            {allComments.map((c) => {
              const liked = likedComments.has(c.id);
              return (
                <div key={c.id} className="flex gap-3">
                  <img
                    src={c.authorAvatar}
                    alt={c.authorName}
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400">{c.authorName}</span>
                      <span className="text-xs text-gray-600">{c.timestamp}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-white">{c.text}</p>
                    <button
                      onClick={() => toggleCommentLike(c.id)}
                      className="mt-1 flex items-center gap-1 text-xs text-gray-500 active:scale-90"
                    >
                      <Heart
                        size={13}
                        className={liked ? "text-rose-500" : "text-gray-500"}
                        fill={liked ? "currentColor" : "none"}
                      />
                      <span className={liked ? "text-rose-500" : ""}>
                        {formatCount(c.likes + (liked ? 1 : 0))}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-white/10 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
          >
            <img
              src="https://images.pexels.com/photos/32449512/pexels-photo-32449512.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
              alt="You"
              className="h-8 w-8 rounded-full object-cover"
            />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-white transition-opacity disabled:opacity-30 active:scale-90"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
