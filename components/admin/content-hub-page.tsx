import Link from "next/link";

import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { HubNodeSearch } from "@/components/admin/hub-node-search";
import { getHubs, getNodesForHub } from "@/lib/content/admin-registry";

type ContentHubPageProps = {
  hubKey: string;
};

export function ContentHubPage({ hubKey }: ContentHubPageProps) {
  const hub = getHubs().find((item) => item.key === hubKey);
  const nodes = getNodesForHub(hubKey);

  if (!hub) {
    return (
      <div className="space-y-4">
        <AdminBreadcrumbs />
        <h1 className="text-xl font-bold">Unknown hub</h1>
        <p className="text-slate-600">This hub is not registered. Go back to the Content Explorer.</p>
        <Link href="/admin/content" className="text-brand-deep hover:underline">
          Back to Content
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <AdminBreadcrumbs />
        <h1 className="text-2xl font-bold">{hub.label}</h1>
        {hub.description ? (
          <p className="text-slate-600">{hub.description}</p>
        ) : null}
      </header>

      <HubNodeSearch nodes={nodes} />
    </div>
  );
}
