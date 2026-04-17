import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  {
    title: "Pendaftaran",
    body: "Calon mahasiswa mengisi biodata, upload berkas, dan memilih program studi.",
  },
  {
    title: "Verifikasi",
    body: "Staff mengecek dokumen, status tes, dan hasil seleksi secara terpusat.",
  },
  {
    title: "Generate NIM",
    body: "NIM dibangkitkan transaksional hanya satu kali per periode setelah lulus.",
  },
];

export function PmbWizard() {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Wizard PMB</p>
          <h3 className="text-xl font-semibold text-slate-900">Alur penerimaan mahasiswa baru</h3>
        </div>
        <Button>Tambah Pendaftar</Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-3xl bg-slate-50 p-5">
            <Badge>Step {index + 1}</Badge>
            <h4 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
