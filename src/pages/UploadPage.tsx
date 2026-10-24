import { useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  Film,
  X,
  Info,
  CheckCircle2,
  Hash,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { Video } from "@/types";
import type { DemoState } from "@/hooks/useDemoState";
import { supabase } from "@/lib/supabase";
interface UploadPageProps {
  demo: DemoState;
  onUploaded: () => void;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const categories = [
  "Gaming",
  "Food",
  "Travel",
  "Music",
  "Fitness",
  "Art",
  "Tech",
  "Beauty",
  "Dance",
  "Other",
];

interface FormErrors {
  file?: string;
  title?: string;
  category?: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/** Capture a thumbnail frame from the selected video file */
function captureThumbnail(videoUrl: string): Promise<{ thumbnail: string; duration: string }> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.muted = true;
    video.crossOrigin = "anonymous";

    video.addEventListener("loadeddata", () => {
      // Seek to 1s or 10% into the video for a representative frame
      video.currentTime = Math.min(1, video.duration * 0.1);
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      const thumbnail = canvas.toDataURL("image/jpeg", 0.7);
      const duration = formatDuration(video.duration || 0);
      resolve({ thumbnail, duration });
    });

    // Fallback if thumbnail capture fails
    video.addEventListener("error", () => {
      resolve({
        thumbnail:
          "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=940&h=560&fit=crop",
        duration: "0:00",
      });
    });
  });
}

export function UploadPage({ demo, onUploaded }: UploadPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>("0:00");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (f: File): string | null => {
    if (!f.type.startsWith("video/")) {
      return "Please select a video file (MP4, WebM, MOV, or OGG).";
    }
    if (f.size > MAX_FILE_SIZE) {
      return "File is too large. Maximum size is 500MB for this demo.";
    }
    return null;
  };

  const handleFileSelect = useCallback(
    async (f: File) => {
      const fileError = validateFile(f);
      if (fileError) {
        setErrors((prev) => ({ ...prev, file: fileError }));
        return;
      }

      setErrors((prev) => ({ ...prev, file: undefined }));
      setFile(f);
      setThumbnail(null);
      setThumbnailLoading(true);

      const url = URL.createObjectURL(f);
      setFilePreview(url);

      try {
        const { thumbnail: thumb, duration: dur } = await captureThumbnail(url);
        setThumbnail(thumb);
        setDuration(dur);
      } catch {
        setThumbnail(null);
      } finally {
        setThumbnailLoading(false);
      }
    },
    []
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileSelect(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  };

  const clearFile = () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(null);
    setFilePreview(null);
    setThumbnail(null);
    setDuration("0:00");
    setErrors((prev) => ({ ...prev, file: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!file) newErrors.file = "Please select a video file to upload.";
    if (!title.trim()) newErrors.title = "Title is required.";
    if (title.trim().length < 3) newErrors.title = "Title must be at least 3 characters.";
    if (!category) newErrors.category = "Please select a category.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !file) return;

    setUploading(true);
    setUploadProgress(10);
    setErrors((prev) => ({ ...prev, file: undefined }));

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Please sign in again.");

      const extension = file.name.split(".").pop() || "mp4";
      const filePath = `${user.id}/${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(70);

      const { data: publicData } = supabase.storage
        .from("videos")
        .getPublicUrl(filePath);

      const videoUrl = publicData.publicUrl;

      const { data: savedVideo, error: dbError } = await supabase
        .from("videos")
        .insert({
          title: title.trim(),
          video_url: videoUrl,
          user_id: user.id,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const newVideo: Video = {
        id: String(savedVideo.id),
        title: title.trim(),
        thumbnail: thumbnail ?? "",
        creatorId: user.id,
        views: 0,
        likes: 0,
        uploadDate: "just now",
        duration,
        description: description.trim() || "No description provided.",
        isShort: false,
        category,
        comments: [],
        videoUrl,
        isUserUploaded: true,
      };

      demo.addUserVideo(newVideo);
      setUploadProgress(100);
      setSubmitted(true);
      setUploading(false);

      setTimeout(() => onUploaded(), 1500);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        file:
          error instanceof Error
            ? `Upload failed: ${error.message}`
            : "Upload failed. Please try again.",
      }));
      setUploading(false);
    }
  };

  // Watch for upload completion
  

  const resetForm = () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(null);
    setFilePreview(null);
    setThumbnail(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setErrors({});
    setUploadProgress(0);
    setUploading(false);
    setSubmitted(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Success screen
  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle2 size={36} className="text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Upload Complete (Demo)</h3>
          <p className="mt-1 max-w-xs text-sm text-gray-400">
            Your video "{title}" has been added to your profile and the home feed. This is a
            local demo — the video is not publicly shared or stored online.
          </p>
          <button
            onClick={resetForm}
            className="mt-6 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-gray-300 active:scale-95"
          >
            Upload Another
          </button>
        </div>
      </div>
    );
  }

  const canSubmit = file && title.trim().length >= 3 && category && !uploading;

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      {/* Demo notice */}
      <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
        <Info size={18} className="mt-0.5 shrink-0 text-amber-400" />
        <div>
          <p className="text-sm font-semibold text-amber-300">Demo Mode</p>
          <p className="mt-0.5 text-xs leading-relaxed text-amber-200/70">
            Videos are saved locally on this device only — they are not uploaded to a server,
            stored in the cloud, or shared with other users. A real backend is needed for public
            sharing.
          </p>
        </div>
      </div>

      <h2 className="mb-1 text-xl font-bold text-white">Share your content</h2>
      <p className="mb-5 text-sm text-gray-500">Pick a video, add details, and preview the upload flow.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* File picker */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-white">
            Video File <span className="text-rose-400">*</span>
          </label>
          {!file ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/5 px-6 py-10 text-center transition-colors hover:border-rose-500/50 hover:bg-rose-500/5 active:scale-[0.98]"
            >
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/20 to-orange-500/20">
                <UploadCloud size={28} className="text-rose-400" />
              </div>
              <p className="text-sm font-medium text-white">Tap to select a video</p>
              <p className="mt-1 text-xs text-gray-500">or drag and drop here</p>
              <p className="mt-2 text-[11px] text-gray-600">MP4, WebM, MOV — up to 500MB</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#16161e]">
              {filePreview ? (
                <video src={filePreview} className="aspect-video w-full object-cover" controls muted />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-white/5">
                  <Film size={32} className="text-gray-600" />
                </div>
              )}
              {thumbnailLoading && (
                <div className="flex items-center gap-2 border-t border-white/5 px-3 py-2">
                  <Loader2 size={14} className="animate-spin text-gray-400" />
                  <span className="text-xs text-gray-500">Generating thumbnail...</span>
                </div>
              )}
              <div className="flex items-center justify-between p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB · {duration}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 active:scale-90"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
          {errors.file && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle size={13} />
              {errors.file}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={onFileChange}
            className="hidden"
          />
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-white">
            Title <span className="text-rose-400">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
            }}
            placeholder="Give your video a catchy title..."
            maxLength={100}
            className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 ${
              errors.title
                ? "border-rose-500/50 focus:ring-rose-500"
                : "border-white/10 focus:border-rose-500/50 focus:ring-rose-500"
            }`}
          />
          {errors.title ? (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle size={13} />
              {errors.title}
            </div>
          ) : (
            <p className="mt-1 text-right text-[11px] text-gray-600">{title.length}/100</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-white">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell viewers what your video is about..."
            maxLength={500}
            rows={4}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
          <p className="mt-1 text-right text-[11px] text-gray-600">{description.length}/500</p>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-white">
            <Hash size={15} className="text-gray-500" />
            Category <span className="text-rose-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                  category === cat
                    ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {errors.category && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle size={13} />
              {errors.category}
            </div>
          )}
        </div>

        {/* Upload progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-gray-400">
                <Loader2 size={14} className="animate-spin" />
                Uploading (demo)...
              </span>
              <span className="font-semibold text-white">{uploadProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-100"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition-opacity active:scale-[0.98] disabled:opacity-30"
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloud size={18} />
              Publish Video (Demo)
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-gray-600">
          By uploading, you acknowledge this is a demo — videos are stored locally on your device only.
        </p>
      </form>
    </div>
  );
}
