import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOptionalMemberContext } from "@/lib/auth";
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

  if (context?.access === "granted") {
    redirect("/skills");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="grid w-full gap-5 lg:min-h-[680px] lg:grid-cols-[1.08fr_0.92fr]">
        <LoginGradientPanel />

        <Panel
          padding="lg"
          className="flex h-full items-start justify-start bg-surface-strong sm:p-8 lg:p-10"
        >
          <div className="flex w-full min-w-0 flex-col gap-8 pt-2 lg:pt-4">
            <div className="max-w-[34rem] space-y-4">
              <h2 className="text-[2.5rem] leading-[0.98] font-semibold tracking-[-0.04em] text-foreground sm:text-[3rem]">
                Get Started Now
              </h2>
              <p className="text-[var(--font-size-body-l)] leading-[1.6] text-muted lg:whitespace-nowrap">
                Sign in with your Cars24 Google Workspace account to continue.
              </p>
            </div>

            {error ? (
              <div className="rounded-[16px] border border-danger/15 bg-danger-soft px-4 py-3">
                <p className="text-[var(--font-size-body-s)] leading-[1.5] text-danger">
                  {error}
                </p>
              </div>
            ) : null}

            <div className="w-full">
              <LoginForm />
            </div>
          </div>
        </Panel>
      </div>
    </main>
  );
}
