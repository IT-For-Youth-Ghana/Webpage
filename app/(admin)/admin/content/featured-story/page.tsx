import { PlaySquare } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FeaturedStoryForm } from "@/components/admin/featured-story-form";
import { getCmsFeaturedStory } from "@/lib/cms/homepage";

export default async function AdminFeaturedStoryPage() {
  const story = await getCmsFeaturedStory();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Homepage CMS"
        title="Featured story / video"
        description="Edit the video/story proof block displayed on the homepage."
        icon={<PlaySquare className="h-5 w-5" />}
      />

      <FeaturedStoryForm initial={story} />
    </div>
  );
}
