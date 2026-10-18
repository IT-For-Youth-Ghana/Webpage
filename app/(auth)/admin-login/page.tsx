import Link from "next/link";

import { AdminLoginForm } from "@/components/admin/admin-login-form";

type AdminLoginPageProps = {
  searchParams?: {
    next?: string;
  };
};

function getSafeNextPath(nextPath?: string) {
  if (nextPath?.startsWith("/admin")) {
    return nextPath;
  }

  return "/admin/dashboard";
}

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const nextPath = getSafeNextPath(searchParams?.next);

  return (
    <main className="grid min-h-screen place-items-center bg-brand-mist px-4">
      <div className="w-full max-w-md rounded-[32px] border border-brand-border bg-white p-10 shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">Admin access</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold text-brand-ink">Admin login</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Sign in with a Firebase Auth account that has an admin claim, an allowed email, or an active CMS user record.
        </p>

        <AdminLoginForm nextPath={nextPath} />

        <Link href="/" className="mt-6 inline-flex text-sm font-semibold text-brand-deep">
          Return to public site
        </Link>
      </div>
    </main>
  );
}
