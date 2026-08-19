"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeAvatarAction, updateAvatarAction } from "@/lib/actions/profile";
import { Avatar } from "@/components/Avatar";

const TARGET_SIZE = 256;

// Resize+crop to a small square client-side before it ever reaches the
// server — keeps the stored data URL small since avatars are saved inline
// rather than in dedicated blob storage.
function fileToSquareDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = TARGET_SIZE;
        canvas.height = TARGET_SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, TARGET_SIZE, TARGET_SIZE);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("Couldn't read that image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Couldn't read that file"));
    reader.readAsDataURL(file);
  });
}

export function AvatarUploader({
  name,
  avatarUrl,
}: {
  name?: string | null;
  avatarUrl?: string | null;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState(avatarUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    setError(null);
    try {
      const dataUrl = await fileToSquareDataUrl(file);
      setPreview(dataUrl);
      startTransition(() => {
        updateAvatarAction(dataUrl).then((res) => {
          if (res && !res.ok) setError(res.error ?? "Something went wrong.");
          else router.refresh();
        });
      });
    } catch {
      setError("Couldn't process that image — try a different one.");
    }
  }

  function onRemove() {
    setPreview(null);
    startTransition(() => {
      removeAvatarAction().then(() => router.refresh());
    });
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar name={name} avatarUrl={preview} size={72} />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="text-xs rounded-full bg-ink text-paper px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {preview ? "Change photo" : "Upload photo"}
          </button>
          {preview && (
            <button
              type="button"
              onClick={onRemove}
              disabled={pending}
              className="text-xs text-ink-soft hover:text-ink px-3 py-2 disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
        {error && <p className="text-xs text-accent">{error}</p>}
        <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
      </div>
    </div>
  );
}
