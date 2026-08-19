"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeAvatarAction, updateAvatarAction } from "@/lib/actions/profile";
import { Avatar } from "@/components/Avatar";

const TARGET_SIZE = 256;

function isHeic(file: File) {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  // iPhone/Mac photo libraries default to HEIC, which no browser except
  // Safari can decode into an <img>/<canvas> — Chrome's file picker often
  // reports an empty MIME type for these too, so we also check the
  // extension rather than trusting file.type alone.
  return type === "image/heic" || type === "image/heif" || name.endsWith(".heic") || name.endsWith(".heif");
}

// Resize+crop to a small square client-side before it ever reaches the
// server — keeps the stored data URL small since avatars are saved inline
// rather than in dedicated blob storage.
async function fileToSquareDataUrl(file: File): Promise<string> {
  let workingFile: File | Blob = file;

  if (isHeic(file)) {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    workingFile = Array.isArray(converted) ? converted[0] : converted;
  }

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
    reader.readAsDataURL(workingFile);
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
    if (!file.type.startsWith("image/") && !isHeic(file)) {
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
    } catch (err) {
      setError(
        isHeic(file)
          ? "Couldn't convert that HEIC photo — try exporting it as JPEG first."
          : "Couldn't process that image — try a different one.",
      );
      // eslint-disable-next-line no-console
      console.error(err);
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
