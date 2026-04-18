"use server";

import { revalidatePath } from "next/cache";

import { deleteStudyProgram, importStudyProgramsFromCsv, saveStudyProgram } from "@/lib/admin/study-programs";
import { requireAuthorizedUser } from "@/lib/auth";

export type StudyProgramActionState = {
  success: boolean;
  message: string | null;
};

const initialState: StudyProgramActionState = {
  success: false,
  message: null,
};

function toBool(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export async function saveStudyProgramAction(
  previousState: StudyProgramActionState = initialState,
  formData: FormData,
): Promise<StudyProgramActionState> {
  void previousState;
  await requireAuthorizedUser("master-data.program-studi");

  try {
    await saveStudyProgram(
      {
        kode: `${formData.get("kode") ?? ""}`.trim(),
        nama: `${formData.get("nama") ?? ""}`.trim(),
        jenjang: `${formData.get("jenjang") ?? ""}`.trim(),
        fakultasId: `${formData.get("fakultasId") ?? ""}`.trim(),
        isAktif: toBool(formData.get("isAktif")),
      },
      `${formData.get("id") ?? ""}`.trim() || undefined,
    );

    revalidatePath("/dashboard/master-data/program-studi");
    revalidatePath("/dashboard/master-data");
    return {
      success: true,
      message: "Data program studi berhasil disimpan.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menyimpan program studi.",
    };
  }
}

export async function deleteStudyProgramAction(
  previousState: StudyProgramActionState = initialState,
  formData: FormData,
): Promise<StudyProgramActionState> {
  void previousState;
  await requireAuthorizedUser("master-data.program-studi");

  const id = `${formData.get("id") ?? ""}`.trim();

  if (!id) {
    return {
      success: false,
      message: "Data program studi tidak valid.",
    } satisfies StudyProgramActionState;
  }

  try {
    await deleteStudyProgram(id);
    revalidatePath("/dashboard/master-data/program-studi");
    revalidatePath("/dashboard/master-data");

    return {
      success: true,
      message: "Data program studi berhasil dihapus.",
    } satisfies StudyProgramActionState;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus program studi.",
    } satisfies StudyProgramActionState;
  }
}

export async function importStudyProgramsAction(
  previousState: StudyProgramActionState = initialState,
  formData: FormData,
): Promise<StudyProgramActionState> {
  void previousState;
  await requireAuthorizedUser("master-data.program-studi");

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      success: false,
      message: "File CSV belum dipilih.",
    };
  }

  try {
    const content = await file.text();
    const result = await importStudyProgramsFromCsv(content);

    revalidatePath("/dashboard/master-data/program-studi");
    revalidatePath("/dashboard/master-data");
    return {
      success: true,
      message: `${result.imported} data program studi berhasil diimport.`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal mengimport program studi.",
    };
  }
}
