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

export const academicYearSchema = z
  .object({
    kode: z.string().trim().min(2, "Kode wajib diisi"),
    nama: z.string().trim().min(3, "Nama periode wajib diisi"),
    semester: z.enum(["Ganjil", "Genap", "Pendek"], {
      error: "Semester tidak valid",
    }),
    tanggalMulai: z.string().min(1, "Tanggal mulai wajib diisi"),
    tanggalSelesai: z.string().min(1, "Tanggal selesai wajib diisi"),
    isAktif: z.boolean(),
    isKrsOpen: z.boolean(),
  })
  .refine((value) => value.tanggalSelesai >= value.tanggalMulai, {
    message: "Tanggal selesai harus sesudah tanggal mulai",
    path: ["tanggalSelesai"],
  });

export const facultySchema = z.object({
  kode: z.string().trim().min(2, "Kode fakultas wajib diisi"),
  nama: z.string().trim().min(3, "Nama fakultas wajib diisi"),
  dekan: z.string().trim().max(120, "Nama dekan maksimal 120 karakter").optional().or(z.literal("")),
  deskripsi: z.string().trim().max(300, "Deskripsi maksimal 300 karakter").optional().or(z.literal("")),
  isAktif: z.boolean(),
});

export const studyProgramSchema = z.object({
  kode: z.string().trim().min(2, "Kode program studi wajib diisi"),
  nama: z.string().trim().min(3, "Nama program studi wajib diisi"),
  jenjang: z.string().trim().min(2, "Jenjang wajib diisi"),
  fakultasId: z.string().trim().min(1, "Fakultas wajib dipilih"),
  isAktif: z.boolean(),
});
