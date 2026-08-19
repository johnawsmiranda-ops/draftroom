"use client";

import { useRouter } from "next/navigation";
import { markWritingDateVisitedAction } from "@/lib/actions/writing-dates";

export function ContinueButton({
  projectId,
  writingDateId,
}: {
  projectId: string;
  writingDateId: string;
}) {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await markWritingDateVisitedAction(writingDateId);
        router.push(`/projects/${projectId}/write`);
      }}
      className="rounded-full bg-ink text-paper px-6 py-3 text-sm hover:opacity-90 transition-opacity"
    >
      Continue where you left off
    </button>
  );
}
