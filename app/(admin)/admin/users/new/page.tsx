import { Users } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UserForm } from "@/components/admin/user-form";

export default function AdminNewUserPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="CMS"
        title="New user"
        description="Create an admin account and email the user a temporary password. Only super-admins can create users."
        icon={<Users className="h-6 w-6" />}
      />
      <UserForm mode="create" />
    </div>
  );
}
