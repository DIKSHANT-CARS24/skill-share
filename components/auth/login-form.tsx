"use client";

import { useState, useTransition } from "react";
import {
  buildOAuthCallbackUrl,
  DEFAULT_SIGN_IN_REDIRECT_PATH,
  getSafeNextPath,
  OAUTH_NEXT_COOKIE_NAME,
} from "@/lib/auth-utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function LoginForm({
  next = DEFAULT_SIGN_IN_REDIRECT_PATH,
}: {
  next?: string;
}) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleGoogleSignIn() {
    startTransition(async () => {
      const supabase = createClient();
      const safeNext = getSafeNextPath(next);
      const redirectTo = buildOAuthCallbackUrl(window.location.origin);

      document.cookie =
        `${OAUTH_NEXT_COOKIE_NAME}=${encodeURIComponent(safeNext)}; Path=/; Max-Age=600; SameSite=Lax`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        setMessage(error.message);
      }
    });
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        size="large"
        className="w-full justify-center cursor-pointer"
        onClick={handleGoogleSignIn}
        disabled={isPending}
      >
        {isPending ? "Redirecting to Google..." : "Continue with Google"}
      </Button>

      <div className="glass-surface-subtle rounded-[20px] px-4 py-3">
        <p className="text-[var(--font-size-body-s)] leading-[1.5] text-muted">
          You will be redirected to Google and returned to this workspace on the same origin after authentication.
        </p>
      </div>

      {message ? (
        <p className="text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-danger">
          {message}
        </p>
      ) : null}
    </div>
  );
}
