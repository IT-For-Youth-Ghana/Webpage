import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DepartmentDetailPage } from "@/components/departments/department-detail-page";
import {
  getCmsDepartmentBySlug,
  getCmsDepartments,
} from "@/lib/cms/departments";
import { getCmsTeamMembers } from "@/lib/cms/team";
import { pageMetadata } from "@/lib/seo/page-metadata";

type DepartmentPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const departments = await getCmsDepartments();
  return departments.map((department) => ({ slug: department.slug }));
}

export async function generateMetadata({ params }: DepartmentPageProps): Promise<Metadata> {
  const department = await getCmsDepartmentBySlug(params.slug);

  const path = `/departments/${params.slug}`;

  if (!department) {
    return pageMetadata({
      title: "Department not found",
      description: "This department does not exist.",
      path,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: department.title,
    description: department.summary || department.description,
    path,
    image: department.heroImage,
  });
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const [department, teamMembers] = await Promise.all([
    getCmsDepartmentBySlug(params.slug),
    getCmsTeamMembers(),
  ]);

  if (!department) {
    notFound();
  }

  return <DepartmentDetailPage department={department} teamMembers={teamMembers} />;
}
