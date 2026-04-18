import "server-only";

import { createAdminClient } from "@/supabase/admin";
import {
  applyMenuOverrides,
  filterSidebarItemsByAccess,
  getAllMenuKeys,
  getDefaultMenuKeysForRole,
  menuDefinitions,
} from "@/lib/access-control";
import { roles } from "@/lib/constants";
import type { SidebarItem, UserRole } from "@/types/domain";

type RolePermissionRow = {
  menu_key: string;
  is_allowed: boolean;
};

type UserRoleRow = {
  role: UserRole;
};

export type ManagedUserRow = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  availableRoles: UserRole[];
};

export type RoleAccessContext = {
  resolvedRole: UserRole;
  allowedMenuKeys: string[];
  sidebarItems: SidebarItem[];
  roleOverrides: RolePermissionRow[];
};

export type AccountAccessPageData = {
  users: ManagedUserRow[];
  selectedUser: ManagedUserRow | null;
  selectedRole: UserRole;
  roleOverrides: RolePermissionRow[];
  allowedMenuKeys: string[];
  error: string | null;
};

function uniqueRoles(values: UserRole[]) {
  return Array.from(new Set(values)).filter((value): value is UserRole => roles.includes(value));
}

async function getUserRolesMap(userIds: string[]) {
  const supabase = createAdminClient();

  if (!supabase || userIds.length === 0) {
    return new Map<string, UserRole[]>();
  }

  const result = await supabase.from("user_roles").select("user_id, role").in("user_id", userIds);

  if (result.error?.code === "42P01") {
    return new Map<string, UserRole[]>();
  }

  const map = new Map<string, UserRole[]>();

  (result.data ?? []).forEach((row) => {
    const userId = `${row.user_id ?? ""}`;
    const role = row.role as UserRole;

    if (!userId || !roles.includes(role)) {
      return;
    }

    const current = map.get(userId) ?? [];
    current.push(role);
    map.set(userId, current);
  });

  return map;
}

async function getRolePermissionOverrides(role: UserRole) {
  const supabase = createAdminClient();

  if (!supabase) {
    return {
      data: [] as RolePermissionRow[],
      error: "Konfigurasi service role Supabase belum tersedia di server.",
    };
  }

  const result = await supabase
    .from("role_menu_permissions")
    .select("menu_key, is_allowed")
    .eq("role", role);

  if (result.error?.code === "42P01") {
    return {
      data: [] as RolePermissionRow[],
      error: null,
    };
  }

  return {
    data: (result.data ?? []) as RolePermissionRow[],
    error: result.error?.message ?? null,
  };
}

export async function getAssignedRoles(userId: string, fallbackRole: UserRole) {
  const supabase = createAdminClient();

  if (!supabase) {
    return [fallbackRole];
  }

  const result = await supabase.from("user_roles").select("role").eq("user_id", userId);

  if (result.error?.code === "42P01") {
    return [fallbackRole];
  }

  const assignedRoles = uniqueRoles(((result.data ?? []) as UserRoleRow[]).map((item) => item.role));
  return assignedRoles.length > 0 ? assignedRoles : [fallbackRole];
}

export async function getRoleAccessContext(role: UserRole): Promise<RoleAccessContext> {
  const permissionResult = await getRolePermissionOverrides(role);
  const allowedMenuKeys = Array.from(
    applyMenuOverrides(getDefaultMenuKeysForRole(role), permissionResult.data),
  );

  return {
    resolvedRole: role,
    allowedMenuKeys,
    sidebarItems: filterSidebarItemsByAccess(new Set(allowedMenuKeys)),
    roleOverrides: permissionResult.data,
  };
}

export async function getUserAccessContext(userId: string, fallbackRole: UserRole): Promise<RoleAccessContext> {
  const supabase = createAdminClient();

  if (!supabase) {
    return getRoleAccessContext(fallbackRole);
  }

  const userResult = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .is("deleted_at", null)
    .maybeSingle();

  const resolvedRole = roles.includes(userResult.data?.role as UserRole)
    ? (userResult.data?.role as UserRole)
    : fallbackRole;

  return getRoleAccessContext(resolvedRole);
}

export async function getManagedUserById(userId: string) {
  const supabase = createAdminClient();

  if (!supabase) {
    return null;
  }

  const result = await supabase
    .from("users")
    .select("id, full_name, email, role, is_active, created_at")
    .eq("id", userId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!result.data) {
    return null;
  }

  const availableRoles = await getAssignedRoles(result.data.id, result.data.role as UserRole);

  return {
    ...(result.data as Omit<ManagedUserRow, "availableRoles">),
    availableRoles,
  } satisfies ManagedUserRow;
}

export async function getAccountAccessPageData(selectedUserId?: string, selectedRoleParam?: string): Promise<AccountAccessPageData> {
  const supabase = createAdminClient();

  if (!supabase) {
    return {
      users: [],
      selectedUser: null,
      selectedRole: "Admin",
      roleOverrides: [],
      allowedMenuKeys: [],
      error: "Konfigurasi service role Supabase belum tersedia di server.",
    };
  }

  const usersResult = await supabase
    .from("users")
    .select("id, full_name, email, role, is_active, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const baseUsers = (usersResult.data ?? []) as Array<Omit<ManagedUserRow, "availableRoles">>;
  const rolesMap = await getUserRolesMap(baseUsers.map((item) => item.id));
  const users = baseUsers.map((item) => ({
    ...item,
    availableRoles: uniqueRoles([...(rolesMap.get(item.id) ?? []), item.role]),
  }));

  const selectedUser = users.find((item) => item.id === selectedUserId) ?? users[0] ?? null;
  const selectedRole = roles.includes(selectedRoleParam as UserRole)
    ? (selectedRoleParam as UserRole)
    : selectedUser?.role ?? "Admin";
  const accessContext = await getRoleAccessContext(selectedRole);

  return {
    users,
    selectedUser,
    selectedRole,
    roleOverrides: accessContext.roleOverrides,
    allowedMenuKeys: accessContext.allowedMenuKeys,
    error: usersResult.error?.message ?? null,
  };
}

export async function saveUserRoles(userId: string, activeRole: UserRole, selectedRoles: UserRole[]) {
  const supabase = createAdminClient();

  if (!supabase) {
    throw new Error("Konfigurasi service role Supabase belum tersedia di server.");
  }

  const assignedRoles = uniqueRoles(selectedRoles);

  if (assignedRoles.length === 0) {
    throw new Error("Pilih minimal satu role untuk pengguna.");
  }

  if (!assignedRoles.includes(activeRole)) {
    throw new Error("Role aktif harus termasuk dalam daftar role pengguna.");
  }

  const updateUserResult = await supabase.from("users").update({ role: activeRole }).eq("id", userId);

  if (updateUserResult.error) {
    throw new Error(updateUserResult.error.message);
  }

  const deleteResult = await supabase.from("user_roles").delete().eq("user_id", userId);

  if (deleteResult.error && deleteResult.error.code !== "42P01") {
    throw new Error(deleteResult.error.message);
  }

  const insertResult = await supabase.from("user_roles").insert(
    assignedRoles.map((role) => ({
      user_id: userId,
      role,
    })),
  );

  if (insertResult.error) {
    throw new Error(insertResult.error.message);
  }
}

export async function saveRoleAccessConfig(role: UserRole, selectedMenuKeys: string[]) {
  const supabase = createAdminClient();

  if (!supabase) {
    throw new Error("Konfigurasi service role Supabase belum tersedia di server.");
  }

  const menuKeys = getAllMenuKeys();
  const selected = new Set(selectedMenuKeys);
  const defaultKeys = getDefaultMenuKeysForRole(role);

  const overrides = menuKeys
    .filter((menuKey) => selected.has(menuKey) !== defaultKeys.has(menuKey))
    .map((menuKey) => ({
      role,
      menu_key: menuKey,
      is_allowed: selected.has(menuKey),
    }));

  const deleteResult = await supabase.from("role_menu_permissions").delete().eq("role", role);

  if (deleteResult.error && deleteResult.error.code !== "42P01") {
    throw new Error(deleteResult.error.message);
  }

  if (overrides.length === 0) {
    return;
  }

  const insertResult = await supabase.from("role_menu_permissions").insert(overrides);

  if (insertResult.error) {
    throw new Error(insertResult.error.message);
  }
}

export function getRoleAccessSummary(role: UserRole) {
  return menuDefinitions.filter((item) => item.roles.includes(role)).length;
}
