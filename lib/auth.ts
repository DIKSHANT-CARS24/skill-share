import { redirect, unauthorized } from "next/navigation";
import type { JwtPayload, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import {
  getDisplayNameFromEmail,
  getInitialsFromEmail,
  getSafeNextPath,
  isCarsEmail,
  DEFAULT_SIGN_IN_REDIRECT_PATH,
} from "@/lib/auth-utils";

export type OrgRole = "member" | "admin";

export interface OrgMemberRecord {
  user_id: string;
  email: string;
  role: OrgRole;
  is_active: boolean;
  created_at: string;
}

export interface AuthenticatedMemberContext {
  supabase: SupabaseClient;
  claims: JwtPayload;
  userId: string;
  email: string;
  member: OrgMemberRecord;
}

export {
  getDisplayNameFromEmail,
  getInitialsFromEmail,
  getSafeNextPath,
  isCarsEmail,
  DEFAULT_SIGN_IN_REDIRECT_PATH,
};

async function getClaims(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  return data.claims;
}

export async function ensureOrgMemberRow(supabase: SupabaseClient, userId: string, email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isCarsEmail(normalizedEmail)) {
    return null;
  }

  const { error } = await supabase.from("org_members").upsert(
    {
      user_id: userId,
      email: normalizedEmail,
    },
    {
      onConflict: "user_id",
      ignoreDuplicates: true,
    },
  );

  if (error) {
    return null;
  }

  const { data } = await supabase
    .from("org_members")
    .select("user_id, email, role, is_active, created_at")
    .eq("user_id", userId)
    .maybeSingle<OrgMemberRecord>();

  return data ?? null;
}

export async function getOptionalMemberContext() {
  const supabase = await createClient();
  const claims = await getClaims(supabase);

  if (!claims?.sub) {
    return null;
  }

  const emailClaim = claims.email;
  const email = typeof emailClaim === "string" ? emailClaim.trim().toLowerCase() : "";

  if (!email || !isCarsEmail(email)) {
    return {
      supabase,
      claims,
      userId: claims.sub,
      email,
      member: null,
      access: "invalid-domain" as const,
    };
  }

  const member =
    (await ensureOrgMemberRow(supabase, claims.sub, email)) ??
    (await supabase
      .from("org_members")
      .select("user_id, email, role, is_active, created_at")
      .eq("user_id", claims.sub)
      .maybeSingle<OrgMemberRecord>()).data ??
    null;

  if (!member) {
    return {
      supabase,
      claims,
      userId: claims.sub,
      email,
      member: null,
      access: "missing-member" as const,
    };
  }

  if (!member.is_active) {
    return {
      supabase,
      claims,
      userId: claims.sub,
      email,
      member,
      access: "inactive-member" as const,
    };
  }

  return {
    supabase,
    claims,
    userId: claims.sub,
    email,
    member,
    access: "granted" as const,
  };
}

export async function requireActiveMember() {
  const context = await getOptionalMemberContext();

  if (!context) {
    redirect("/login");
  }

  if (context.access !== "granted") {
    unauthorized();
  }

  return context satisfies AuthenticatedMemberContext;
}

export async function requireAdmin() {
  const context = await requireActiveMember();

  if (context.member.role !== "admin") {
    unauthorized();
  }

  return context;
}
