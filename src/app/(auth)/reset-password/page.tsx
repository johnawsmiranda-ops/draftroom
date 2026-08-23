import { AuthShowcase } from "@/components/AuthShowcase";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main className="flex-1 flex bg-paper">
      <AuthShowcase />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl mb-1">Set a new password</h1>
          <p className="text-ink-soft text-sm mb-8">
            Choose something you&apos;ll remember this time.
          </p>

          <ResetPasswordForm token={token ?? null} />
        </div>
      </div>
    </main>
  );
}
