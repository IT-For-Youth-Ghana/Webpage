import Link from "next/link";
import type { ReactNode } from "react";

import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { PortraitFigure } from "@/components/media/portrait-figure";
import type { DepartmentProfile, TeamMemberProfile } from "@/types/content";

type DepartmentDetailPageProps = {
  department: DepartmentProfile;
  teamMembers: TeamMemberProfile[];
};

export function DepartmentDetailPage({ department, teamMembers }: DepartmentDetailPageProps) {
  const selectedMembers = teamMembers.filter(
    (member) =>
      department.teamMemberIds.includes(member.id) ||
      member.departmentId === department.id ||
      member.departmentSlug === department.slug ||
      member.department.toLowerCase() === department.title.replace(/ department$/i, "").toLowerCase() ||
      member.department.toLowerCase() === department.title.toLowerCase(),
  );

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageSrc={department.heroImage || "/images/randomPictures/studentslisteningfrontal.JPG"}
        imageAlt={department.title}
        eyebrow={department.eyebrow}
        title={department.title}
        description={department.description}
        supportingText={department.summary}
        ctas={[
          ...department.ctas.map((cta, index) => ({ ...cta, variant: index === 0 ? "primary" as const : "secondary" as const })),
          ...(department.contact?.email ? [{ label: department.contact.email, href: `mailto:${department.contact.email}`, variant: "secondary" as const }] : []),
        ]}
        priority
      />

      <section className="px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.66fr_0.34fr]">
          <div className="space-y-8">
            <Panel title="Mission">
              <p className="text-base leading-8 text-slate-600">{department.mission}</p>
            </Panel>

            <Panel title="Responsibilities">
              <ul className="grid gap-3">
                {department.responsibilities.map((item) => (
                  <li key={item} className="rounded-2xl border border-brand-border bg-brand-mist/55 px-4 py-3 text-sm leading-7 text-slate-700">
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>

            {department.services.length ? (
              <Panel title="Services and workflows">
                <div className="grid gap-4 md:grid-cols-2">
                  {department.services.map((service) => (
                    <article key={service.title} className="rounded-panel border border-brand-border p-5">
                      <h3 className="font-heading text-xl font-bold text-brand-ink">{service.title}</h3>
                      <p className="mt-3 text-base leading-7 text-slate-600">{service.body}</p>
                      {service.bullets?.length ? (
                        <ul className="mt-4 grid gap-2 text-sm font-medium text-brand-deep">
                          {service.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  ))}
                </div>
              </Panel>
            ) : null}

            {selectedMembers.length ? (
              <Panel title="Department team">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Portrait, because this is people content. The library is
                      about 16:1 portrait for people and portrait is the honest
                      shape for a person; programme sections on this same page
                      take the wide treatments instead. See
                      docs/addendum-media-pairing.md. */}
                  {selectedMembers.map((member) => (
                    <article key={member.id} className="rounded-panel border border-brand-border bg-white p-5">
                      {member.photo?.trim() ? (
                        <PortraitFigure
                          className="mb-5"
                          src={member.photo}
                          alt={`${member.name}, ${member.role} at IT For Youth Ghana`}
                        />
                      ) : null}
                      <h3 className="font-heading text-xl font-bold text-brand-ink">{member.name}</h3>
                      <p className="mt-1 text-base font-semibold text-brand-deep">{member.role}</p>
                      <p className="mt-3 line-clamp-3 text-base leading-7 text-slate-600">{member.bio}</p>
                    </article>
                  ))}
                </div>
              </Panel>
            ) : null}
          </div>

          <aside className="space-y-6">
            {department.stats.length ? (
              <div className="rounded-panel border border-brand-border bg-brand-mist/50 p-6">
                <h2 className="font-heading text-xl font-bold text-brand-ink">Signals</h2>
                <div className="mt-5 grid gap-4">
                  {department.stats.map((stat) => (
                    <div key={`${stat.value}-${stat.label}`} className="rounded-2xl bg-white p-4">
                      <p className="font-heading text-3xl font-bold text-brand-deep">{stat.value}</p>
                      <p className="mt-1 text-base font-semibold text-brand-ink">{stat.label}</p>
                      {stat.description ? (
                        <p className="mt-2 text-base leading-6 text-slate-600">{stat.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {department.workflows.length ? (
              <div className="rounded-panel border border-brand-border bg-white p-6">
                <h2 className="font-heading text-xl font-bold text-brand-ink">How work moves</h2>
                <div className="mt-5 grid gap-4">
                  {department.workflows.map((step, index) => (
                    <div key={step.title} className="flex gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-deep text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-brand-ink">{step.title}</p>
                        <p className="mt-1 text-base leading-6 text-slate-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {department.priorities.length ? (
              <div className="rounded-panel border border-brand-border bg-white p-6">
                <h2 className="font-heading text-xl font-bold text-brand-ink">Current priorities</h2>
                <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
                  {department.priorities.map((priority) => (
                    <li key={priority} className="border-l-2 border-brand-accent pl-3">
                      {priority}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {department.resources.length ? (
              <div className="rounded-panel border border-brand-border bg-white p-6">
                <h2 className="font-heading text-xl font-bold text-brand-ink">Resources</h2>
                <div className="mt-5 grid gap-3">
                  {department.resources.map((resource) => (
                    <Link
                      key={`${resource.href}-${resource.label}`}
                      href={resource.href}
                      className="rounded-2xl border border-brand-border p-4 transition hover:border-brand-accent"
                    >
                      <span className="font-semibold text-brand-deep">{resource.label}</span>
                      {resource.description ? (
                        <span className="mt-1 block text-sm leading-6 text-slate-600">{resource.description}</span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-panel border border-brand-border bg-white p-6 shadow-sm lg:p-8">
      <h2 className="font-heading text-2xl font-bold text-brand-ink">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
