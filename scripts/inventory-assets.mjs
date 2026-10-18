#!/usr/bin/env node
/**
 * Media asset inventory for the ITFYG redesign.
 *
 * Orientation is the point of this, more than the file list. A page that needs
 * tall portrait media cannot be built from a library of wide landscape shots,
 * and finding that out after the layout is designed wastes the design.
 *
 * Dimensions are read straight from the JPEG/PNG headers so this needs no image
 * library and stays runnable in CI.
 *
 * Usage: node scripts/inventory-assets.mjs [--json]
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();

/* ------------------------------------------------------------- dimensions */

function pngSize(buf) {
  // IHDR width/height are big-endian uint32 at offsets 16 and 20.
  if (buf.length < 24) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function jpegSize(buf) {
  // Walk the marker segments to the first Start-Of-Frame.
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) { i += 1; continue; }
    const marker = buf[i + 1];
    // SOF0..SOF3, SOF5..SOF7, SOF9..SOF11, SOF13..SOF15 carry the dimensions.
    const isSOF =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);
    if (isSOF) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

/**
 * Format is sniffed from the magic bytes, never from the extension.
 * public/images/logo/logo.png is really a JPEG, and dispatching on ".png"
 * parsed its bytes as an IHDR header and produced 4718592x4292935756.
 */
function sniff(buf) {
  if (buf.length >= 8 && buf.readUInt32BE(0) === 0x89504e47) return "png";
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

function dimensions(file) {
  let buf;
  try { buf = readFileSync(file); } catch { return null; }
  const real = sniff(buf);
  if (real === "png") return { ...pngSize(buf), real };
  if (real === "jpeg") return { ...jpegSize(buf), real };
  return real ? { w: null, h: null, real } : null;
}

/* ----------------------------------------------------------------- walking */

const MEDIA = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg", ".mp4", ".webm"]);

export function walkMedia(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkMedia(full, out);
    else if (MEDIA.has(extname(entry).toLowerCase())) out.push(full);
  }
  return out;
}

/* ------------------------------------------------------- reference counting */

const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);

/** Recursively find source files without relying on an installed shell tool. */
export function walkSourceFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkSourceFiles(full, out);
    else if (SOURCE_EXTENSIONS.has(extname(entry).toLowerCase())) out.push(full);
  }
  return out;
}

/** How many times each asset path appears in source, and in which files. */
export function references(assetPaths, root = ROOT) {
  const index = new Map(assetPaths.map((p) => [p, []]));
  const sources = ["app", "components", "lib"]
    .flatMap((directory) => walkSourceFiles(join(root, directory)))
    .filter((file) => /\/(?:images|reports|videos)\b/.test(readFileSync(file, "utf8")));

  for (const absoluteFile of sources) {
    const text = readFileSync(absoluteFile, "utf8");
    const file = relative(root, absoluteFile).split("\\").join("/");
    for (const p of assetPaths) {
      if (text.includes(p)) index.get(p).push(file);
    }
  }
  return index;
}

/* ------------------------------------------------------------------- report */

// Matches "Download", "Download (3)", "IMG_1234", "DSC0001", "Screenshot 2".
const GENERIC = /^(download|image|img|photo|untitled|screenshot|whatsapp|dsc)[-_ ]*(\(\d+\)|\d*)$/i;

export function createAssetInventory(root = ROOT) {
  const publicDirectory = join(root, "public");
  const files = walkMedia(publicDirectory);
  const assets = files.map((full) => {
    const webPath = "/" + relative(publicDirectory, full).split("\\").join("/");
    const dim = dimensions(full);
    const bytes = statSync(full).size;
    const base = webPath.split("/").pop().replace(extname(webPath), "");
    return {
      path: webPath,
      dir: "/" + relative(publicDirectory, full).split("\\").join("/").split("/").slice(0, -1).join("/"),
      ext: extname(webPath).toLowerCase(),
      bytes,
      kb: Math.round(bytes / 1024),
      width: dim?.w ?? null,
      height: dim?.h ?? null,
      orientation: dim?.w && dim?.h
        ? (dim.w > dim.h * 1.15 ? "landscape" : dim.h > dim.w * 1.15 ? "portrait" : "square")
        : "unknown",
      genericName: GENERIC.test(base),
      oversized: bytes > 1024 * 1024,
      // A .png that is really a JPEG, or similar. Confuses tooling and humans.
      extensionMismatch: Boolean(
        dim?.real &&
          !((dim.real === "jpeg" && [".jpg", ".jpeg"].includes(extname(webPath).toLowerCase())) ||
            dim.real === extname(webPath).toLowerCase().slice(1)),
      ),
    };
  });

  const refs = references(assets.map((a) => a.path), root);
  for (const a of assets) {
    a.referencedIn = refs.get(a.path) ?? [];
    a.refCount = a.referencedIn.length;
  }

  const byDir = {};
  for (const a of assets) {
    byDir[a.dir] ??= { count: 0, landscape: 0, portrait: 0, square: 0, unknown: 0, unused: 0, oversized: 0, generic: 0 };
    const d = byDir[a.dir];
    d.count += 1;
    d[a.orientation] += 1;
    if (a.refCount === 0) d.unused += 1;
    if (a.oversized) d.oversized += 1;
    if (a.genericName) d.generic += 1;
  }

  return {
    totals: {
      files: assets.length,
      landscape: assets.filter((a) => a.orientation === "landscape").length,
      portrait: assets.filter((a) => a.orientation === "portrait").length,
      square: assets.filter((a) => a.orientation === "square").length,
      unreferenced: assets.filter((a) => a.refCount === 0).length,
      reusedAcrossFiles: assets.filter((a) => a.refCount > 1).length,
      oversized: assets.filter((a) => a.oversized).length,
      genericNames: assets.filter((a) => a.genericName).length,
      extensionMismatch: assets.filter((a) => a.extensionMismatch).length,
    },
    byDirectory: byDir,
    reused: assets.filter((a) => a.refCount > 1).sort((a, b) => b.refCount - a.refCount)
      .map((a) => ({ path: a.path, refCount: a.refCount, referencedIn: a.referencedIn })),
    oversized: assets.filter((a) => a.oversized).sort((a, b) => b.bytes - a.bytes)
      .map((a) => ({ path: a.path, kb: a.kb, width: a.width, height: a.height })),
    genericNames: assets.filter((a) => a.genericName).map((a) => a.path),
    extensionMismatch: assets.filter((a) => a.extensionMismatch)
      .map((a) => ({ path: a.path, actually: `${a.width}x${a.height}` })),
    unreferenced: assets.filter((a) => a.refCount === 0).map((a) => a.path),
    assets,
  };
}

export function printAssetInventory(report) {
  const t = report.totals;
  console.log("\nASSET INVENTORY\n");
  console.log(`  media files          ${t.files}`);
  console.log(`  landscape            ${t.landscape}`);
  console.log(`  portrait             ${t.portrait}`);
  console.log(`  square               ${t.square}`);
  console.log(`  never referenced     ${t.unreferenced}`);
  console.log(`  used in >1 file      ${t.reusedAcrossFiles}`);
  console.log(`  over 1 MB            ${t.oversized}`);
  console.log(`  generic filenames    ${t.genericNames}`);
  console.log(`  wrong extension      ${t.extensionMismatch}`);

  console.log("\n  BY DIRECTORY");
  console.log(`    ${"directory".padEnd(30)} ${"n".padStart(4)} ${"land".padStart(5)} ${"port".padStart(5)} ${"sqr".padStart(4)} ${"unused".padStart(7)} ${">1MB".padStart(5)}`);
  for (const [dir, d] of Object.entries(report.byDirectory).sort()) {
    console.log(`    ${dir.padEnd(30)} ${String(d.count).padStart(4)} ${String(d.landscape).padStart(5)} ${String(d.portrait).padStart(5)} ${String(d.square).padStart(4)} ${String(d.unused).padStart(7)} ${String(d.oversized).padStart(5)}`);
  }

  console.log("\n  REUSED ACROSS FILES (unintentional repetition is invisible page-by-page)");
  for (const a of report.reused.slice(0, 12)) {
    console.log(`    ${String(a.refCount)}x  ${a.path}`);
  }

  console.log("\n  OVER 1 MB (needs optimisation)");
  for (const a of report.oversized) console.log(`    ${String(a.kb).padStart(6)} KB  ${a.width}x${a.height}  ${a.path}`);

  if (report.extensionMismatch.length) {
    console.log("\n  EXTENSION DOES NOT MATCH CONTENT");
    for (const a of report.extensionMismatch) console.log(`    ${a.path}  (really ${a.actually})`);
  }

  console.log("\n  GENERIC FILENAMES (unmaintainable at scale)");
  for (const p of report.genericNames.slice(0, 20)) console.log(`    ${p}`);
  console.log("");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = createAssetInventory();
  if (process.argv.includes("--json")) console.log(JSON.stringify(report, null, 2));
  else printAssetInventory(report);
}
