import {
  articles as seedArticles,
  getArticleReadTime,
} from "@/lib/content/news-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { ArticlePayload } from "@/lib/utils/validators";
import type { ArticleCategory, ArticleSeed } from "@/types/content";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

type CmsArticleOptions = {
  includeDrafts?: boolean;
};

type CmsWriteResult = {
  configured: boolean;
  written: boolean;
  id?: string;
};

function toDateString(value: unknown) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString().slice(0, 10);
  }

  return new Date().toISOString().slice(0, 10);
}

function stripUndefined(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, stripUndefined(item)]),
    );
  }

  return value;
}

function extractParagraphs(contentHtml: string) {
  const paragraphMatches = contentHtml.match(/<p[^>]*>[\s\S]*?<\/p>/gi);

  if (paragraphMatches?.length) {
    return paragraphMatches
      .map((paragraph) => paragraph.replace(/<[^>]+>/g, " "))
      .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
      .filter(Boolean);
  }

  const plainText = contentHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plainText ? [plainText] : [];
}

function sanitizeArticleHtml(contentHtml: string) {
  return contentHtml
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, "")
    .replace(/\s(href|src)\s*=\s*javascript:[^\s>]+/gi, "");
}

function sortArticles(articles: ArticleSeed[]) {
  return [...articles].sort(
    (left, right) =>
      new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
}

function isPublicArticle(article: ArticleSeed) {
  return article.status !== "draft" && article.status !== "archived";
}

function normalizeArticle(id: string, data: Record<string, unknown>): ArticleSeed {
  const contentHtml =
    typeof data.contentHtml === "string" ? sanitizeArticleHtml(data.contentHtml) : "";
  const content = Array.isArray(data.content)
    ? data.content.filter((item): item is string => typeof item === "string")
    : extractParagraphs(contentHtml);

  const authorData =
    data.author && typeof data.author === "object"
      ? (data.author as Record<string, unknown>)
      : undefined;
  const seoData =
    data.seo && typeof data.seo === "object"
      ? (data.seo as Record<string, unknown>)
      : undefined;

  return {
    id,
    slug: typeof data.slug === "string" ? data.slug : id,
    category: data.category === "blogs" ? "blogs" : "news",
    status:
      data.status === "draft" || data.status === "archived" || data.status === "published"
        ? data.status
        : "draft",
    type:
      data.type === "Blog" || data.type === "Event" || data.type === "Press"
        ? data.type
        : "News",
    title: typeof data.title === "string" ? data.title : "Untitled article",
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    publishedAt: toDateString(data.publishedAt),
    updatedAt: data.updatedAt ? toDateString(data.updatedAt) : undefined,
    coverImage: typeof data.coverImage === "string" ? data.coverImage : undefined,
    coverAlt: typeof data.coverAlt === "string" ? data.coverAlt : undefined,
    tags: Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    author: authorData
      ? {
          name: typeof authorData.name === "string" ? authorData.name : "ITFY Team",
          role: typeof authorData.role === "string" ? authorData.role : "Editorial",
          avatar: typeof authorData.avatar === "string" ? authorData.avatar : undefined,
        }
      : undefined,
    featured: data.featured === true,
    seo: seoData
      ? {
          title: typeof seoData.title === "string" ? seoData.title : "",
          description: typeof seoData.description === "string" ? seoData.description : "",
          ogImage: typeof seoData.ogImage === "string" ? seoData.ogImage : undefined,
        }
      : undefined,
    readTimeMinutes:
      typeof data.readTimeMinutes === "number" ? data.readTimeMinutes : undefined,
    content,
    contentHtml,
  };
}

function articleFromPayload(payload: ArticlePayload, id?: string): ArticleSeed {
  const contentHtml = sanitizeArticleHtml(payload.contentHtml);
  const article: ArticleSeed = {
    id,
    slug: payload.slug,
    category: payload.category,
    status: payload.status,
    type: payload.type,
    title: payload.title,
    excerpt: payload.excerpt,
    publishedAt: payload.publishedAt,
    coverImage: payload.coverImage,
    coverAlt: payload.coverAlt,
    tags: payload.tags,
    author: {
      name: payload.authorName,
      role: payload.authorRole,
      avatar: payload.authorAvatar,
    },
    featured: payload.featured,
    readTimeMinutes: payload.readTimeMinutes,
    content: extractParagraphs(contentHtml),
    contentHtml,
    seo: {
      title: payload.seoTitle ?? payload.title,
      description: payload.seoDescription ?? payload.excerpt,
      ogImage: payload.seoOgImage ?? payload.coverImage,
    },
  };

  return {
    ...article,
    readTimeMinutes: article.readTimeMinutes ?? getArticleReadTime(article),
  };
}

function getSeedArticles(options: CmsArticleOptions = {}) {
  const includeDrafts = options.includeDrafts ?? false;
  const scopedArticles = includeDrafts ? seedArticles : seedArticles.filter(isPublicArticle);

  return sortArticles(scopedArticles);
}

export async function getCmsArticles(options: CmsArticleOptions = {}) {
  const db = await getAdminFirestore();

  if (!db) {
    return getSeedArticles(options);
  }

  try {
    const snapshot = await db.collection(FIREBASE_COLLECTIONS.articles).get();
    const allArticles = snapshot.docs.map((doc) => normalizeArticle(doc.id, doc.data()));
    const scopedArticles = options.includeDrafts
      ? allArticles
      : allArticles.filter(isPublicArticle);

    return sortArticles(scopedArticles);
  } catch (error) {
    console.error("Firestore article read failed. Falling back to seed articles.", error);
    return getSeedArticles(options);
  }
}

export async function getCmsPublishedArticles() {
  return getCmsArticles({ includeDrafts: false });
}

export async function getCmsFeaturedArticles(limit = 3) {
  return (await getCmsPublishedArticles())
    .filter((article) => article.featured)
    .slice(0, limit);
}

export async function getCmsArticlesByCategory(category: ArticleCategory) {
  return (await getCmsPublishedArticles()).filter((article) => article.category === category);
}

export async function getCmsArticleById(id: string) {
  const db = await getAdminFirestore();

  if (!db) {
    return seedArticles.find((article) => article.id === id || article.slug === id);
  }

  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.articles).doc(id).get();

    if (doc.exists) {
      return normalizeArticle(doc.id, doc.data() ?? {});
    }

    const slugMatch = await db
      .collection(FIREBASE_COLLECTIONS.articles)
      .where("slug", "==", id)
      .limit(1)
      .get();

    if (slugMatch.empty) {
      return undefined;
    }

    const matchedDoc = slugMatch.docs[0];
    return normalizeArticle(matchedDoc.id, matchedDoc.data());
  } catch (error) {
    console.error("Firestore article lookup failed. Falling back to seed articles.", error);
    return seedArticles.find((article) => article.id === id || article.slug === id);
  }
}

export async function getCmsArticleBySlug(category: ArticleCategory, slug: string) {
  const articles = await getCmsPublishedArticles();

  return articles.find(
    (article) => article.category === category && article.slug === slug,
  );
}

export async function getCmsRelatedArticles(article: ArticleSeed, limit = 3) {
  const articleTags = new Set(article.tags ?? []);

  return (await getCmsPublishedArticles())
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => {
      const sharedTags = (candidate.tags ?? []).filter((tag) => articleTags.has(tag)).length;
      const categoryScore = candidate.category === article.category ? 1 : 0;

      return {
        article: candidate,
        score: sharedTags + categoryScore,
      };
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return (
        new Date(right.article.publishedAt).getTime() -
        new Date(left.article.publishedAt).getTime()
      );
    })
    .slice(0, limit)
    .map((entry) => entry.article);
}

export async function getCmsArticleTags(category?: ArticleCategory) {
  const scopedArticles = category
    ? await getCmsArticlesByCategory(category)
    : await getCmsPublishedArticles();

  return Array.from(
    new Set(scopedArticles.flatMap((article) => article.tags ?? [])),
  ).sort((left, right) => left.localeCompare(right));
}

export async function saveCmsArticle(payload: ArticlePayload, id?: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  const docRef = id
    ? db.collection(FIREBASE_COLLECTIONS.articles).doc(id)
    : db.collection(FIREBASE_COLLECTIONS.articles).doc();
  const article = articleFromPayload(payload, docRef.id);
  const { FieldValue } = await import("firebase-admin/firestore");
  const timestamps = id
    ? { updatedAt: FieldValue.serverTimestamp() }
    : {
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

  await docRef.set(
    {
      ...(stripUndefined(article) as Record<string, unknown>),
      ...timestamps,
    },
    { merge: true },
  );

  return {
    configured: true,
    written: true,
    id: docRef.id,
  };
}

export async function deleteCmsArticle(id: string): Promise<CmsWriteResult> {
  const db = await getAdminFirestore();

  if (!db) {
    return {
      configured: false,
      written: false,
    };
  }

  await db.collection(FIREBASE_COLLECTIONS.articles).doc(id).delete();

  return {
    configured: true,
    written: true,
    id,
  };
}
