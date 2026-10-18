"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Compass,
  FileText,
  FolderKanban,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";

import { adminHubs, adminNodes, getNodesForHub } from "@/lib/content/admin-registry";
import { cn } from "@/lib/utils/cn";
import type { AdminSessionUser } from "@/lib/firebase/auth";

type AdminShellProps = {
  children: React.ReactNode;
  adminUser: AdminSessionUser;
};

type SidebarItem = {
  label: string;
  href: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  match?: (pathname: string) => boolean;
};

const workspaceItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    description: "Health and activity",
    icon: LayoutDashboard,
  },
  {
    label: "Content Explorer",
    href: "/admin/content",
    description: "Browse every hub",
    icon: Compass,
    match: (pathname) => pathname === "/admin/content",
  },
  {
    label: "Usage & Documentation",
    href: "/admin/documentation",
    description: "How the CMS works",
    icon: BookOpen,
  },
];

const recordItems: SidebarItem[] = [
  { label: "Team", href: "/admin/team", description: "People profiles", icon: Users },
  { label: "Departments", href: "/admin/departments", description: "Department pages", icon: Building2 },
  { label: "Partners", href: "/admin/partners", description: "Partner logos", icon: BriefcaseBusiness },
  { label: "Articles", href: "/admin/articles", description: "News and blogs", icon: Newspaper },
  { label: "Testimonials", href: "/admin/testimonials", description: "Story records", icon: FileText },
  { label: "Jobs", href: "/admin/jobs", description: "Careers listings", icon: ClipboardList },
];

const operationsItems: SidebarItem[] = [
  { label: "Applications", href: "/admin/applications", description: "Training pipeline", icon: Inbox },
  { label: "Messages", href: "/admin/messages", description: "Contact enquiries", icon: Inbox },
  { label: "Media", href: "/admin/media", description: "Asset library", icon: FolderKanban },
  { label: "Users", href: "/admin/users", description: "Admin access", icon: UserCog },
  { label: "Settings", href: "/admin/settings", description: "Site settings", icon: Settings },
  { label: "Audit", href: "/admin/audit", description: "Change history", icon: ShieldCheck },
];

const hubIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  homepage: Home,
  "who-we-are": Users,
  "what-we-do": FolderKanban,
  "apply-for-training": ClipboardList,
  "for-organisations": Building2,
  "partner-with-us": BriefcaseBusiness,
  "our-impact": BarChart3,
  "news-and-updates": Newspaper,
  contact: Inbox,
};

export function AdminShell({ children, adminUser }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isActivePath = (href: string) => {
    if (pathname === href || pathname.startsWith(`${href}/`)) {
      return true;
    }

    return false;
  };

  const isActiveItem = (item: SidebarItem) =>
    item.match ? item.match(pathname) : isActivePath(item.href);

  const isActiveHub = (hubKey: string) => {
    if (pathname === `/admin/content/hubs/${hubKey}`) {
      return true;
    }

    return getNodesForHub(hubKey).some((node) => isActivePath(node.adminPath));
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    await fetch("/api/admin/session", {
      method: "DELETE",
    }).catch(() => null);

    router.replace("/admin-login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-brand-deep text-white">
      <div className="mx-auto grid min-h-screen max-w-[1500px] gap-0 lg:grid-cols-[320px_1fr]">
        <aside className="border-r border-white/10 bg-brand-deep lg:sticky lg:top-0 lg:h-screen">
          <div className="flex h-full flex-col">
            <div className="px-6 py-7">
              <Link href="/admin/dashboard" className="block font-heading text-2xl font-semibold">
                ITFY Admin
              </Link>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                CMS workspace for publishing, records, and operations.
              </p>
            </div>

            <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-4 pb-6 [scrollbar-width:thin]">
              <SidebarSection title="Workspace">
                {workspaceItems.map((item) => (
                  <SidebarLink key={item.href} item={item} active={isActiveItem(item)} />
                ))}
              </SidebarSection>

              <SidebarSection title="Content Hubs">
                {adminHubs
                  .filter((hub) => !["media", "operations", "system"].includes(hub.key))
                  .map((hub) => {
                    const Icon = hubIcons[hub.key] ?? FolderKanban;
                    const count = adminNodes.filter((node) => node.hub === hub.key).length;
                    const active = isActiveHub(hub.key);

                    return (
                      <Link
                        key={hub.key}
                        href={`/admin/content/hubs/${hub.key}`}
                        className={cn(
                          "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                          active ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                          active ? "bg-brand-primary text-white" : "bg-white/5 text-white/85 group-hover:bg-white/10",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">{hub.label}</span>
                  <span className={cn("mt-0.5 block truncate text-xs", active ? "text-slate-600" : "text-white/65")}>
                            {count} {count === 1 ? "editor" : "editors"}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
              </SidebarSection>

              <SidebarSection title="Records">
                {recordItems.map((item) => (
                  <SidebarLink key={item.href} item={item} active={isActiveItem(item)} />
                ))}
              </SidebarSection>

              <SidebarSection title="Operations">
                {operationsItems.map((item) => (
                  <SidebarLink key={item.href} item={item} active={isActiveItem(item)} compact />
                ))}
              </SidebarSection>
            </div>

            <div className="border-t border-white/10 p-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                  Signed in
                </p>
                <p className="mt-2 truncate text-sm font-semibold text-white">
                  {adminUser.email}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {adminUser.role} via {adminUser.source}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="mx-4 mb-5 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut className="h-3.5 w-3.5" />
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </aside>

        <main className="bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <nav className="space-y-2" aria-label={title}>
      <p className="px-3 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white/65">
        {title}
      </p>
      <div className="grid gap-1.5">{children}</div>
    </nav>
  );
}

function SidebarLink({
  item,
  active,
  compact = false,
}: {
  item: SidebarItem;
  active: boolean;
  compact?: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
        active ? "bg-white text-brand-ink" : "text-white/85 hover:bg-white/10 hover:text-white",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          active ? "bg-brand-primary text-white" : "bg-white/5 text-white/85 group-hover:bg-white/10",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-semibold">{item.label}</span>
        {!compact && item.description ? (
          <span className={cn("mt-0.5 block truncate text-xs", active ? "text-slate-600" : "text-white/65")}>
            {item.description}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
