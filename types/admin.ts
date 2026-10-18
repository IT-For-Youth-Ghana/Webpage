import type { ReactNode } from "react";

export type AdminRole = "super-admin" | "editor" | "viewer";
export type UserAccessRole = AdminRole | "file-server-only" | "super-admin";

export type AdminCmsStatus =
  | "live-seed"
  | "cms-ready"
  | "needs-firebase"
  | "protected";

export type AdminRecordStatus =
  | "published"
  | "draft"
  | "archived"
  | "new"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "enrolled"
  | "active"
  | "inactive"
  | "configured"
  | "missing";

export interface AdminNavItem {
  label: string;
  href: string;
  description: string;
}

export interface AdminScaffoldPage {
  title: string;
  description: string;
  nextSteps: string[];
}

export interface AdminMetric {
  label: string;
  value: string;
  description: string;
  status?: AdminRecordStatus;
  action?: {
    label: string;
    href: string;
  };
}

export interface AdminCollectionDefinition {
  key: string;
  label: string;
  collection: string;
  route: string;
  description: string;
  readModel: "public-read" | "admin-read" | "admin-only" | "write-only-public";
  writeRole: AdminRole;
  status: AdminCmsStatus;
  documentCount: number;
}

export interface AdminActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: AdminRecordStatus;
  href: string;
}

export interface AdminTableColumn<Row> {
  key: keyof Row | string;
  label: string;
  render?: (row: Row) => ReactNode;
  className?: string;
}

export interface AdminApplicationRecord {
  id: string;
  name: string;
  email: string;
  course: string;
  status: Extract<
    AdminRecordStatus,
    "new" | "reviewed" | "shortlisted" | "rejected" | "enrolled"
  >;
  submittedAt: string;
  notes: string;
}

export interface AdminMediaFolder {
  id: string;
  label: string;
  storagePath: string;
  description: string;
  itemCount: number;
  sampleAssets: string[];
}

export interface AdminSettingsGroup {
  id: string;
  label: string;
  description: string;
  status: Extract<AdminRecordStatus, "configured" | "missing">;
  fields: Array<{
    label: string;
    value: string;
    secret?: boolean;
  }>;
}

export interface AdminHomepageSectionConfig {
  id: string;
  label: string;
  route: string;
  status: "live" | "hidden" | "planned";
  collection: string;
  description: string;
}
