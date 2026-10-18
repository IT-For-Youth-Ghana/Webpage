import Link from "next/link";

import { NewsletterSignupForm } from "@/components/shared/newsletter-signup-form";
import { footerNavigation, legalNavigation, newsletterSignupContent } from "@/lib/content/site-config";
import { getCmsSettings, type CmsPublicSettings } from "@/lib/cms/settings";

function SocialIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (l.includes("facebook")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
    );
  }
  if (l.includes("twitter") || l.includes("x")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
    );
  }
  if (l.includes("linkedin")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
    );
  }
  if (l.includes("instagram")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.5]"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
    );
  }
  if (l.includes("youtube")) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><circle cx="12" cy="12" r="10" /></svg>
  );
}
type SiteFooterProps = {
  settings?: CmsPublicSettings;
};

export async function SiteFooter({ settings: providedSettings }: SiteFooterProps = {}) {
  const settings = providedSettings ?? (await getCmsSettings());
  return (
    <footer className="bg-brand-deep text-white">
      {/* Main footer grid */}
      <div className="mx-auto max-w-6xl px-6 pb-12 pt-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[0.72rem] font-bold tracking-wide text-brand-deep">
                ITFY
              </span>
              <span className="font-heading text-[1.15rem] font-bold leading-tight text-white">
                IT For Youth<br />Ghana
              </span>
            </Link>
            <p className="mt-4 text-base leading-[1.75] text-white/85">
              Empowering Ghanaian youth with the digital skills, confidence, and pathways needed to shape tomorrow&apos;s economy.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {settings.socials.map((s) => (
                <a
                  key={`${s.label}-${s.href}`}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/85 transition hover:bg-white/15 hover:text-white"
                >
                  <SocialIcon label={s.label} />
                </a>
              ))}
            </div>

            {/* Contact snippet */}
            <div className="mt-6 space-y-1.5 text-[0.85rem] text-white/85">
              {settings.contact.location && <p>{settings.contact.location}</p>}
              {settings.contact.email && <p>{settings.contact.email}</p>}
              {settings.contact.phone && <p>{settings.contact.phone}</p>}
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-4 lg:grid-cols-4">
            {footerNavigation.map((col) => (
              <div key={col.heading}>
                <h3 className="mb-4 text-[0.75rem] font-bold uppercase tracking-[0.22em] text-white">
                  {col.heading}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.92rem] text-white/85 transition hover:text-white hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter strip */}
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 lg:px-10">
          <div>
            <p className="text-base font-semibold text-white">{newsletterSignupContent.heading}</p>
            <p className="text-base text-white/85">{newsletterSignupContent.description}</p>
          </div>
          <NewsletterSignupForm
            variant="compact"
            interest="footer"
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Legal strip */}
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 lg:px-10">
          <p className="text-base text-white/80">
            © {new Date().getFullYear()} IT For Youth Ghana. Registered NGO. All rights reserved.
          </p>
          <div className="flex gap-4">
            {legalNavigation.map((l) => (
              <Link key={l.href} href={l.href} className="text-[0.8rem] text-white/80 hover:text-white hover:underline">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
