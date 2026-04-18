import "server-only";

import { createAdminClient } from "@/supabase/admin";

type ProgramStudiRow = {
  id: string;
  kode: string;
  nama: string;
  jenjang: string;
  is_active: boolean;
  updated_at: string;
};

type FakultasRow = {
  id: string;
  kode: string;
  nama: string;
  dekan: string | null;
  deskripsi: string | null;
  is_active: boolean;
  updated_at: string;
};

type TahunAkademikRow = {
  id: string;
  kode: string;
  nama: string;
  semester: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  is_aktif: boolean;
  is_krs_open: boolean;
};

type UserRow = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
};

type MataKuliahRow = {
  id: string;
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  jenis: string;
  is_active: boolean;
  program_studi: {
    kode: string;
    nama: string;
  } | null;
};

type DosenRow = {
  id: string;
  nidn: string | null;
  status_dosen: string;
  users: null | {
    full_name: string;
    email: string;
  };
  program_studi: null | {
    kode: string;
    nama: string;
  };
};

type MahasiswaRow = {
  id: string;
  nim: string | null;
  angkatan: number;
  status_mahasiswa: string;
  ips: number;
  ipk: number;
  users: null | {
    full_name: string;
  };
  program_studi: {
    kode: string;
    nama: string;
  } | null;
};

type DosenQueryRow = {
  id: string;
  nidn: string | null;
  status_dosen: string;
  users: Array<{
    full_name: string;
    email: string;
  }> | null;
  program_studi: Array<{
    kode: string;
    nama: string;
  }> | null;
};

type MahasiswaQueryRow = {
  id: string;
  nim: string | null;
  angkatan: number;
  status_mahasiswa: string;
  ips: number;
  ipk: number;
  users: Array<{
    full_name: string;
  }> | null;
  program_studi: Array<{
    kode: string;
    nama: string;
  }> | null;
};

type MataKuliahQueryRow = {
  id: string;
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  jenis: string;
  is_active: boolean;
  program_studi: Array<{
    kode: string;
    nama: string;
  }> | null;
};

export type MasterDataSnapshot = {
  counts: {
    users: number;
    fakultas: number;
    programStudi: number;
    mataKuliah: number;
    dosen: number;
    mahasiswa: number;
    tahunAkademik: number;
  };
  fakultas: FakultasRow[];
  programStudi: ProgramStudiRow[];
  mataKuliah: MataKuliahRow[];
  tahunAkademik: TahunAkademikRow[];
  users: UserRow[];
  dosen: DosenRow[];
  mahasiswa: MahasiswaRow[];
  error: string | null;
};

const emptySnapshot: MasterDataSnapshot = {
  counts: {
    users: 0,
    fakultas: 0,
    programStudi: 0,
    mataKuliah: 0,
    dosen: 0,
    mahasiswa: 0,
    tahunAkademik: 0,
  },
  fakultas: [],
  programStudi: [],
  mataKuliah: [],
  tahunAkademik: [],
  users: [],
  dosen: [],
  mahasiswa: [],
  error: null,
};

export async function getMasterDataSnapshot(): Promise<MasterDataSnapshot> {
  const supabase = createAdminClient();

  if (!supabase) {
    return {
      ...emptySnapshot,
      error: "Konfigurasi service role Supabase belum tersedia di server.",
    };
  }

  const [
    usersCountResult,
    fakultasCountResult,
    programStudiCountResult,
    mataKuliahCountResult,
    dosenCountResult,
    mahasiswaCountResult,
    tahunAkademikCountResult,
    fakultasResult,
    programStudiResult,
    mataKuliahResult,
    tahunAkademikResult,
    usersResult,
    dosenResult,
    mahasiswaResult,
  ] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("fakultas").select("id", { count: "exact", head: true }),
    supabase.from("program_studi").select("id", { count: "exact", head: true }),
    supabase.from("mata_kuliah").select("id", { count: "exact", head: true }),
    supabase.from("dosen").select("id", { count: "exact", head: true }),
    supabase.from("mahasiswa").select("id", { count: "exact", head: true }),
    supabase.from("tahun_akademik").select("id", { count: "exact", head: true }),
    supabase
      .from("fakultas")
      .select("id, kode, nama, dekan, deskripsi, is_active, updated_at")
      .order("updated_at", { ascending: false })
      .limit(8),
    supabase
      .from("program_studi")
      .select("id, kode, nama, jenjang, is_active, updated_at")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(8),
    supabase
      .from("mata_kuliah")
      .select("id, kode, nama, sks, semester, jenis, is_active, program_studi!mata_kuliah_prodi_id_fkey(kode, nama)")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(8),
    supabase
      .from("tahun_akademik")
      .select("id, kode, nama, semester, tanggal_mulai, tanggal_selesai, is_aktif, is_krs_open")
      .order("tanggal_mulai", { ascending: false })
      .limit(6),
    supabase
      .from("users")
      .select("id, full_name, email, role, is_active, created_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("dosen")
      .select("id, nidn, status_dosen, users!dosen_user_id_fkey(full_name, email), program_studi!dosen_homebase_prodi_id_fkey(kode, nama)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("mahasiswa")
      .select("id, nim, angkatan, status_mahasiswa, ips, ipk, users!mahasiswa_user_id_fkey(full_name), program_studi!mahasiswa_prodi_id_fkey(kode, nama)")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const errors = [
    usersCountResult.error,
    fakultasCountResult.error,
    programStudiCountResult.error,
    mataKuliahCountResult.error,
    dosenCountResult.error,
    mahasiswaCountResult.error,
    tahunAkademikCountResult.error,
    fakultasResult.error,
    programStudiResult.error,
    mataKuliahResult.error,
    tahunAkademikResult.error,
    usersResult.error,
    dosenResult.error,
    mahasiswaResult.error,
  ].filter(Boolean);

  const dosenRows = ((dosenResult.data ?? []) as DosenQueryRow[]).map((item) => ({
    id: item.id,
    nidn: item.nidn,
    status_dosen: item.status_dosen,
    users: item.users?.[0] ?? null,
    program_studi: item.program_studi?.[0] ?? null,
  }));

  const mahasiswaRows = ((mahasiswaResult.data ?? []) as MahasiswaQueryRow[]).map((item) => ({
    id: item.id,
    nim: item.nim,
    angkatan: item.angkatan,
    status_mahasiswa: item.status_mahasiswa,
    ips: item.ips,
    ipk: item.ipk,
    users: item.users?.[0] ?? null,
    program_studi: item.program_studi?.[0] ?? null,
  }));

  const mataKuliahRows = ((mataKuliahResult.data ?? []) as MataKuliahQueryRow[]).map((item) => ({
    id: item.id,
    kode: item.kode,
    nama: item.nama,
    sks: item.sks,
    semester: item.semester,
    jenis: item.jenis,
    is_active: item.is_active,
    program_studi: item.program_studi?.[0] ?? null,
  }));

  return {
    counts: {
      users: usersCountResult.count ?? 0,
      fakultas: fakultasCountResult.count ?? 0,
      programStudi: programStudiCountResult.count ?? 0,
      mataKuliah: mataKuliahCountResult.count ?? 0,
      dosen: dosenCountResult.count ?? 0,
      mahasiswa: mahasiswaCountResult.count ?? 0,
      tahunAkademik: tahunAkademikCountResult.count ?? 0,
    },
    fakultas: (fakultasResult.data ?? []) as FakultasRow[],
    programStudi: (programStudiResult.data ?? []) as ProgramStudiRow[],
    mataKuliah: mataKuliahRows,
    tahunAkademik: (tahunAkademikResult.data ?? []) as TahunAkademikRow[],
    users: (usersResult.data ?? []) as UserRow[],
    dosen: dosenRows,
    mahasiswa: mahasiswaRows,
    error: errors[0]?.message ?? null,
  };
}
