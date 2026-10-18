"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

import type {
  ArticleCategory,
  ArticleDisplayType,
  ArticleSeed,
  ArticleStatus,
} from "@/types/content";

type ArticleFormMode = "create" | "edit";

type ArticleFormValues = {
  title: string;
  slug: string;
  category: ArticleCategory;
  status: ArticleStatus;
  type: ArticleDisplayType;
  excerpt: string;
  publishedAt: string;
  coverImage: string;
  coverAlt: string;
  tags: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  featured: boolean;
  readTimeMinutes: string;
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
  seoOgImage: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  errors?: {
    fieldErrors?: Partial<Record<keyof ArticleFormValues, string[]>>;
  };
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

type ArticleFormProps = {
  mode: ArticleFormMode;
  article?: ArticleSeed;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

const textareaClassName =
  "mt-2 min-h-32 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm leading-7 text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

const categoryOptions: Array<{ value: ArticleCategory; label: string }> = [
  { value: "news", label: "News" },
  { value: "blogs", label: "Blogs" },
];

const statusOptions: Array<{ value: ArticleStatus; label: string }> = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

const typeOptions: Array<{ value: ArticleDisplayType; label: string }> = [
  { value: "News", label: "News" },
  { value: "Blog", label: "Blog" },
  { value: "Event", label: "Event" },
  { value: "Press", label: "Press" },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getDefaultContentHtml(article?: ArticleSeed) {
  if (article?.contentHtml) {
    return article.contentHtml;
  }

  if (article?.content.length) {
    return article.content.map((paragraph) => `<p>${paragraph}</p>`).join("");
  }

  return "<p></p>";
}

function getInitialValues(article?: ArticleSeed): ArticleFormValues {
  return {
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    category: article?.category ?? "news",
    status: article?.status ?? "draft",
    type: article?.type ?? "News",
    excerpt: article?.excerpt ?? "",
    publishedAt: article?.publishedAt ?? todayDate(),
    coverImage: article?.coverImage ?? "",
    coverAlt: article?.coverAlt ?? "",
    tags: (article?.tags ?? []).join(", "),
    authorName: article?.author?.name ?? "IT For Youth Ghana",
    authorRole: article?.author?.role ?? "Editorial Team",
    authorAvatar: article?.author?.avatar ?? "/images/logo/logo_small.jpg",
    featured: article?.featured ?? false,
    readTimeMinutes: article?.readTimeMinutes ? String(article.readTimeMinutes) : "",
    contentHtml: getDefaultContentHtml(article),
    seoTitle: article?.seo?.title ?? "",
    seoDescription: article?.seo?.description ?? "",
    seoOgImage: article?.seo?.ogImage ?? "",
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-rose-600">
      <AlertCircle className="h-4 w-4" />
      {message}
    </p>
  );
}

export function ArticleForm({ mode, article }: ArticleFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ArticleFormValues>(() => getInitialValues(article));
  const [fieldErrors, setFieldErrors] = useState<ApiResponse["errors"]>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(mode === "edit");
  const [submitState, setSubmitState] = useState<SubmitState>({
    type: "idle",
    message: "",
  });

  const getFieldError = (field: keyof ArticleFormValues) =>
    fieldErrors?.fieldErrors?.[field]?.[0];

  const updateValue = <Field extends keyof ArticleFormValues>(
    field: Field,
    value: ArticleFormValues[Field],
  ) => {
    setValues((current) => {
      const nextValues = {
        ...current,
        [field]: value,
      };

      if (field === "title" && !slugEdited) {
        nextValues.slug = slugify(String(value));
      }

      return nextValues;
    });
    setFieldErrors((current) => ({
      ...current,
      fieldErrors: {
        ...current?.fieldErrors,
        [field]: undefined,
      },
    }));
  };

  const submitPayload = {
    ...values,
    tags: values.tags,
    readTimeMinutes: values.readTimeMinutes,
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    setFieldErrors({});

    const endpoint =
      mode === "edit" && article
        ? `/api/admin/articles/${article.id ?? article.slug}`
        : "/api/admin/articles";

    try {
      const response = await fetch(endpoint, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitPayload),
      });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !payload?.success) {
        setFieldErrors(payload?.errors ?? {});
        throw new Error(payload?.message || "We could not save this article right now.");
      }

      setSubmitState({
        type: "success",
        message: payload.message || "Article saved.",
      });
      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not save this article right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!article) {
      return;
    }

    const confirmed = window.confirm(
      "Archive this elsewhere first if you need a record. Delete this article now?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch(`/api/admin/articles/${article.id ?? article.slug}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "We could not delete this article right now.");
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not delete this article right now.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {submitState.type !== "idle" ? (
        <div
          className={`flex items-start gap-3 rounded-[24px] border p-5 text-sm font-medium ${
            submitState.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {submitState.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5" />
          )}
          <span>{submitState.message}</span>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[0.68fr_0.32fr]">
        <div className="space-y-8">
          <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">
                Editorial
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">
                Article content
              </h2>
            </div>

            <div className="grid gap-5">
              <div>
                <label htmlFor="title" className="text-sm font-bold text-brand-ink">
                  Title
                </label>
                <input
                  id="title"
                  required
                  value={values.title}
                  onChange={(event) => updateValue("title", event.target.value)}
                  aria-invalid={Boolean(getFieldError("title"))}
                  className={inputClassName}
                  placeholder="Article title"
                />
                <FieldError message={getFieldError("title")} />
              </div>

              <div>
                <label htmlFor="slug" className="text-sm font-bold text-brand-ink">
                  Slug
                </label>
                <input
                  id="slug"
                  required
                  value={values.slug}
                  onChange={(event) => {
                    setSlugEdited(true);
                    updateValue("slug", slugify(event.target.value));
                  }}
                  aria-invalid={Boolean(getFieldError("slug"))}
                  className={inputClassName}
                  placeholder="article-url-slug"
                />
                <p className="mt-2 text-xs font-medium text-slate-500">
                  Public URL: /news-and-updates/{values.category}/{values.slug || "article-slug"}
                </p>
                <FieldError message={getFieldError("slug")} />
              </div>

              <div>
                <label htmlFor="excerpt" className="text-sm font-bold text-brand-ink">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  required
                  value={values.excerpt}
                  onChange={(event) => updateValue("excerpt", event.target.value)}
                  aria-invalid={Boolean(getFieldError("excerpt"))}
                  className={textareaClassName}
                  placeholder="A short summary for cards, listing pages, and metadata."
                />
                <FieldError message={getFieldError("excerpt")} />
              </div>

              <div>
                <label htmlFor="contentHtml" className="text-sm font-bold text-brand-ink">
                  Body HTML
                </label>
                <textarea
                  id="contentHtml"
                  required
                  value={values.contentHtml}
                  onChange={(event) => updateValue("contentHtml", event.target.value)}
                  aria-invalid={Boolean(getFieldError("contentHtml"))}
                  className="mt-2 min-h-[24rem] w-full rounded-2xl border border-brand-border bg-white px-4 py-3 font-mono text-sm leading-7 text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                  placeholder="<p>Write the article body here.</p>"
                />
                <p className="mt-2 text-xs font-medium text-slate-500">
                  Temporary rich text bridge: paste safe HTML here until TipTap and media uploads land.
                </p>
                <FieldError message={getFieldError("contentHtml")} />
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">
                Search
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">
                SEO metadata
              </h2>
            </div>

            <div className="grid gap-5">
              <div>
                <label htmlFor="seoTitle" className="text-sm font-bold text-brand-ink">
                  SEO title
                </label>
                <input
                  id="seoTitle"
                  value={values.seoTitle}
                  onChange={(event) => updateValue("seoTitle", event.target.value)}
                  aria-invalid={Boolean(getFieldError("seoTitle"))}
                  className={inputClassName}
                  placeholder="Falls back to article title"
                />
                <FieldError message={getFieldError("seoTitle")} />
              </div>

              <div>
                <label htmlFor="seoDescription" className="text-sm font-bold text-brand-ink">
                  SEO description
                </label>
                <textarea
                  id="seoDescription"
                  value={values.seoDescription}
                  onChange={(event) => updateValue("seoDescription", event.target.value)}
                  aria-invalid={Boolean(getFieldError("seoDescription"))}
                  className={textareaClassName}
                  placeholder="Falls back to excerpt"
                />
                <FieldError message={getFieldError("seoDescription")} />
              </div>

              <div>
                <label htmlFor="seoOgImage" className="text-sm font-bold text-brand-ink">
                  Open Graph image
                </label>
                <input
                  id="seoOgImage"
                  value={values.seoOgImage}
                  onChange={(event) => updateValue("seoOgImage", event.target.value)}
                  aria-invalid={Boolean(getFieldError("seoOgImage"))}
                  className={inputClassName}
                  placeholder="Falls back to cover image"
                />
                <FieldError message={getFieldError("seoOgImage")} />
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">
              Publishing
            </p>
            <div className="mt-5 grid gap-5">
              <div>
                <label htmlFor="status" className="text-sm font-bold text-brand-ink">
                  Status
                </label>
                <select
                  id="status"
                  value={values.status}
                  onChange={(event) =>
                    updateValue("status", event.target.value as ArticleStatus)
                  }
                  className={inputClassName}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="category" className="text-sm font-bold text-brand-ink">
                  Category
                </label>
                <select
                  id="category"
                  value={values.category}
                  onChange={(event) =>
                    updateValue("category", event.target.value as ArticleCategory)
                  }
                  className={inputClassName}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" className="text-sm font-bold text-brand-ink">
                  Display label
                </label>
                <select
                  id="type"
                  value={values.type}
                  onChange={(event) =>
                    updateValue("type", event.target.value as ArticleDisplayType)
                  }
                  className={inputClassName}
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="publishedAt" className="text-sm font-bold text-brand-ink">
                  Publish date
                </label>
                <input
                  id="publishedAt"
                  type="date"
                  required
                  value={values.publishedAt}
                  onChange={(event) => updateValue("publishedAt", event.target.value)}
                  aria-invalid={Boolean(getFieldError("publishedAt"))}
                  className={inputClassName}
                />
                <FieldError message={getFieldError("publishedAt")} />
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-brand-border bg-brand-mist/45 p-4">
                <input
                  type="checkbox"
                  checked={values.featured}
                  onChange={(event) => updateValue("featured", event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-deep focus:ring-brand-accent"
                />
                <span>
                  <span className="block text-sm font-bold text-brand-ink">
                    Feature this article
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">
                    Featured articles appear in the hub lead area.
                  </span>
                </span>
              </label>
            </div>
          </section>

          <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">
              Media
            </p>
            <div className="mt-5 grid gap-5">
              <div>
                <label htmlFor="coverImage" className="text-sm font-bold text-brand-ink">
                  Cover image path
                </label>
                <input
                  id="coverImage"
                  value={values.coverImage}
                  onChange={(event) => updateValue("coverImage", event.target.value)}
                  aria-invalid={Boolean(getFieldError("coverImage"))}
                  className={inputClassName}
                  placeholder="/images/..."
                />
                <FieldError message={getFieldError("coverImage")} />
              </div>

              <div>
                <label htmlFor="coverAlt" className="text-sm font-bold text-brand-ink">
                  Cover alt text
                </label>
                <textarea
                  id="coverAlt"
                  value={values.coverAlt}
                  onChange={(event) => updateValue("coverAlt", event.target.value)}
                  aria-invalid={Boolean(getFieldError("coverAlt"))}
                  className={textareaClassName}
                  placeholder="Describe the image for accessibility."
                />
                <FieldError message={getFieldError("coverAlt")} />
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">
              Details
            </p>
            <div className="mt-5 grid gap-5">
              <div>
                <label htmlFor="tags" className="text-sm font-bold text-brand-ink">
                  Tags
                </label>
                <input
                  id="tags"
                  value={values.tags}
                  onChange={(event) => updateValue("tags", event.target.value)}
                  aria-invalid={Boolean(getFieldError("tags"))}
                  className={inputClassName}
                  placeholder="Training, Scholarships, Cohort 7"
                />
                <FieldError message={getFieldError("tags")} />
              </div>

              <div>
                <label htmlFor="readTimeMinutes" className="text-sm font-bold text-brand-ink">
                  Read time override
                </label>
                <input
                  id="readTimeMinutes"
                  type="number"
                  min="1"
                  value={values.readTimeMinutes}
                  onChange={(event) => updateValue("readTimeMinutes", event.target.value)}
                  aria-invalid={Boolean(getFieldError("readTimeMinutes"))}
                  className={inputClassName}
                  placeholder="Auto-calculated if blank"
                />
                <FieldError message={getFieldError("readTimeMinutes")} />
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">
              Author
            </p>
            <div className="mt-5 grid gap-5">
              <div>
                <label htmlFor="authorName" className="text-sm font-bold text-brand-ink">
                  Name
                </label>
                <input
                  id="authorName"
                  required
                  value={values.authorName}
                  onChange={(event) => updateValue("authorName", event.target.value)}
                  aria-invalid={Boolean(getFieldError("authorName"))}
                  className={inputClassName}
                />
                <FieldError message={getFieldError("authorName")} />
              </div>

              <div>
                <label htmlFor="authorRole" className="text-sm font-bold text-brand-ink">
                  Role
                </label>
                <input
                  id="authorRole"
                  required
                  value={values.authorRole}
                  onChange={(event) => updateValue("authorRole", event.target.value)}
                  aria-invalid={Boolean(getFieldError("authorRole"))}
                  className={inputClassName}
                />
                <FieldError message={getFieldError("authorRole")} />
              </div>

              <div>
                <label htmlFor="authorAvatar" className="text-sm font-bold text-brand-ink">
                  Avatar path
                </label>
                <input
                  id="authorAvatar"
                  value={values.authorAvatar}
                  onChange={(event) => updateValue("authorAvatar", event.target.value)}
                  aria-invalid={Boolean(getFieldError("authorAvatar"))}
                  className={inputClassName}
                />
                <FieldError message={getFieldError("authorAvatar")} />
              </div>
            </div>
          </section>

          <div className="sticky bottom-6 rounded-[28px] border border-brand-border bg-white/95 p-4 shadow-panel backdrop-blur">
            <div className="grid gap-3">
              <button
                type="submit"
                disabled={isSubmitting || isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-deep px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {mode === "edit" ? "Save changes" : "Create article"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin/articles")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-border px-5 py-3 text-sm font-bold text-brand-deep transition hover:border-brand-accent"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to articles
              </button>

              {mode === "edit" && article ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting || isDeleting}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 px-5 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete article
                </button>
              ) : null}
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
