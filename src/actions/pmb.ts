"use server";

import { pmbRegistrationSchema } from "@/lib/validators";

export type PmbRegistrationState = {
  error: string | null;
  success: null | {
    registrationNumber: string;
    fullName: string;
    program: string;
    email: string;
  };
};

function createRegistrationNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, "0");
  const d = `${now.getDate()}`.padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);

  return `PMB-${y}${m}${d}-${random}`;
}

export async function registerPmbAction(_: PmbRegistrationState, formData: FormData) {
  const parsed = pmbRegistrationSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    program: formData.get("program"),
    educationLevel: formData.get("educationLevel"),
    schoolName: formData.get("schoolName"),
    city: formData.get("city"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Form pendaftaran tidak valid",
      success: null,
    };
  }

  const registrationNumber = createRegistrationNumber();

  return {
    error: null,
    success: {
      registrationNumber,
      fullName: parsed.data.fullName,
      program: parsed.data.program,
      email: parsed.data.email,
    },
  };
}
