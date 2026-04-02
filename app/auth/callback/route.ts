import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureOrgMemberRow } from "@/lib/auth";
import { getSafeNextPath, isCarsEmail } from "@/lib/auth-utils";

function buildRedirect(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return buildRedirect(
      request,
      "/login?error=Missing%20auth%20code.%20Please%20start%20Google%20sign-in%20again.",
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return buildRedirect(request, `/login?error=${encodeURIComponent(error.message)}`);
  }

  const email = data.user?.email?.trim().toLowerCase() ?? "";

  if (!isCarsEmail(email)) {
    await supabase.auth.signOut();
    return buildRedirect(
      request,
      "/login?error=Only%20%40cars24.com%20email%20addresses%20may%20access%20Skill%20Share.",
    );
  }

  const userId = data.user?.id;

  if (!userId) {
    await supabase.auth.signOut();
    return buildRedirect(request, "/login?error=Unable%20to%20verify%20your%20account.");
  }

  const member = await ensureOrgMemberRow(supabase, userId, email);

  if (!member) {
    await supabase.auth.signOut();
    return buildRedirect(
      request,
      "/login?error=Your%20account%20could%20not%20be%20added%20to%20org_members.%20Ask%20an%20admin%20for%20help.",
    );
  }

  if (!member.is_active) {
    await supabase.auth.signOut();
    return buildRedirect(
      request,
      "/login?error=Your%20org_members%20row%20is%20inactive.%20Ask%20an%20admin%20to%20restore%20access.",
    );
  }

  return buildRedirect(request, next);
}
