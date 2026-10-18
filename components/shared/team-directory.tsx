import Image from "next/image";
import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";

import type { TeamMemberProfile } from "@/types/content";
import { Card } from "@/components/ui/card";
import { StateMessage } from "@/components/ui/state-message";

type TeamDirectoryProps = {
  members: TeamMemberProfile[];
};

function groupedByDepartment(members: TeamMemberProfile[]) {
  const groups = new Map<
    string,
    {
      department: string;
      departmentSlug?: string;
      members: TeamMemberProfile[];
    }
  >();

  for (const member of members) {
    const key = member.department || "General";
    const current = groups.get(key) ?? {
      department: key,
      departmentSlug: member.departmentSlug,
      members: [],
    };

    current.departmentSlug = current.departmentSlug ?? member.departmentSlug;
    current.members.push(member);
    groups.set(key, current);
  }

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      members: [...group.members].sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.department.localeCompare(b.department));
}

export function TeamDirectory({ members }: TeamDirectoryProps) {
  if (!members.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <StateMessage
          title="Team profiles coming soon"
          description="We are preparing a richer view of the team. Please check back shortly."
        />
      </section>
    );
  }

  const grouped = groupedByDepartment(members);

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      {grouped.map((group) => (
        <div key={group.department} className="space-y-5">
          <h2 className="font-heading text-2xl font-semibold text-brand-ink">
            {group.departmentSlug ? (
              <Link
                href={`/departments/${group.departmentSlug}`}
                className="inline-flex transition hover:text-brand-primary"
              >
                {group.department}
              </Link>
            ) : (
              group.department
            )}
          </h2>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {group.members.map((member) => (
              <Card
                key={member.id}
                className="rounded-[26px]"
              >
                <div className="mb-4 flex items-center gap-4">
                  <Image
                    src={member.photo || "/images/logo/logo_small.jpg"}
                    alt={member.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-brand-ink">{member.name}</h3>
                    <p className="text-base font-medium text-slate-600">{member.role}</p>
                  </div>
                </div>

                <p className="text-base leading-7 text-slate-600">{member.bio}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {member.featured ? (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                      Featured
                    </span>
                  ) : null}

                  {member.email ? (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </a>
                  ) : null}

                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                      LinkedIn
                    </a>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
