import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export default function AdminNewTestimonialPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Impact stories"
        title="Create testimonial"
        description="Add a new testimonial profile and quote for public impact storytelling."
      />

      <TestimonialForm mode="create" />
    </div>
  );
}
