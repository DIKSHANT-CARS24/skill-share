import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOptionalMemberContext, getSafeNextPath } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";
import { LoginGradientPanel } from "@/components/auth/login-gradient-panel";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const context = await getOptionalMemberContext();
  const error = typeof params.error === "string" ? params.error : "";
  const next = getSafeNextPath(typeof params.next === "string" ? params.next : undefined);

  if (context) {
    if (context.access === "granted") {
      redirect(next);
    }

    redirect("/unauthorized");
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-[14%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(71,54,254,0.22)_0%,rgba(71,54,254,0.06)_52%,transparent_76%)] blur-3xl" />
        <div className="absolute right-[6%] top-[24%] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,190,223,0.2)_0%,rgba(255,190,223,0.06)_50%,transparent_76%)] blur-3xl" />
      </div>

      <div className="relative grid w-full gap-6 lg:min-h-[720px] lg:grid-cols-[1.08fr_0.92fr]">
        <LoginGradientPanel />

        <Panel
          padding="lg"
          className="relative flex h-full items-start justify-start overflow-hidden sm:p-8 lg:p-10"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(71,54,254,0.09),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,196,226,0.12),transparent_34%)]" />
          <div className="relative flex w-full min-w-0 flex-col gap-8 pt-2 lg:pt-4">
            <div className="max-w-[34rem] space-y-4">
              <span className="glass-pill inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-strong">
                Secure Workspace Access
              </span>
              <h2 className="text-[2.5rem] leading-[0.98] font-semibold tracking-[-0.04em] text-foreground sm:text-[3rem]">
                Get Started Now
              </h2>
              <p className="max-w-[30rem] text-[var(--font-size-body-l)] leading-[1.6] text-muted">
                Sign in with your Cars24 Google Workspace account to continue.
              </p>
            </div>

            {error ? (
              <div className="glass-surface-subtle rounded-[20px] border border-danger/20 px-4 py-3">
                <p className="text-[var(--font-size-body-s)] leading-[1.5] text-danger">
                  {error}
                </p>
              </div>
            ) : null}

            <div className="glass-surface-subtle w-full rounded-[28px] p-5 sm:p-6">
              <LoginForm next={next} />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="glass-surface-subtle rounded-[22px] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Access</p>
                <p className="mt-2 text-[var(--font-size-body-m)] font-semibold text-foreground">Google Workspace only</p>
              </div>
              <div className="glass-surface-subtle rounded-[22px] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Permissions</p>
                <p className="mt-2 text-[var(--font-size-body-m)] font-semibold text-foreground">Role-aware member access</p>
              </div>
              <div className="glass-surface-subtle rounded-[22px] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Routing</p>
                <p className="mt-2 text-[var(--font-size-body-m)] font-semibold text-foreground">Returns to your current origin</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </main>
  );
}
