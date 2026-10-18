import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";

const root = process.cwd();
const outDir = join(root, ".superdesign", "init");

const read = (path) => readFileSync(join(root, path), "utf8");
const fence = (path) => {
  const language = extname(path).slice(1).replace("tsx", "tsx").replace("mjs", "js") || "text";
  return `### \`${path}\`\n\n\`\`\`${language}\n${read(path).trimEnd()}\n\`\`\`\n`;
};

const walk = (dir, predicate) => {
  const paths = [];
  for (const entry of readdirSync(join(root, dir), { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) paths.push(...walk(path, predicate));
    else if (predicate(path)) paths.push(path.split(sep).join("/"));
  }
  return paths.sort();
};

const resolveLocalImport = (fromPath, specifier) => {
  const base = specifier.startsWith("@/")
    ? join(root, specifier.slice(2))
    : resolve(root, dirname(fromPath), specifier);
  const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.jsx`, join(base, "index.ts"), join(base, "index.tsx")];
  const match = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
  return match ? relative(root, match).split(sep).join("/") : null;
};

const localImports = (path) => {
  const imports = [];
  const source = read(path);
  const pattern = /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;
  for (const match of source.matchAll(pattern)) {
    if (!match[1].startsWith(".") && !match[1].startsWith("@/")) continue;
    const resolved = resolveLocalImport(path, match[1]);
    if (resolved) imports.push(resolved);
  }
  return [...new Set(imports)].sort();
};

const dependencyTree = (entry) => {
  const visited = new Set();
  const lines = [];
  const visit = (path, depth) => {
    lines.push(`${"  ".repeat(depth)}- ${path}`);
    if (visited.has(path)) return;
    visited.add(path);
    for (const child of localImports(path)) visit(child, depth + 1);
  };
  visit(entry, 0);
  return lines.join("\n");
};

mkdirSync(outDir, { recursive: true });

const uiFiles = [
  "components/ui/button.tsx",
  "components/ui/card.tsx",
  "components/ui/form-field.tsx",
  "components/ui/state-message.tsx",
];
writeFileSync(
  join(outDir, "components.md"),
  `# Shared UI components\n\nFramework: React 18 with Next.js 14 App Router. Styling: Tailwind CSS 3 with custom primitives.\n\n${uiFiles.map(fence).join("\n")}`,
);

const layoutFiles = [
  "app/layout.tsx",
  "app/(public)/layout.tsx",
  "components/layout/announcement-bar.tsx",
  "components/layout/site-header.tsx",
  "components/layout/site-footer.tsx",
  "components/layout/page-container.tsx",
];
writeFileSync(
  join(outDir, "layouts.md"),
  `# Shared layouts\n\nThe root layout owns global metadata and fonts. The public layout renders the announcement bar, site header, floating affordances and footer.\n\n${layoutFiles.map(fence).join("\n")}`,
);

const routeFiles = walk("app", (path) => /\/page\.tsx$/.test(`/${path}`));
const routeFor = (path) => {
  const withoutApp = path.replace(/^app\//, "").replace(/\/page\.tsx$/, "");
  const route = withoutApp
    .split("/")
    .filter((part) => !/^\(.+\)$/.test(part) && part !== "page.tsx" && part !== "layout.tsx")
    .join("/");
  return `/${route}`.replace(/\/$/, "") || "/";
};
writeFileSync(
  join(outDir, "routes.md"),
  `# App Router map\n\n${routeFiles.map((path) => `- \`${routeFor(path)}\` -> \`${path}\``).join("\n")}\n\n## Key pages\n\n- \`/\`: public homepage composed by \`HomepageSections\`; the hero is \`HeroCapsuleSlideshow\`.\n- \`/what-we-do\`: editorial programme overview.\n- \`/apply-for-training\`: public training funnel.\n- \`/admin/dashboard\`: authenticated CMS dashboard.\n`,
);

const tailwind = read("tailwind.config.ts");
const globals = read("app/globals.css");
const cssToken = (name) => {
  const match = globals.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`Missing CSS token --${name}`);
  return match[1].trim();
};
writeFileSync(
  join(outDir, "theme.md"),
  `# Theme\n\n## Compact token summary\n\n- Brand primary: \`${cssToken("color-primary")}\`; dark: \`${cssToken("color-primary-dark")}\`; light: \`${cssToken("color-primary-light")}\`.\n- Accent: \`${cssToken("color-accent")}\`; accent dark: \`${cssToken("color-accent-dark")}\`.\n- Text: \`${cssToken("color-text")}\`; background: \`${cssToken("color-bg")}\`; border: \`${cssToken("color-border")}\`.\n- Display font: \`${cssToken("font-heading")}\`. Body font: \`${cssToken("font-body")}\`.\n- Radius tokens: control \`${cssToken("radius-control")}\`, media \`${cssToken("radius-media")}\`, panel \`${cssToken("radius-panel")}\`, capsule \`${cssToken("radius-capsule")}\`.\n- Layout: editorial, image-led, high-contrast navy/white/crimson with restrained glass surfaces.\n- Tailwind breakpoints use the defaults.\n\n## Raw sources\n\n### \`tailwind.config.ts\`\n\n\`\`\`ts\n${tailwind.trimEnd()}\n\`\`\`\n\n### \`app/globals.css\`\n\n\`\`\`css\n${globals.trimEnd()}\n\`\`\`\n`,
);

const keyPages = [
  ["/", "app/(public)/page.tsx"],
  ["/what-we-do", "app/(public)/what-we-do/page.tsx"],
  ["/apply-for-training", "app/(public)/apply-for-training/page.tsx"],
  ["/apply-for-training/courses", "app/(public)/apply-for-training/courses/page.tsx"],
  ["/our-impact", "app/(public)/our-impact/page.tsx"],
  ["/news-and-updates", "app/(public)/news-and-updates/page.tsx"],
  ["/contact", "app/(public)/contact/page.tsx"],
  ["/partner-with-us", "app/(public)/partner-with-us/page.tsx"],
  ["/who-we-are", "app/(public)/who-we-are/page.tsx"],
  ["/admin/dashboard", "app/(admin)/admin/dashboard/page.tsx"],
];
writeFileSync(
  join(outDir, "pages.md"),
  `# Key page dependency trees\n\n${keyPages.map(([route, entry]) => `## ${route}\n\nEntry: \`${entry}\`\n\nDependencies:\n${dependencyTree(entry)}\n`).join("\n")}`,
);

writeFileSync(
  join(outDir, "extractable-components.md"),
  `# Extractable components\n\n## SiteHeader\n- Source: \`components/layout/site-header.tsx\`\n- Category: layout\n- Description: Public navigation with the real ITFYG logo, desktop links and mobile menu.\n- Extractable props: none; content is supplied by the site configuration.\n- Hardcoded: responsive structure, CSS classes and icon geometry.\n\n## SiteFooter\n- Source: \`components/layout/site-footer.tsx\`\n- Category: layout\n- Description: Public footer with identity, navigation columns and contact details.\n- Extractable props: none; content is supplied by the site configuration.\n- Hardcoded: responsive structure and CSS classes.\n\n## CapsuleShell\n- Source: \`components/capsule/capsule-shell.tsx\`\n- Category: basic\n- Description: Shared media-and-content capsule geometry used by hero and page intros.\n- Extractable props: tone, variant, media, children.\n- Hardcoded: capsule class names and animation hook.\n`,
);

console.log(`Generated six Superdesign init files in ${relative(root, outDir)}`);
