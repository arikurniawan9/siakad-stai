"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { COOKIE_NAME, getResolvedSessionUser, getUserByCredential } from "@/lib/auth";
import { getDefaultRolePath } from "@/lib/navigation";
import { withToastParams } from "@/lib/toast-query";
import { loginSchema } from "@/lib/validators";
import { createClient } from "@/supabase/server";
import type { UserRole } from "@/types/domain";

export type LoginActionState = {
  error: string | null;
};

export async function loginAction(_: LoginActionState, formData: FormData) {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Input tidak valid",
    };
  }

  const { identifier, password } = parsed.data;
  const demoUser = await getUserByCredential(identifier, password);

  if (!demoUser) {
    return {
      error: "Kredensial tidak cocok dengan akun demo lokal.",
    };
  }

  const supabase = await createClient();

  if (supabase) {
    const { error } = await supabase.auth.signInWithPassword({
      email: demoUser.email,
      password,
    });

    if (error) {
      return {
        error: "Login Supabase gagal. Periksa sinkronisasi akun demo.",
      };
    }
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(demoUser), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  redirect(
    withToastParams(getDefaultRolePath(demoUser.role), {
      variant: "success",
      title: "Login berhasil",
      message: `Selamat datang, ${demoUser.name}.`,
    }),
  );
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);

  const supabase = await createClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect(
    withToastParams("/login", {
      variant: "info",
      title: "Anda sudah keluar",
      message: "Sesi login berhasil diakhiri.",
    }),
  );
}

export async function switchActiveRoleAction(formData: FormData) {
  const requestedRole = `${formData.get("role") ?? ""}`.trim() as UserRole;
  const redirectTo = `${formData.get("redirectTo") ?? ""}`.trim();
  const sessionUser = await getResolvedSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  if (!sessionUser.availableRoles.includes(requestedRole)) {
    redirect(
      withToastParams(redirectTo || getDefaultRolePath(sessionUser.role), {
        variant: "error",
        title: "Role tidak tersedia",
        message: "Role yang dipilih tidak dimiliki oleh akun ini.",
      }),
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(
    COOKIE_NAME,
    JSON.stringify({
      ...sessionUser,
      role: requestedRole,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    },
  );

  redirect(
    withToastParams(redirectTo || getDefaultRolePath(requestedRole), {
      variant: "success",
      title: "Role aktif diperbarui",
      message: `Workspace sekarang memakai role ${requestedRole}.`,
    }),
  );
}
