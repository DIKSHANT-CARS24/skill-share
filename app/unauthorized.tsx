import { Panel } from "@/components/ui/panel";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default function UnauthorizedPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-8">
      <Panel padding="lg" className="w-full">
        <p className="text-[var(--font-size-label-s)] leading-[var(--line-height-body)] font-semibold uppercase tracking-[0.18em] text-muted">
          Unauthorized
        </p>
        <h1 className="mt-3 text-[var(--font-size-heading-l)] leading-[var(--line-height-heading)] font-semibold sm:text-[var(--font-size-display-xl)]">
          Your account does not have access
        </h1>
        <p className="mt-4 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted sm:text-[var(--font-size-body-l)]">
          Sign in with your Cars24 account.{" "}
          You are signed in, but Skill Share is available only to approved
          <code className="mx-1 rounded bg-surface px-2 py-0.5">@cars24.com</code>
          users with an active
          <code className="mx-1 rounded bg-surface px-2 py-0.5">org_members</code>
          record.
        </p>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </Panel>
    </main>
  );
}
