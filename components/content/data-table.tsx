import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export type DataTableColumn = {
  /** Matches a key in each row's `cells`. */
  key: string;
  header: string;
  /** Figures and dates align to the trailing edge so they can be compared down. */
  numeric?: boolean;
  /** Keeps a short column from being stretched by a long one beside it. */
  width?: "auto" | "narrow";
};

export type DataTableRow = {
  id: string;
  cells: Record<string, ReactNode>;
  /** Makes the row header a link. The row itself is never clickable. */
  href?: string;
};

type DataTableProps = {
  /**
   * What the table is a table of. Required, and rendered: an unlabelled table
   * is unusable to anyone navigating by table, and the caption is also what
   * names the scroll region for keyboard users.
   */
  caption: string;
  /** Set false to render the caption for assistive technology only. */
  captionVisible?: boolean;
  columns: DataTableColumn[];
  rows: DataTableRow[];
  /** Which column identifies the row. Defaults to the first. */
  rowHeaderKey?: string;
  /** Shown in a cell whose value is absent. Never left blank. */
  emptyCell?: string;
  tone?: "plain" | "mist";
  className?: string;
};

/**
 * A comparison: several records sharing the same attributes, where the reader's
 * job is to scan across them.
 *
 * The third answer to "render this content array", after `PanelList`
 * (sentences) and `LabelPills` (short labels). The failure it prevents: the
 * content model holds several genuinely tabular shapes (organisation packages,
 * training cohorts, audience bands, job listings) that are currently either
 * bullet lists, which the brief bans, or stacks of cards, which is worse. A
 * card stack takes five aligned attributes and un-aligns them, so comparing the
 * closing dates of six roles means scrolling up and down re-finding the label
 * each time. The information is a table; the honest rendering is a table.
 *
 * Semantics are the whole point, so they are not optional: a real `<table>`, a
 * real `<caption>`, `<th scope="col">` on every column and `<th scope="row">`
 * on the cell that identifies the record.
 *
 * Responsive behaviour is deliberately NOT a collapse to one column per row: a
 * table stacked into cards is the card stack this replaces. Instead the table
 * keeps a minimum width and scrolls horizontally inside a region a keyboard can
 * reach and pan, and the row-header column sticks to the leading edge so the
 * reader never loses which record a scrolled-to figure belongs to.
 */
export function DataTable({
  caption,
  captionVisible = true,
  columns,
  rows,
  rowHeaderKey,
  emptyCell = "Not stated",
  tone = "plain",
  className,
}: DataTableProps) {
  if (!columns.length || !rows.length) return null;

  const headerKey = rowHeaderKey ?? columns[0].key;
  const stickyGround = tone === "mist" ? "bg-brand-mist" : "bg-white";

  return (
    <div
      role="group"
      aria-label={caption}
      tabIndex={0}
      className={cn(
        "overflow-x-auto",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-primary",
        className,
      )}
    >
      {/* border-separate, not collapse: a collapsed border belongs to the table
          rather than the cell, so it stays put while a sticky cell scrolls over
          it and the leading column loses its rules. */}
      <table className="w-full min-w-[42rem] border-separate border-spacing-0 text-left text-sm">
        <caption
          className={cn(
            "text-left",
            captionVisible
              ? "pb-4 font-heading text-lg font-bold text-brand-ink"
              : "sr-only",
          )}
        >
          {caption}
        </caption>

        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "border-b-2 border-brand-primary px-4 py-3 align-bottom text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-brand-ink",
                  column.numeric && "text-right",
                  column.width === "narrow" && "w-[1%] whitespace-nowrap",
                  column.key === headerKey &&
                    cn("sticky left-0 z-[1] px-0 pe-4", stickyGround),
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => {
                const value = row.cells[column.key];
                const isEmpty = value === undefined || value === null || value === "";
                const content = isEmpty ? (
                  <span className="text-brand-muted">{emptyCell}</span>
                ) : (
                  value
                );

                if (column.key === headerKey) {
                  return (
                    <th
                      key={column.key}
                      scope="row"
                      className={cn(
                        "sticky left-0 z-[1] border-b border-brand-border py-4 pe-4 text-left align-top font-heading text-base font-bold text-brand-ink",
                        stickyGround,
                      )}
                    >
                      {row.href ? (
                        <a
                          href={row.href}
                          className="text-brand-primary-dark underline decoration-brand-border underline-offset-4 transition-colors hover:decoration-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary motion-reduce:transition-none"
                        >
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </th>
                  );
                }

                return (
                  <td
                    key={column.key}
                    className={cn(
                      "border-b border-brand-border px-4 py-4 align-top leading-6 text-slate-700",
                      column.numeric && "text-right tabular-nums",
                      column.width === "narrow" && "whitespace-nowrap",
                    )}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
