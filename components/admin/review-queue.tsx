"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { reviewedItems as reviewedSeed } from "@/lib/mock-data";
import { getSkillById } from "@/lib/mock-data";
import type { ReviewedItem, ReviewDecision, ReviewItem } from "@/lib/types";
import { EmptyStatePanel } from "@/components/states/state-panels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPanelClassName, Panel } from "@/components/ui/panel";
import { formatDate } from "@/lib/utils";

export function ReviewQueue({ items }: { items: ReviewItem[] }) {
  const [pendingItems, setPendingItems] = useState(items);
  const [reviewedItems, setReviewedItems] = useState(reviewedSeed);
  const [statusMessage, setStatusMessage] = useState(
    "Approve or reject actions are mocked locally so you can review the workflow without a backend.",
  );

  const reviewedCount = reviewedItems.length;
  const pendingCount = pendingItems.length;

  const reviewedSummary = useMemo(
    () => reviewedItems.filter((item) => item.decision === "approved").length,
    [reviewedItems],
  );

  function handleDecision(item: ReviewItem, decision: ReviewDecision) {
    const skill = getSkillById(item.skillId);

    setPendingItems((current) => current.filter((entry) => entry.id !== item.id));
    setReviewedItems((current) => [
      createReviewedItem(item, decision),
      ...current,
    ]);
    setStatusMessage(
      skill
        ? `${skill.title} was ${decision === "approved" ? "approved" : "rejected"} in the mock moderation queue.`
        : "A moderation decision was recorded locally.",
    );
  }

  return (
    <div className="space-y-5">
      <Panel className="overflow-hidden">
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-[var(--font-size-title-m)] leading-[var(--line-height-heading)] font-semibold">Admin review list</h2>
          <p className="mt-1 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">{statusMessage}</p>
        </div>

        <div className="grid gap-4 border-b border-border px-6 py-5 sm:grid-cols-3">
          <div className={getPanelClassName({ tone: "subtle", padding: "md", className: "shadow-none" })}>
            <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">Pending reviews</p>
            <p className="mt-2 text-[var(--font-size-heading-l)] leading-[var(--line-height-heading)] font-semibold">{pendingCount}</p>
          </div>
          <div className={getPanelClassName({ tone: "subtle", padding: "md", className: "shadow-none" })}>
            <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">Reviewed items</p>
            <p className="mt-2 text-[var(--font-size-heading-l)] leading-[var(--line-height-heading)] font-semibold">{reviewedCount}</p>
          </div>
          <div className={getPanelClassName({ tone: "subtle", padding: "md", className: "shadow-none" })}>
            <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">Approved decisions</p>
            <p className="mt-2 text-[var(--font-size-heading-l)] leading-[var(--line-height-heading)] font-semibold">{reviewedSummary}</p>
          </div>
        </div>

        {pendingItems.length ? (
          <div className="divide-y divide-border">
            {pendingItems.map((item) => {
              const skill = getSkillById(item.skillId);

              if (!skill) {
                return null;
              }

              return (
                <article
                  key={item.id}
                  className="grid gap-4 px-6 py-5 lg:grid-cols-[1.5fr_1fr_auto] lg:items-center"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">{skill.title}</p>
                      <Badge
                        size="xs"
                        tone={
                          item.priority === "High"
                            ? "error"
                            : item.priority === "Medium"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {item.priority} priority
                      </Badge>
                      <Badge size="xs">v{skill.latestVersion}</Badge>
                    </div>
                    <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted-strong">{item.reason}</p>
                  </div>

                  <dl className="grid gap-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                    <div className="flex justify-between gap-4">
                      <dt>Requested by</dt>
                      <dd className="font-medium text-foreground">{item.requestedBy}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Submitted</dt>
                      <dd className="font-medium text-foreground">
                        {formatDate(item.requestedAt)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt>Status</dt>
                      <dd className="font-medium text-foreground">{item.currentStep}</dd>
                    </div>
                  </dl>

                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
                    <Button asChild variant="secondary">
                      <Link href={`/skills/${skill.id}`}>View skill</Link>
                    </Button>
                    <Button onClick={() => handleDecision(item, "approved")}>Approve</Button>
                    <Button variant="tertiary" onClick={() => handleDecision(item, "rejected")}>
                      Reject
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-6">
            <EmptyStatePanel
              title="All reviews are up to date"
              description="All mock moderation items have been processed locally. A backend workflow would later repopulate this queue from new uploads and revised submissions."
              actionLabel="Browse catalog"
              actionHref="/skills"
            />
          </div>
        )}
      </Panel>

      <Panel className="overflow-hidden">
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-[var(--font-size-title-m)] leading-[var(--line-height-heading)] font-semibold">Reviewed items</h2>
          <p className="mt-1 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
            This activity feed is mocked and updates immediately when you take an action above.
          </p>
        </div>

        <div className="divide-y divide-border">
          {reviewedItems.map((item) => {
            const skill = getSkillById(item.skillId);

            if (!skill) {
              return null;
            }

            return (
              <article key={item.id} className="grid gap-3 px-6 py-5 lg:grid-cols-[1.5fr_1fr]">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">{skill.title}</p>
                    <Badge size="xs" tone={item.decision === "approved" ? "success" : "error"}>
                      {item.decision === "approved" ? "Approved" : "Rejected"}
                    </Badge>
                  </div>
                  <p className="text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted-strong">{item.note}</p>
                </div>

                <dl className="grid gap-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                  <div className="flex justify-between gap-4">
                    <dt>Reviewed by</dt>
                    <dd className="font-medium text-foreground">{item.reviewedBy}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Date</dt>
                    <dd className="font-medium text-foreground">{formatDate(item.reviewedAt)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Skill page</dt>
                    <dd>
                      <Link href={`/skills/${skill.id}`} className="font-medium text-accent-strong">
                        View detail
                      </Link>
                    </dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function createReviewedItem(item: ReviewItem, decision: ReviewDecision): ReviewedItem {
  return {
    id: `reviewed-${item.id}-${decision}`,
    skillId: item.skillId,
    reviewedBy: "Mock Admin",
    reviewedAt: new Date().toISOString().slice(0, 10),
    decision,
    note:
      decision === "approved"
        ? "Approved in the mock moderation flow."
        : "Rejected in the mock moderation flow so the uploader can revise and resubmit.",
  };
}
