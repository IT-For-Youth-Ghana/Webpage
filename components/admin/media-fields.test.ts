import assert from "node:assert/strict";
import { globSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { MEDIA_TREATMENTS } from "../../types/content.ts";

const FIELDS = readFileSync("components/admin/media-fields.tsx", "utf8");
const FORM = readFileSync("components/admin/site-page-form.tsx", "utf8");

/**
 * The admin media group, checked mechanically.
 *
 * Each assertion is a failure that was live before this component existed: a
 * section whose photograph could only be changed by editing Firestore, a URL
 * the form accepted and the save rejected, an image saved with no alt text, and
 * a layout list typed out a second time so the form and the schema could
 * disagree about what a valid treatment is.
 */
describe("admin media fields", () => {
  it("shows the same verdict the save applies", () => {
    assert.match(
      FIELDS,
      /import \{[^}]*describeMediaUrlProblem[^}]*\} from "@\/lib\/cms\/media-url"/,
      "the form must ask the shared function, not pattern-match the URL itself",
    );
    assert.ok(
      !FIELDS.includes("ALLOWED_REMOTE_IMAGE_HOSTS"),
      "the host allowlist belongs to lib/cms/media-url.ts alone",
    );
    assert.ok(
      FIELDS.includes("MISSING_ALT_MESSAGE"),
      "the missing-alt sentence is imported, never retyped",
    );
  });

  it("asks for alt text only once a photograph is present", () => {
    // Demanding alt on an empty field would flag every section that carries no
    // media by design, which is most of them.
    assert.match(FIELDS, /const altProblem = src && !alt \? MISSING_ALT_MESSAGE : null/);
  });

  it("builds the layout select from the one declaration", () => {
    assert.match(FIELDS, /MEDIA_TREATMENTS\.map\(/, "options come from types/content.ts");

    for (const option of MEDIA_TREATMENTS) {
      assert.ok(
        !FIELDS.includes(`"${option.value}"`),
        `${option.value} must not be typed into the form as a literal`,
      );
      assert.ok(
        !FIELDS.includes(option.label),
        `${option.label} must come from MEDIA_TREATMENTS, not be repeated here`,
      );
    }
  });

  it("treats Automatic as an absent value, not an empty string", () => {
    // "" would reach Zod as a value outside the enum and fail the save with a
    // message about an invalid layout the editor never chose.
    assert.match(FIELDS, /event\.target\.value === AUTOMATIC\s*\?\s*undefined/);
    assert.match(FIELDS, /const AUTOMATIC = ""/);
  });

  it("labels every control and points its description at it", () => {
    // Hint ids belong to the <p> elements the controls point at, not to
    // controls of their own.
    const controlIds = (FIELDS.match(/id=\{(\w+Id)\}/g) ?? [])
      .map((match) => match.slice(4, -1))
      .filter((id) => !id.endsWith("HintId"));
    assert.ok(controlIds.length >= 4, "expected the image, alt, video and layout controls");

    for (const id of controlIds) {
      assert.ok(
        FIELDS.includes(`htmlFor={${id}}`),
        `${id} has no <label htmlFor>, so it has no accessible name`,
      );
    }

    for (const described of ["imageHintId", "altHintId", "treatmentHintId"]) {
      assert.ok(
        FIELDS.includes(`aria-describedby={${described}}`),
        `${described} must be announced with its control`,
      );
    }
  });

  it("marks a rejected field invalid rather than only colouring it", () => {
    assert.match(FIELDS, /aria-invalid=\{urlProblem \? true : undefined\}/);
    assert.match(FIELDS, /aria-invalid=\{altProblem \? true : undefined\}/);
  });
});

describe("the site page editor uses it", () => {
  it("gives every content section its media and its layout", () => {
    const group = FORM.slice(FORM.indexOf('idPrefix={`section-${index}`}'));
    assert.ok(group, "sections must render a MediaFields group");

    for (const field of ["image", "imageAlt", "videoUrl", "treatment"]) {
      assert.ok(
        new RegExp(`updateSection\\(index, "${field}"`).test(group.slice(0, 1200)),
        `a section's ${field} must be editable in the form`,
      );
    }
  });

  it("namespaces the group so repeated sections stay labelable", () => {
    // Every id inside the group is prefixed. Without this, section 2's image
    // input would carry the same id as section 1's and the label would point at
    // the wrong control.
    assert.match(FORM, /idPrefix=\{`section-\$\{index\}`\}/);
  });

  it("routes the hero and the feature image through the same group", () => {
    assert.match(FORM, /idPrefix="hero"/);
    assert.match(FORM, /idPrefix="principles"/);
    assert.ok(
      !/id="heroImage"/.test(FORM),
      "the hand-rolled hero image input is replaced, not left beside the group",
    );
    assert.ok(!/id="principlesImage"/.test(FORM));
  });
});

describe("one list of layouts", () => {
  it("is declared in types/content.ts and nowhere else", () => {
    const sources = globSync("{app,components,lib}/**/*.{ts,tsx}").filter(
      (file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"),
    );

    for (const file of sources) {
      const source = readFileSync(file, "utf8");
      const literals = MEDIA_TREATMENTS.filter((option) => source.includes(`"${option.value}"`));
      const allowed = file === "components/shared/content-page.tsx";

      assert.ok(
        allowed || literals.length <= 1,
        `${file} repeats the treatment list (${literals.map((o) => o.value).join(", ")}). Import MEDIA_TREATMENTS.`,
      );
    }
  });
});
