export type UserRole =
  | "Admin"
  | "Prodi"
  | "Dosen"
  | "Mahasiswa"
  | "Staff"
  | "Keuangan"
  | "Pimpinan";

export type DashboardMetric = {
  label: string;
  value: string;
  change: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  role: UserRole | "Semua";
  createdAt: string;
};

export type BillingItem = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: "Lunas" | "Belum Lunas" | "Dispensasi";
};

export type KrsCourse = {
  code: string;
  name: string;
  sks: number;
  className: string;
  lecturer: string;
  schedule: string;
  room: string;
  seatsLeft: number;
  prerequisite?: string;
};

export type SidebarItem = {
  href: string;
  label: string;
  roles: UserRole[];
};

export type LoginState = {
  error?: string;
};

export type SessionUser = {
  id: string;
  name: string;
  identifier: string;
  role: UserRole;
  email: string;
};
