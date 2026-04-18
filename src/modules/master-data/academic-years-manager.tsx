"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Bolt, Download, FileUp, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  deleteAcademicYearAction,
  importAcademicYearsAction,
  saveAcademicYearAction,
  setActiveAcademicYearAction,
  type AcademicYearActionState,
} from "@/actions/academic-years";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { useActionToast } from "@/lib/use-action-toast";
import type { AcademicYearRow } from "@/lib/admin/academic-years";

type AcademicYearsManagerProps = {
  items: AcademicYearRow[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  query: string;
};

const initialState: AcademicYearActionState = {
  success: false,
  message: null,
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function buildPageLink(page: number, query: string) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "?";
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="min-w-28">
      {pending ? "Menyimpan..." : children}
    </Button>
  );
}

function ImportSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="min-w-28">
      {pending ? "Mengimport..." : "Import CSV"}
    </Button>
  );
}

function ModalShell({
  open,
  title,
  description,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/55 p-3 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/50 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-[0_28px_70px_rgba(15,23,42,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <p className="text-sm text-slate-500">{description}</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-950">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}

function AcademicYearFormModal({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: AcademicYearRow | null;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(saveAcademicYearAction, initialState);
  useActionToast(state, item ? "Perubahan disimpan" : "Tahun akademik ditambahkan");

  useEffect(() => {
    if (!state.success) {
      return;
    }

    onClose();
    router.refresh();
  }, [onClose, router, state.success]);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={item ? "Edit Tahun Akademik" : "Tambah Tahun Akademik"}
      description="Form modal responsif untuk kelola periode akademik"
    >
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="id" value={item?.id ?? ""} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Kode</label>
            <Input name="kode" defaultValue={item?.kode ?? ""} placeholder="2026-GANJIL" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Semester</label>
            <select
              name="semester"
              defaultValue={item?.semester ?? "Ganjil"}
              className="h-10 w-full rounded-lg border border-black/10 bg-white px-3.5 text-[0.92rem] outline-none transition focus:border-[var(--primary)]"
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
              <option value="Pendek">Pendek</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800">Nama Periode</label>
          <Input name="nama" defaultValue={item?.nama ?? ""} placeholder="Tahun Akademik 2026/2027" required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Tanggal Mulai</label>
            <Input name="tanggalMulai" type="date" defaultValue={item?.tanggal_mulai ?? ""} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-800">Tanggal Selesai</label>
            <Input name="tanggalSelesai" type="date" defaultValue={item?.tanggal_selesai ?? ""} required />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              type="checkbox"
              name="isAktif"
              defaultChecked={item?.is_aktif ?? false}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--primary)]"
            />
            <span>
              <span className="block font-semibold text-slate-900">Periode aktif</span>
              <span className="mt-1 block text-sm text-slate-500">Tandai jika ini periode akademik utama.</span>
            </span>
          </label>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              type="checkbox"
              name="isKrsOpen"
              defaultChecked={item?.is_krs_open ?? false}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--primary)]"
            />
            <span>
              <span className="block font-semibold text-slate-900">KRS dibuka</span>
              <span className="mt-1 block text-sm text-slate-500">Aktifkan saat mahasiswa boleh melakukan KRS.</span>
            </span>
          </label>
        </div>

        {state.message ? (
          <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${state.success ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>
            {state.message}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Form dibuat ringkas agar nyaman dipakai di desktop maupun mobile.</p>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <SubmitButton>{item ? "Simpan perubahan" : "Tambah data"}</SubmitButton>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

function ImportAcademicYearsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(importAcademicYearsAction, initialState);
  useActionToast(state, "Import selesai");

  useEffect(() => {
    if (!state.success) {
      return;
    }

    onClose();
    router.refresh();
  }, [onClose, router, state.success]);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Import Tahun Akademik"
      description="Upload file CSV untuk menambah atau memperbarui data"
    >
      <form action={formAction} className="space-y-5">
        <div className="rounded-2xl border border-dashed border-cyan-200 bg-cyan-50/70 p-4 text-sm leading-6 text-cyan-950">
          Format header:
          <code className="mt-2 block rounded-xl bg-white px-3 py-2 text-xs text-slate-700">
            kode,nama,semester,tanggal_mulai,tanggal_selesai,is_aktif,is_krs_open
          </code>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-800">File CSV</label>
          <Input name="file" type="file" accept=".csv,text/csv" required className="h-12 py-2.5" />
        </div>

        {state.message ? (
          <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${state.success ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>
            {state.message}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Import akan melakukan update berdasarkan kolom kode jika data sudah ada.</p>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Tutup
            </Button>
            <ImportSubmitButton />
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

function ActivateAcademicYearModal({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: AcademicYearRow | null;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(setActiveAcademicYearAction, initialState);
  useActionToast(state, "Status periode diperbarui");

  useEffect(() => {
    if (!state.success) {
      return;
    }

    onClose();
    router.refresh();
  }, [onClose, router, state.success]);

  if (!item) {
    return null;
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={item.is_aktif ? "Pengaturan Periode Aktif" : "Aktifkan Tahun Akademik"}
      description="Konfirmasi aktivasi periode dan pengaturan akses KRS"
    >
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="id" value={item.id} />

        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/75 p-4">
          <p className="text-sm text-cyan-900">
            {item.is_aktif ? "Periode ini sedang aktif. Anda bisa mengatur status KRS dari sini:" : "Anda akan mengaktifkan periode berikut:"}
          </p>
          <h4 className="mt-2 text-lg font-semibold text-slate-950">{item.nama}</h4>
          <p className="mt-1 text-sm text-slate-600">
            {item.kode} | {item.semester}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {item.is_aktif
              ? "Jika KRS diubah, perubahan akan langsung diterapkan pada periode aktif ini."
              : "Saat dikonfirmasi, periode aktif sebelumnya akan otomatis dinonaktifkan."}
          </p>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            name="openKrs"
            value="true"
            defaultChecked={item.is_krs_open}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--primary)]"
          />
          <span>
            <span className="block font-semibold text-slate-900">{item.is_aktif ? "Status KRS periode aktif" : "Sekaligus buka KRS"}</span>
            <span className="mt-1 block text-sm text-slate-500">
              {item.is_aktif
                ? "Centang untuk membuka KRS. Kosongkan untuk menutup KRS pada periode aktif ini."
                : "Jika dipilih, periode ini akan langsung menjadi periode aktif dan KRS juga dibuka."}
            </span>
          </span>
        </label>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Gunakan konfirmasi ini agar operator tidak salah mengaktifkan periode.</p>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" onClick={onClose}>
              {item.is_aktif ? "Simpan" : "Aktifkan"}
            </Button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

function DeleteAcademicYearModal({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: AcademicYearRow | null;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(deleteAcademicYearAction, initialState);
  useActionToast(state, "Data berhasil dihapus");

  useEffect(() => {
    if (!state.success) {
      return;
    }

    onClose();
    router.refresh();
  }, [onClose, router, state.success]);

  if (!item) {
    return null;
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Hapus Tahun Akademik"
      description="Konfirmasi penghapusan periode akademik"
    >
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="id" value={item.id} />

        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4">
          <p className="text-sm text-rose-900">Data berikut akan dihapus:</p>
          <h4 className="mt-2 text-lg font-semibold text-slate-950">{item.nama}</h4>
          <p className="mt-1 text-sm text-slate-600">
            {item.kode} | {item.semester}
          </p>
          <p className="mt-2 text-sm text-slate-500">Tindakan ini tidak bisa dibatalkan dari tampilan ini.</p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">Gunakan modal konfirmasi ini agar operator tidak salah menghapus data.</p>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
              Hapus
            </Button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

export function AcademicYearsManager({
  items,
  totalItems,
  totalPages,
  currentPage,
  query,
}: AcademicYearsManagerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(query);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AcademicYearRow | null>(null);
  const [activatingItem, setActivatingItem] = useState<AcademicYearRow | null>(null);
  const [deletingItem, setDeletingItem] = useState<AcademicYearRow | null>(null);

  const exportHref = useMemo(() => {
    const params = new URLSearchParams();

    if (query) {
      params.set("q", query);
    }

    const qs = params.toString();
    return `/dashboard/master-data/tahun-akademik/export${qs ? `?${qs}` : ""}`;
  }, [query]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("q", search.trim());
    } else {
      params.delete("q");
    }

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function openCreateModal() {
    setEditingItem(null);
    setFormOpen(true);
  }

  function openEditModal(item: AcademicYearRow) {
    setEditingItem(item);
    setFormOpen(true);
  }

  function openActivateModal(item: AcademicYearRow) {
    setActivatingItem(item);
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Tahun Akademik</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => setImportOpen(true)}>
              <FileUp className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Link href={exportHref}>
              <Button type="button" variant="secondary">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </Link>
            <Button type="button" onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah data
            </Button>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="mt-5 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari kode, nama periode, atau semester..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Cari</Button>
            <Link href="/dashboard/master-data/tahun-akademik">
              <Button type="button" variant="secondary">
                Reset
              </Button>
            </Link>
          </div>
        </form>

        <div className="mt-5 overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH>Kode</TH>
                <TH>Nama</TH>
                <TH>Semester</TH>
                <TH>Rentang</TH>
                <TH>Status</TH>
                <TH className="w-[180px]">Aksi</TH>
              </TR>
            </THead>
            <TBody>
              {items.length === 0 ? (
                <TR>
                  <TD colSpan={6} className="py-10 text-center text-sm text-slate-500">
                    Belum ada data yang cocok dengan pencarian.
                  </TD>
                </TR>
              ) : (
                items.map((item) => (
                  <TR key={item.id} className="border-b border-black/5 last:border-b-0">
                    <TD className="font-mono text-xs text-slate-700">{item.kode}</TD>
                    <TD>
                      <p className="font-semibold text-slate-900">{item.nama}</p>
                      <p className="mt-1 text-xs text-slate-500">Update {formatDate(item.updated_at)}</p>
                    </TD>
                    <TD>{item.semester}</TD>
                    <TD className="text-slate-600">
                      {formatDate(item.tanggal_mulai)} - {formatDate(item.tanggal_selesai)}
                    </TD>
                    <TD>
                      <div className="flex flex-wrap gap-2">
                        {item.is_aktif ? <Badge>Aktif</Badge> : <Badge className="bg-slate-100 text-slate-700">Nonaktif</Badge>}
                        {item.is_krs_open ? <Badge>KRS Dibuka</Badge> : null}
                      </div>
                    </TD>
                    <TD>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => openActivateModal(item)}
                          className={`h-9 w-9 shrink-0 p-0 ${
                            item.is_aktif
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                          }`}
                          title={item.is_aktif ? "Atur periode aktif dan KRS" : "Aktifkan periode"}
                          aria-label={item.is_aktif ? `Atur ${item.nama}` : `Aktifkan ${item.nama}`}
                        >
                          <Bolt className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditModal(item)}
                          className="h-9 w-9 shrink-0 p-0"
                          title="Edit data"
                          aria-label={`Edit ${item.nama}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingItem(item)}
                          className="h-9 w-9 shrink-0 p-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          title="Hapus data"
                          aria-label={`Hapus ${item.nama}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">
            Menampilkan {items.length} dari {totalItems} data.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={buildPageLink(Math.max(1, currentPage - 1), query)}>
              <Button type="button" variant="secondary" size="sm" disabled={currentPage <= 1}>
                Sebelumnya
              </Button>
            </Link>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter((page) => Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages)
              .map((page, index, arr) => (
                <div key={page} className="flex items-center gap-2">
                  {index > 0 && arr[index - 1] !== page - 1 ? (
                    <span className="px-1 text-sm text-slate-400">...</span>
                  ) : null}
                  <Link href={buildPageLink(page, query)}>
                    <Button type="button" variant={page === currentPage ? "default" : "secondary"} size="sm">
                      {page}
                    </Button>
                  </Link>
                </div>
              ))}
            <Link href={buildPageLink(Math.min(totalPages, currentPage + 1), query)}>
              <Button type="button" variant="secondary" size="sm" disabled={currentPage >= totalPages}>
                Berikutnya
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <AcademicYearFormModal open={formOpen} onClose={() => setFormOpen(false)} item={editingItem} />
      <ImportAcademicYearsModal open={importOpen} onClose={() => setImportOpen(false)} />
      <ActivateAcademicYearModal open={Boolean(activatingItem)} onClose={() => setActivatingItem(null)} item={activatingItem} />
      <DeleteAcademicYearModal open={Boolean(deletingItem)} onClose={() => setDeletingItem(null)} item={deletingItem} />
    </div>
  );
}
