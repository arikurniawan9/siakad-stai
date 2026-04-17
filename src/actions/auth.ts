"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { COOKIE_NAME, getUserByCredential } from "@/lib/auth";
import { getDefaultRolePath } from "@/lib/navigation";
import { loginSchema } from "@/lib/validators";
import { createClient } from "@/supabase/server";

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

  redirect(getDefaultRolePath(demoUser.role));
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);

  const supabase = await createClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/login");
}
