import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { getCmsTestimonials } from "@/lib/cms/testimonials";
import type { Testimonial } from "@/components/home/testimonials-section";
import type { AdminMetric, AdminTableColumn } from "@/types/admin";

const testimonialColumns: AdminTableColumn<Testimonial>[] = [
  {
    key: "name",
    label: "Story",
    render: (testimonial) => (
      <div>
        <p className="font-bold text-slate-950">{testimonial.name}</p>
        <p className="mt-1 text-sm text-slate-600">{testimonial.role}</p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{testimonial.quote}</p>
      </div>
    ),
  },
  {
    key: "programme",
    label: "Programme",
    render: (testimonial) => (
      <span className="text-sm font-semibold text-slate-700">
        {testimonial.programme ?? "General"}
      </span>
    ),
  },
  {
    key: "active",
    label: "Status",
    render: (testimonial) => (
      <AdminStatusPill status={testimonial.active === false ? "draft" : "published"} />
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (testimonial) => (
      <Link
        href={`/admin/testimonials/${testimonial.id}`}
        className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Link>
    ),
  },
];

export default async function AdminTestimonialsPage() {
  const testimonials = await getCmsTestimonials();
  const activeTestimonials = testimonials.filter((item) => item.active !== false);

  const metrics: AdminMetric[] = [
    {
      label: "Total stories",
      value: String(testimonials.length),
      description: "Testimonials available for homepage and impact page usage.",
      status: "active",
    },
    {
      label: "Active",
      value: String(activeTestimonials.length),
      description: "Stories currently visible across public testimonial surfaces.",
      status: "published",
    },
    {
      label: "Hidden",
      value: String(testimonials.length - activeTestimonials.length),
      description: "Stories saved for later publication.",
      status: "draft",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Impact stories"
        title="Testimonial manager"
        description="Manage testimonial quotes, profile metadata, and visibility for homepage and impact storytelling."
        primaryAction={{ label: "Create testimonial", href: "/admin/testimonials/new" }}
      />

      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <AdminDataTable columns={testimonialColumns} rows={testimonials} />
    </div>
  );
}
