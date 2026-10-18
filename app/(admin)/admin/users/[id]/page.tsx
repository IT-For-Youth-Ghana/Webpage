import { Users } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UserForm } from "@/components/admin/user-form";
import { getCmsUserById } from "@/lib/cms/users";

export default async function AdminEditUserPage({ params }: { params: { id: string } }) {
  const user = await getCmsUserById(params.id);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="CMS"
        title={user ? `Edit: ${user.name}` : "Edit user"}
        description="Update role or status. Only super-admins can make changes."
        icon={<Users className="h-6 w-6" />}
      />
      <UserForm
        mode="edit"
        user={user ? { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, notes: user.notes } : undefined}
      />
    </div>
  );
}
