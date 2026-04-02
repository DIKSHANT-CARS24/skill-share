"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SkillSaveToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(() => searchParams.get("updated") === "1");

  useEffect(() => {
    if (!isVisible || searchParams.get("updated") !== "1") {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("updated");
    const nextUrl = nextSearchParams.toString() ? `${pathname}?${nextSearchParams}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [isVisible, pathname, router, searchParams]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timeout = window.setTimeout(() => setIsVisible(false), 3200);
    return () => window.clearTimeout(timeout);
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed top-5 right-5 z-50 max-w-sm">
      <div
        role="status"
        aria-live="polite"
        className="rounded-[16px] border border-success/20 bg-success-soft px-4 py-3 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-success shadow-[0_12px_30px_rgba(15,23,43,0.12)]"
      >
        <p className="font-semibold">Details updated successfully</p>
      </div>
    </div>
  );
}
