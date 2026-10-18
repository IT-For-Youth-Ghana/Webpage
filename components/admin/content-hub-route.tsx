import { ContentHubPage } from "@/components/admin/content-hub-page";

type AdminContentHubRouteProps = {
  params: { hub: string };
};

/** Shared route adapter for both CMS hub entry points. */
export function AdminContentHubRoute({ params }: AdminContentHubRouteProps) {
  return <ContentHubPage hubKey={params.hub} />;
}
