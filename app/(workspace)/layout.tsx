import { requireActiveMember } from "@/lib/auth";
import { WorkspaceShell } from "@/components/app-shell/workspace-shell";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await requireActiveMember();

  return <WorkspaceShell member={context.member}>{children}</WorkspaceShell>;
}
