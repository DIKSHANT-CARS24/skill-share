"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/lib/types";
import { TopbarLogo } from "@/components/app-shell/topbar-logo";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SkillsAccountMenu } from "@/components/skills/skills-account-menu";
import { SkillsTopbar } from "@/components/skills/skills-topbar";

interface WorkspaceTopbarProps {
  member: {
    email: string;
    role: UserRole;
  };
}

const pageLabels = [
  { match: (pathname: string) => pathname === "/upload", label: "Upload skill" },
  {
    match: (pathname: string) => pathname.startsWith("/skills/") && pathname.endsWith("/edit"),
    label: "Edit skill",
  },
  {
    match: (pathname: string) => pathname.startsWith("/skills/"),
    label: "Skill details",
  },
  { match: (pathname: string) => pathname === "/profile", label: "Profile" },
  { match: (pathname: string) => pathname === "/admin", label: "Admin" },
  { match: (pathname: string) => pathname === "/design-preview", label: "Preview" },
];

export function WorkspaceTopbar({ member }: WorkspaceTopbarProps) {
  const pathname = usePathname();
  const isSkillsCatalogRoute = pathname === "/skills";
  const isEditRoute = pathname.startsWith("/skills/") && pathname.endsWith("/edit");
  const showUploadAction = pathname !== "/upload" && !isEditRoute;
  const currentLabel =
    pageLabels.find((entry) => entry.match(pathname))?.label ?? "Workspace";

  if (isSkillsCatalogRoute) {
    return <SkillsTopbar member={member} />;
  }

  return (
    <Panel padding="md" tone="subtle" className="overflow-visible sm:px-5 sm:py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TopbarLogo subtitle={currentLabel} />

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:shrink-0">
          {showUploadAction ? (
            <Button asChild size="medium" className="w-full sm:w-auto">
              <Link href="/upload">Upload skill</Link>
            </Button>
          ) : null}
          <SkillsAccountMenu member={member} />
        </div>
      </div>
    </Panel>
  );
}
