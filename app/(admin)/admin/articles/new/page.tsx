import { ArticleForm } from "@/components/admin/article-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AdminNewArticlePage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Article CRUD"
        title="Create article"
        description="Create a news, blog, event, or press article. This first CMS slice saves to Firestore when Firebase Admin is configured and keeps a safe seed fallback for reads."
      />

      <ArticleForm mode="create" />
    </div>
  );
}
