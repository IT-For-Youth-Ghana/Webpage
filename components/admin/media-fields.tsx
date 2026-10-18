import { MISSING_ALT_MESSAGE, describeMediaUrlProblem } from "@/lib/cms/media-url";
import { MEDIA_TREATMENTS, type MediaTreatment } from "@/types/content";

type MediaFieldsProps = {
  /** Namespaces every id on the group, so a repeated group stays labelable. */
  idPrefix: string;
  /** What this photograph is for. "Hero image", "Section image". */
  label: string;
  image?: string;
  imageAlt?: string;
  onImageChange: (value: string) => void;
  onImageAltChange: (value: string) => void;
  /** Omit both to hide the video field. */
  videoUrl?: string;
  onVideoUrlChange?: (value: string) => void;
  /** Omit the handler to hide the layout select, as the hero has one layout. */
  treatment?: MediaTreatment;
  onTreatmentChange?: (value: MediaTreatment | undefined) => void;
  imagePlaceholder?: string;
  className?: string;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

const invalidClass = "border-rose-400 focus:border-rose-400 focus:ring-rose-200";

const labelClass = "text-sm font-bold text-brand-ink";

const hintClass = "mt-1.5 text-xs text-brand-muted";

const problemClass = "mt-1.5 text-xs font-semibold text-rose-700";

/** The value of the select when the record carries no treatment. */
const AUTOMATIC = "";

/**
 * The image, its alt text, its optional video and its layout, as one group.
 *
 * Two failures it closes, both of which were live in the site-page editor.
 *
 * First, sections had no media fields at all: `ContentBlock` has carried
 * `image`, `imageAlt` and `videoUrl` for as long as the public template has
 * read them, and the only way to populate them was to edit Firestore by hand.
 * An editor could see a photograph on the page and had nowhere to change it.
 *
 * Second, the fields that did exist accepted any string. The verdict shown here
 * is `describeMediaUrlProblem`, the same function lib/utils/validators.ts
 * applies at the save boundary, so the sentence under the input while the
 * editor types is the sentence the save will act on. Before this, an
 * off-allowlist host was accepted, answered "saved", and then threw inside
 * next/image on a visitor's request, where no editor would ever see it.
 *
 * The layout select is built from MEDIA_TREATMENTS rather than a literal list,
 * so the type, this form and the Zod enum cannot drift into three lists. Its
 * empty value is a real choice, not a null state: leaving it on Automatic keeps
 * the template's rhythm, which is what every record written before the field
 * existed does.
 */
export function MediaFields({
  idPrefix,
  label,
  image,
  imageAlt,
  onImageChange,
  onImageAltChange,
  videoUrl,
  onVideoUrlChange,
  treatment,
  onTreatmentChange,
  imagePlaceholder = "/images/randomPictures/graduation.jpg",
  className,
}: MediaFieldsProps) {
  const src = image?.trim() ?? "";
  const alt = imageAlt?.trim() ?? "";
  const urlProblem = describeMediaUrlProblem(image);
  /* Alt is only owed once a photograph is actually there. Demanding it on an
     empty field would flag every section that has no media by design. */
  const altProblem = src && !alt ? MISSING_ALT_MESSAGE : null;

  const imageId = `${idPrefix}-image`;
  const imageHintId = `${idPrefix}-image-hint`;
  const altId = `${idPrefix}-image-alt`;
  const altHintId = `${idPrefix}-image-alt-hint`;
  const videoId = `${idPrefix}-video-url`;
  const treatmentId = `${idPrefix}-treatment`;
  const treatmentHintId = `${idPrefix}-treatment-hint`;

  return (
    <div className={className}>
      <div>
        <label htmlFor={imageId} className={labelClass}>
          {label}
        </label>
        <input
          id={imageId}
          value={image ?? ""}
          onChange={(event) => onImageChange(event.target.value)}
          className={`${inputClass} ${urlProblem ? invalidClass : ""}`}
          placeholder={imagePlaceholder}
          aria-invalid={urlProblem ? true : undefined}
          aria-describedby={imageHintId}
        />
        <p id={imageHintId} className={urlProblem ? problemClass : hintClass}>
          {urlProblem ??
            "A path inside this repository, or an https address on an approved image host."}
        </p>
      </div>

      <div className="mt-4">
        <label htmlFor={altId} className={labelClass}>
          {label} alt text
        </label>
        <input
          id={altId}
          value={imageAlt ?? ""}
          onChange={(event) => onImageAltChange(event.target.value)}
          className={`${inputClass} ${altProblem ? invalidClass : ""}`}
          placeholder="Learners working through a practical exercise together"
          aria-invalid={altProblem ? true : undefined}
          aria-describedby={altHintId}
        />
        <p id={altHintId} className={altProblem ? problemClass : hintClass}>
          {altProblem ??
            "Describe what is happening in the photograph. Do not repeat the heading: a screen-reader user has already heard it."}
        </p>
      </div>

      {onVideoUrlChange ? (
        <div className="mt-4">
          <label htmlFor={videoId} className={labelClass}>
            {label} video URL (optional)
          </label>
          <input
            id={videoId}
            value={videoUrl ?? ""}
            onChange={(event) => onVideoUrlChange(event.target.value)}
            className={inputClass}
            placeholder="https://www.youtube.com/watch?v=… or https://vimeo.com/…"
          />
        </div>
      ) : null}

      {onTreatmentChange ? (
        <div className="mt-4">
          <label htmlFor={treatmentId} className={labelClass}>
            Layout
          </label>
          <select
            id={treatmentId}
            value={treatment ?? AUTOMATIC}
            onChange={(event) =>
              onTreatmentChange(
                event.target.value === AUTOMATIC
                  ? undefined
                  : (event.target.value as MediaTreatment),
              )
            }
            className={inputClass}
            aria-describedby={treatmentHintId}
          >
            <option value={AUTOMATIC}>Automatic, follow the page rhythm</option>
            {MEDIA_TREATMENTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p id={treatmentHintId} className={hintClass}>
            Automatic varies the treatment down the page so no two neighbouring
            sections look alike. Pin one when this photograph needs a particular
            frame, and reordering the sections will no longer change it.
          </p>
        </div>
      ) : null}
    </div>
  );
}
