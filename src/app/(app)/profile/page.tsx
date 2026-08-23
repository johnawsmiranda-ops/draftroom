import { getCurrentUserProfile } from "@/lib/actions/profile";
import { getPendingDeletionRequest } from "@/lib/actions/account-deletion";
import { AvatarUploader } from "@/components/AvatarUploader";
import { NameEditForm } from "@/components/NameEditForm";
import { DeleteAccountSection } from "@/components/DeleteAccountSection";

export default async function ProfilePage() {
  const profile = await getCurrentUserProfile();
  const pendingDeletion = await getPendingDeletionRequest();

  return (
    <div className="px-4 sm:px-10 py-12 max-w-lg mx-auto">
      <h1 className="font-display text-3xl mb-2">Profile</h1>
      <p className="text-ink-soft text-sm mb-10">How you show up around Draftroom.</p>

      <div className="rounded-2xl border border-line bg-card p-6 mb-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-4">Photo</h2>
        <AvatarUploader name={profile?.name} avatarUrl={profile?.avatarUrl} />
      </div>

      <div className="rounded-2xl border border-line bg-card p-6 mb-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-4">Name</h2>
        <NameEditForm initialName={profile?.name} />
      </div>

      <div className="rounded-2xl border border-line bg-card p-6 mb-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-2">Email</h2>
        <p className="text-sm text-ink">{profile?.email}</p>
      </div>

      <DeleteAccountSection initiallyPending={Boolean(pendingDeletion)} />
    </div>
  );
}
