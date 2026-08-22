/**
 * Shown by Next's route-level loading.tsx files while a screen is being
 * fetched. No hooks, so it stays a server component and costs nothing to
 * render — it reuses the same idle bob as the assistant himself, so the wait
 * feels like part of the room rather than a spinner bolted on.
 */
export function DraftsmanLoader({ message }: { message: string }) {
  return (
    <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center px-6">
      <div className="animate-draftsman-bob">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/draftsman.png"
          alt=""
          width={72}
          height={122}
          className="w-[72px] h-[122px] object-contain drop-shadow-md select-none"
        />
      </div>
      <p className="font-display text-lg mt-5 text-ink text-center">{message}</p>
      <div className="flex items-center gap-1.5 mt-3" aria-hidden>
        <span className="w-1.5 h-1.5 rounded-full bg-ink-soft/50 animate-draftsman-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-ink-soft/50 animate-draftsman-dot [animation-delay:0.16s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-ink-soft/50 animate-draftsman-dot [animation-delay:0.32s]" />
      </div>
      <span className="sr-only" role="status">
        {message}
      </span>
    </div>
  );
}
