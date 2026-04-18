import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getAssignedRoles, getUserAccessContext } from "@/lib/admin/access-control";
import { demoUsers } from "@/lib/constants";
import { createAdminClient } from "@/supabase/admin";
import type { SessionUser, UserRole } from "@/types/domain";

const COOKIE_NAME = "siakad_session";

function normalizeSessionUser(user: SessionUser): SessionUser {
  const availableRoles = Array.isArray(user.availableRoles) && user.availableRoles.length > 0
    ? user.availableRoles
    : [user.role];

  return {
    ...user,
    availableRoles,
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;

  if (!raw) {
    return null;
  }

  try {
    return normalizeSessionUser(JSON.parse(raw) as SessionUser);
  } catch {
    return null;
  }
}

export async function getResolvedSessionUser(): Promise<SessionUser | null> {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  const supabase = createAdminClient();

  if (!supabase) {
    return normalizeSessionUser(user);
  }

  const result = await supabase
    .from("users")
    .select("full_name, email, role, is_active")
    .eq("id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!result.data || result.data.is_active === false) {
    return normalizeSessionUser(user);
  }

  const availableRoles = await getAssignedRoles(user.id, result.data.role as UserRole);
  const requestedRole = availableRoles.includes(user.role) ? user.role : null;
  const resolvedRole = requestedRole ?? (availableRoles.includes(result.data.role as UserRole)
    ? (result.data.role as UserRole)
    : availableRoles[0]);

  return {
    ...normalizeSessionUser(user),
    name: result.data.full_name,
    email: result.data.email,
    role: resolvedRole,
    availableRoles,
  };
}

export async function requireUser(allowedRoles?: UserRole[]) {
  const user = await getResolvedSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }

  return user;
}

export async function requireAuthorizedUser(menuKey: string, ...legacyArgs: unknown[]) {
  void legacyArgs;
  const user = await requireUser();
  const access = await getUserAccessContext(user.id, user.role);

  if (!access.allowedMenuKeys.includes(menuKey)) {
    redirect("/dashboard");
  }

  return {
    ...user,
    role: access.resolvedRole,
  };
}

export async function getUserByCredential(identifier: string, password: string) {
  const normalized = identifier.trim().toLowerCase();

  return (
    Object.values(demoUsers).find(
      (user) =>
        (user.identifier === normalized || user.email === normalized) &&
        user.password === password,
    ) ?? null
  );
}

export { COOKIE_NAME };
