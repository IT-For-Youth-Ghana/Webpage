import type { Metadata } from "next";

import { DepartmentsIndexPage } from "@/components/departments/departments-index-page";
import { getCmsDepartments } from "@/lib/cms/departments";
import { pageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Departments",
  description:
    "Explore the departments behind IT For Youth Ghana's programmes, partnerships, outreach, operations, impact, communications, and people systems.",
  path: "/departments",
});

export default async function DepartmentsPage() {
  const departments = await getCmsDepartments();

  return <DepartmentsIndexPage departments={departments} />;
}
