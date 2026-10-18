import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const read = (p: string) => readFileSync(p, "utf8");

/**
 * Contract tests for CMS coverage.
 *
 * Each of these encodes a gap the audit found, so the gap cannot reopen
 * quietly. They read source rather than running Firebase, which keeps them in
 * the fast deterministic lane.
 */
describe("CMS coverage contracts", () => {
  it("no public page imports editorial seed content directly", () => {
    // /donate imported activeDonationCampaign straight from the seed file, so
    // the page handling money was the one page an administrator could not edit.
    // Pages must go through a getCms* reader, which is what applies the
    // Firestore-over-seed precedence.
    const pages = [
      "app/(public)/donate/page.tsx",
      "app/(public)/page.tsx",
    ];
    for (const page of pages) {
      const source = read(page);
      const seedImports = [...source.matchAll(/import\s*\{([^}]*)\}\s*from\s*"@\/lib\/content\/site-config"/g)]
        .flatMap((m) => m[1].split(",").map((s) => s.trim()))
        .filter(Boolean)
        // Navigation labels and breadcrumb strings are static site chrome, not
        // editorial records, and are legitimately imported.
        .filter((name) => !/^(breadcrumbs|siteMeta|publicNavigation|footerNavigation|legalNavigation|headerCtas)$/.test(name));

      assert.deepEqual(
        seedImports,
        [],
        `${page} imports editorial seed directly: ${seedImports.join(", ")}`,
      );
    }
  });

  it("/donate reads the same campaign reader the homepage block uses", () => {
    const donate = read("app/(public)/donate/page.tsx");
    assert.match(donate, /getCmsDonationCampaign/);
    assert.match(donate, /export default async function/, "a reader call needs an async server component");
  });

  it("the donation campaign revalidates both pages that show it", () => {
    const map = read("lib/utils/revalidate.ts");
    const entry = map.match(/donationCampaign:\s*\[([^\]]*)\]/);
    assert.ok(entry, "no donationCampaign entry in revalidationMap");
    assert.match(entry[1], /"\/"/, "must revalidate the homepage block");
    assert.match(entry[1], /"\/donate"/, "must revalidate the donate page");
  });

  it("every initiative detail page is discoverable in the admin registry", () => {
    // Both What We Do nodes previewed the hub, so the eight detail pages were
    // invisible in the Content Explorer and previews landed on the wrong page.
    const registry = read("lib/content/admin-registry.ts");
    assert.match(registry, /initiatives\.map\(/, "the node list must be generated from the seed, not hand-listed");
    assert.match(registry, /previewHref: `\/what-we-do\/\$\{initiative\.slug\}`/);
    assert.match(registry, /adminPath: `\/admin\/programmes\/\$\{initiative\.slug\}`/);
  });

  it("array readers resolve through the shared seed fallback", () => {
    // An inline `?? []` makes Array.isArray pass on the empty case and skips
    // the seed, which is how the homepage join cards silently disappeared.
    const homepage = read("lib/cms/homepage.ts");
    assert.ok(
      !/getDocField<unknown\[\]>\([^)]*\)\s*\?\?\s*\[\]/.test(homepage),
      "inline `?? []` reintroduces the silent-empty bug",
    );
    const reads = homepage.match(/getDocField<unknown\[\]>/g) ?? [];
    const resolved = homepage.match(/resolveCmsArray</g) ?? [];
    assert.equal(reads.length, resolved.length);
  });
});
