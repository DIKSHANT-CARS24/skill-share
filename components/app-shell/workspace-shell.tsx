"use client";

import { WorkspaceTopbar } from "@/components/app-shell/workspace-topbar";

interface WorkspaceMember {
  user_id: string;
  email: string;
  role: "member" | "admin";
  is_active: boolean;
  created_at: string;
}

export function WorkspaceShell({
  children,
  member,
}: {
  children: React.ReactNode;
  member: WorkspaceMember;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <WorkspaceTopbar member={member} />
        <main className="flex-1 pt-5">{children}</main>
      </div>
    </div>
  );
}
