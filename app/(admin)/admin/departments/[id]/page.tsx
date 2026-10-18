import { notFound } from "next/navigation";

import { DepartmentForm } from "@/components/admin/department-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getCmsDepartmentById } from "@/lib/cms/departments";

type AdminEditDepartmentPageProps = {
  params: { id: string };
};

export default async function AdminEditDepartmentPage({ params }: AdminEditDepartmentPageProps) {
  const department = await getCmsDepartmentById(params.id);

  if (!department) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Organisation"
        title={`Edit department: ${department.title}`}
        description="Update the department's public page, operating model, team links, resources, and visibility."
      />

      <DepartmentForm mode="edit" department={department} />
    </div>
  );
}
