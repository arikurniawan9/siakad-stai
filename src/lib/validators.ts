import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(3, "Email atau username wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const pmbRegistrationSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap wajib diisi"),
  email: z.email("Email tidak valid"),
  phone: z
    .string()
    .min(10, "Nomor WhatsApp minimal 10 digit")
    .regex(/^[0-9+\-\s]+$/, "Nomor WhatsApp hanya boleh berisi angka"),
  program: z.string().min(1, "Program studi wajib dipilih"),
  educationLevel: z.string().min(1, "Jenjang pendidikan wajib dipilih"),
  schoolName: z.string().min(3, "Asal sekolah wajib diisi"),
  city: z.string().min(2, "Kota asal wajib diisi"),
  notes: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
});
