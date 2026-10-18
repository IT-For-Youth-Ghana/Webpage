import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentAdminUser } from "@/lib/cms/admin-auth";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    redirect("/admin-login");
  }

  return <AdminShell adminUser={adminUser}>{children}</AdminShell>;
}
