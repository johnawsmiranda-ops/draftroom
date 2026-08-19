import { listGlimpses } from "@/lib/actions/glimpses";
import { GlimpseView } from "@/components/GlimpseView";

export default async function GlimpsesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const glimpses = await listGlimpses(projectId);

  return (
    <div className="px-10 py-6">
      <GlimpseView projectId={projectId} glimpses={glimpses} />
    </div>
  );
}
