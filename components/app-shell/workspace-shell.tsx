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
    <div className="relative min-h-screen overflow-hidden bg-transparent">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-9rem] top-[-7rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(71,54,254,0.22)_0%,rgba(71,54,254,0.08)_42%,transparent_70%)] blur-3xl" />
        <div className="absolute right-[-7rem] top-[14%] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(255,182,221,0.22)_0%,rgba(255,182,221,0.08)_40%,transparent_72%)] blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[28%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(184,204,255,0.26)_0%,rgba(184,204,255,0.08)_46%,transparent_74%)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <WorkspaceTopbar member={member} />
        <main className="flex-1 pt-5">{children}</main>
      </div>
    </div>
  );
}
