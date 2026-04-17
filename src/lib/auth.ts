import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { demoUsers } from "@/lib/constants";
import type { SessionUser, UserRole } from "@/types/domain";

const COOKIE_NAME = "siakad_session";

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export async function requireUser(allowedRoles?: UserRole[]) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }

  return user;
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
