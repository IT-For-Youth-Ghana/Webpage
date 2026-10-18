import type { JobListing } from "@/types/content";
import { DataTable, type DataTableColumn, type DataTableRow } from "@/components/content/data-table";
import { OverlapComposition } from "@/components/media/overlap-composition";
import { StateMessage } from "@/components/ui/state-message";
import { formatDate } from "@/lib/utils/formatters";

type CareersListProps = {
  jobs: JobListing[];
};

const typeLabels: Record<JobListing["type"], string> = {
  "full-time": "Full time",
  "part-time": "Part time",
  contract: "Contract",
  volunteer: "Volunteer",
};

/**
 * Six roles that share five attributes are a comparison, so they are a table.
 *
 * They used to be a stack of cards. Comparing the closing dates of six roles
 * meant scrolling the page up and down re-finding the label each time, because
 * a card grid takes aligned attributes and un-aligns them. The table keeps
 * Team, Location, Type and Closes in four columns a reader scans down, and the
 * role column sticks to the leading edge so a scrolled-to date never loses the
 * role it belongs to.
 */
const columns: DataTableColumn[] = [
  { key: "role", header: "Role" },
  { key: "focus", header: "What the role covers" },
  { key: "team", header: "Team", width: "narrow" },
  { key: "location", header: "Location", width: "narrow" },
  { key: "type", header: "Type", width: "narrow" },
  { key: "closes", header: "Closes", width: "narrow", numeric: true },
  { key: "apply", header: "Apply", width: "narrow" },
];

const applyLinkClass =
  "font-semibold text-brand-primary-dark underline decoration-brand-border underline-offset-4 transition-colors hover:decoration-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary motion-reduce:transition-none";

/**
 * A closing date is only readable once. Firestore stores YYYY-MM-DD, which is
 * sortable and unreadable, so it is formatted here and carried in a <time>
 * element that keeps the machine-readable value beside it.
 */
function closingCell(closingDate?: string) {
  if (!closingDate) {
    return <span className="text-brand-muted">Open until filled</span>;
  }

  const parsed = new Date(closingDate);
  if (Number.isNaN(parsed.getTime())) {
    return closingDate;
  }

  return <time dateTime={closingDate}>{formatDate(closingDate)}</time>;
}

function applyCell(job: JobListing) {
  if (job.applyUrl) {
    return (
      <a href={job.applyUrl} target="_blank" rel="noreferrer noopener" className={applyLinkClass}>
        Apply<span className="sr-only"> for {job.title}, opens in a new tab</span>
      </a>
    );
  }

  return (
    <a href="/contact" className={applyLinkClass}>
      Contact us<span className="sr-only"> about {job.title}</span>
    </a>
  );
}

function toRow(job: JobListing): DataTableRow {
  return {
    id: job.id,
    cells: {
      role: job.title,
      focus: job.summary,
      team: job.team,
      location: job.location,
      type: typeLabels[job.type],
      closes: closingCell(job.closingDate),
      apply: applyCell(job),
    },
  };
}

export function CareersList({ jobs }: CareersListProps) {
  if (!jobs.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <StateMessage
          title="No open roles right now"
          description="We are not hiring at the moment. Check back soon for opportunities."
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
      {/* The room and someone working in it, as one figure. A wide plate alone
          says where the work happens and nothing about who does it; a portrait
          alone on a careers page reads as an opening already filled. The plate's
          lower-leading corner is furniture, which is the corner the portrait
          covers. */}
      <OverlapComposition
        plate={{
          src: "/images/randomPictures/happystudentscasual.jpg",
          alt: "A room full of secondary-school students cheering at the end of a session, standing between desks in a school library",
        }}
        portrait={{
          src: "/images/randomPictures/UXteacher_opt.jpg",
          alt: "A facilitator standing at a projector screen, walking a class through the five stages of the UX process",
        }}
        caption="The team runs cohorts, clubs and outreach across Greater Accra and partner regions."
      />

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">
          Open opportunities
        </p>
        <h2 className="mt-2 font-heading text-4xl font-semibold text-brand-ink">Join the team</h2>
      </div>

      <DataTable
        // The heading above already names the section, so the caption is the
        // table's own name for anyone navigating by table rather than by sight.
        caption={`${jobs.length} open ${jobs.length === 1 ? "role" : "roles"} at IT For Youth Ghana`}
        captionVisible={false}
        columns={columns}
        rows={jobs.map(toRow)}
      />
    </section>
  );
}
