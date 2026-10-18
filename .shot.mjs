import { chromium } from "@playwright/test";
const out = process.env.OUT;
const routes = [
  ["wwd-girls", "/what-we-do/girls-in-tech"],
  ["wwd-venture", "/what-we-do/entrepreneurship-hub"],
  ["train-courses", "/apply-for-training/courses"],
  ["train-how", "/apply-for-training/how-it-works"],
];
const b = await chromium.launch();
for (const [name, route] of routes) {
  for (const [vp, w, h] of [["desk", 1440, 900], ["mob", 390, 844]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    try {
      await p.goto("http://127.0.0.1:3100" + route, { waitUntil: "networkidle", timeout: 120000 });
      await p.waitForTimeout(1800);
      await p.screenshot({ path: `${out}/new-${name}-${vp}.png` });
      console.log("ok", name, vp, await p.title());
    } catch (e) { console.log("FAIL", name, vp, e.message.split("\n")[0]); }
    await p.close();
  }
}
await b.close();
