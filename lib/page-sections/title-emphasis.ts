/**
 * Editorial headline emphasis.
 *
 * The hero headline in `docs/design_templates/02-who-we-are.html` is built from
 * two voices: a plain setup in white, then one accented phrase set in the
 * display serif's italic and the accent colour ("Built around one belief:
 * *potential deserves a path.*"). That counterpoint is the whole text design.
 *
 * Titles reach this renderer as a single plain string from the CMS, so the
 * accent has to be expressible inside that string rather than as a second
 * field. Two mechanisms, tried in order:
 *
 *   1. An explicit accent phrase carried beside the title, which the hero
 *      contract exposes as `titleAccent`. Preferred, because the title string
 *      stays clean for page metadata.
 *   2. A run marked with asterisks inside the title itself, for an editor
 *      typing emphasis directly into a CMS field.
 *   3. A derived run, so headlines already in Firestore gain the treatment
 *      without an editing pass: the clause after a colon, otherwise the closing
 *      sentence of a multi-sentence headline.
 *
 * A headline matching neither renders entirely in white. That is a designed
 * state, not a failure — a single short sentence has nothing to counterpoint.
 */

export type TitleSegment = {
  text: string;
  accent: boolean;
};

/** Every balanced `*run*`. Newlines are excluded so a stray asterisk on one line cannot pair with another. */
const MARKED_RUNS = /\*([^*\n]+)\*/g;

/** A sentence boundary: terminal punctuation, an optional closing quote, whitespace, then a capital or digit. */
const SENTENCE_BREAK = /[.!?]["'”’]?\s+(?=["'“‘]?[A-Z0-9])/g;

/** Full stops that end an abbreviation rather than a sentence. Compared lowercase, without the stop. */
const ABBREVIATIONS = new Set([
  "mr", "mrs", "ms", "dr", "prof", "rev", "st", "no", "inc", "ltd", "co",
  "vs", "approx", "dept", "est", "fig", "jan", "feb", "mar", "apr", "jun",
  "jul", "aug", "sep", "sept", "oct", "nov", "dec",
]);

/** A derived accent needs enough of a setup in front of it to read as a counterpoint. */
const MIN_LEAD = 8;

/** A derived accent shorter than this is a fragment, not a phrase. */
const MIN_ACCENT = 4;

/** A comma is a weaker boundary than a full stop, so the tail it opens has to earn the accent. */
const MIN_COMMA_ACCENT = 10;

/**
 * The accent is the smaller voice. Past roughly this share the italic stops
 * reading as a counterpoint and simply becomes the headline, which is what
 * "Trust, inclusion, and accountability as the work grows." looked like before
 * that section named its own accent instead.
 */
const MAX_COMMA_ACCENT_SHARE = 0.6;

function segments(lead: string, accent: string): TitleSegment[] {
  return [
    { text: lead, accent: false },
    { text: accent, accent: true },
  ];
}

function plain(title: string): TitleSegment[] {
  return [{ text: title, accent: false }];
}

/** True when the full stop at `index` closes an abbreviation such as "Dr." rather than a sentence. */
function endsAbbreviation(title: string, index: number): boolean {
  if (title[index] !== ".") return false;
  const word = title.slice(0, index).split(/[\s(]/).pop() ?? "";
  return ABBREVIATIONS.has(word.toLowerCase()) || /^[A-Za-z]$/.test(word) || /\.[A-Za-z]$/.test(word);
}

function splitOnColon(title: string): TitleSegment[] | null {
  const colon = title.indexOf(": ");
  if (colon < MIN_LEAD) return null;
  const accent = title.slice(colon + 2);
  if (accent.trim().length < MIN_ACCENT) return null;
  return segments(title.slice(0, colon + 2), accent);
}

/**
 * A single-sentence headline still has a closing beat if it is punctuated:
 * "See the evidence, the stories, and the wider systems change behind the work."
 * The last comma is a real boundary in the text rather than a guess at where the
 * prose turns, which keeps this out of the business of parsing English.
 */
/**
 * "From curiosity to capability — a disciplined pathway into Ghana's digital
 * workforce." A spaced em or en dash sets up the same two-part statement a colon
 * does, and the programme taglines are written almost entirely this way.
 */
function splitOnDash(title: string): TitleSegment[] | null {
  const dash = title.search(/ [—–] /);
  if (dash < MIN_LEAD) return null;

  const accent = title.slice(dash + 3);
  if (accent.trim().length < MIN_ACCENT) return null;
  return segments(title.slice(0, dash + 3), accent);
}

function splitOnClosingClause(title: string): TitleSegment[] | null {
  const comma = title.lastIndexOf(", ");
  if (comma < MIN_LEAD) return null;

  const accent = title.slice(comma + 2);
  if (accent.trim().length < MIN_COMMA_ACCENT) return null;
  if (accent.length > title.length * MAX_COMMA_ACCENT_SHARE) return null;

  return segments(title.slice(0, comma + 2), accent);
}

function splitOnClosingSentence(title: string): TitleSegment[] | null {
  SENTENCE_BREAK.lastIndex = 0;
  let boundary = -1;

  for (let match = SENTENCE_BREAK.exec(title); match; match = SENTENCE_BREAK.exec(title)) {
    if (endsAbbreviation(title, match.index)) continue;
    const end = match.index + match[0].length;
    if (title.slice(0, end).trim().length < MIN_LEAD) continue;
    if (title.slice(end).trim().length < MIN_ACCENT) continue;
    boundary = end;
  }

  if (boundary < 0) return null;
  return segments(title.slice(0, boundary), title.slice(boundary));
}

/**
 * Split a headline into plain and accented runs.
 *
 * `titleAccent`, when it is a substring of `title`, is the accented run.
 *
 * Returns one segment per run, never an empty one, and at least one segment for
 * any non-empty title. The concatenated `text` of every segment reproduces the
 * title minus its emphasis markers, so a caller can render the segments and
 * derive the flat string from the same source of truth. An empty title returns
 * no segments; the section schema already rejects one, so this only keeps the
 * function total.
 */
export function splitTitleEmphasis(title: string, titleAccent?: string): TitleSegment[] {
  if (!title) return [];

  const explicit = titleAccent?.trim();
  if (explicit) {
    const start = title.indexOf(explicit);
    if (start >= 0) {
      const end = start + explicit.length;
      return [
        ...(start > 0 ? [{ text: title.slice(0, start), accent: false }] : []),
        { text: explicit, accent: true },
        ...(end < title.length ? [{ text: title.slice(end), accent: false }] : []),
      ];
    }
    // The accent no longer appears in the title. Fall through rather than
    // render a phrase the headline does not contain.
  }

  MARKED_RUNS.lastIndex = 0;
  const marked: TitleSegment[] = [];
  let cursor = 0;

  for (let match = MARKED_RUNS.exec(title); match; match = MARKED_RUNS.exec(title)) {
    const before = title.slice(cursor, match.index);
    if (before) marked.push({ text: before, accent: false });
    marked.push({ text: match[1], accent: true });
    cursor = match.index + match[0].length;
  }

  if (marked.length) {
    const tail = title.slice(cursor);
    if (tail) marked.push({ text: tail, accent: false });
    return marked;
  }

  return (
    splitOnColon(title) ??
    splitOnDash(title) ??
    splitOnClosingSentence(title) ??
    splitOnClosingClause(title) ??
    plain(title)
  );
}

/** The headline as flat text, with emphasis markers removed. For alt text, aria-labels and metadata. */
export function stripTitleEmphasis(title: string): string {
  return splitTitleEmphasis(title)
    .map((segment) => segment.text)
    .join("");
}
