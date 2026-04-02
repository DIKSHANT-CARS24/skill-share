"use client";

import { useState, useTransition } from "react";
import { DEFAULT_SIGN_IN_REDIRECT_PATH } from "@/lib/auth-utils";
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
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
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

      {message ? (
        <p className="text-[var(--font-size-body-s)] leading-[var(--line-height-body)] text-danger">
          {message}
        </p>
      ) : null}
    </div>
  );
}
