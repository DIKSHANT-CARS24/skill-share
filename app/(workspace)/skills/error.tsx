"use client";

import { ErrorStatePanel } from "@/components/states/state-panels";

export default function SkillsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorStatePanel
      title="The skills catalog could not be rendered."
      description="The frontend now has a real route-level error boundary for the catalog. Retry will rerender the page, while a future backend would also trigger a refetch."
      onRetry={reset}
    />
  );
}
