function initialsOf(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function Avatar({
  name,
  avatarUrl,
  size = 32,
  dark = false,
}: {
  name?: string | null;
  avatarUrl?: string | null;
  size?: number;
  dark?: boolean;
}) {
  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={avatarUrl}
        alt={name ?? "Profile picture"}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full shrink-0 flex items-center justify-center font-display ${
        dark ? "bg-white/10 text-paper" : "bg-paper-deep text-ink-soft"
      }`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initialsOf(name)}
    </div>
  );
}
