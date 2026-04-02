import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureOrgMemberRow } from "@/lib/auth";
import { getSafeNextPath, isCarsEmail } from "@/lib/auth-utils";

function buildRedirect(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

async function rejectAccess(request: NextRequest, reason: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return buildRedirect(request, `/unauthorized?reason=${encodeURIComponent(reason)}`);
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
    return buildRedirect(request, "/unauthorized?reason=domain");
  }

  const userId = data.user?.id;

  if (!userId) {
    await supabase.auth.signOut();
    return buildRedirect(request, "/login?error=Unable%20to%20verify%20your%20account.");
  }

  const member = await ensureOrgMemberRow(supabase, userId, email);

  if (!member) {
    return rejectAccess(request, "missing-member");
  }

  if (!member.is_active) {
    return rejectAccess(request, "inactive-member");
  }

  return buildRedirect(request, next);
}
