import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { getCmsTestimonialById } from "@/lib/cms/testimonials";

type AdminEditTestimonialPageProps = {
  params: { id: string };
};

export default async function AdminEditTestimonialPage({ params }: AdminEditTestimonialPageProps) {
  const testimonial = await getCmsTestimonialById(params.id);

  if (!testimonial) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Impact stories"
        title={`Edit testimonial: ${testimonial.name}`}
        description="Update quote content, profile fields, and public visibility."
      />

      <TestimonialForm mode="edit" testimonial={testimonial} />
    </div>
  );
}
