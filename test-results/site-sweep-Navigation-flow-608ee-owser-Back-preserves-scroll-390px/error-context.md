# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: site-sweep.spec.ts >> Navigation flows (390px only) >> Portfolio → detail → browser Back preserves scroll
- Location: e2e\site-sweep.spec.ts:96:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - generic [ref=e5]:
      - link "Ajetix home" [ref=e6] [cursor=pointer]:
        - /url: /
        - img "Ajetix" [ref=e7]
        - generic [ref=e8]: Ajetix
      - button "Open menu" [ref=e9]:
        - img [ref=e10]
  - main [ref=e11]:
    - generic [ref=e13]:
      - text: Portfolio
      - heading "Twenty products, one team." [level=1] [ref=e14]
      - paragraph [ref=e15]: A selection of the work we've shipped over the past few years. Each one has a story — click through for the details.
    - generic [ref=e17]:
      - link "AI / ML Nova AI Analytics Real-time predictive analytics for fintech. +38% forecast accuracy · 60% faster insights" [ref=e18] [cursor=pointer]:
        - /url: /portfolio/nova-ai-analytics
        - generic [ref=e22]:
          - generic [ref=e23]: AI / ML
          - heading "Nova AI Analytics" [level=3] [ref=e24]
        - generic [ref=e25]:
          - paragraph [ref=e26]: Real-time predictive analytics for fintech.
          - paragraph [ref=e27]: +38% forecast accuracy · 60% faster insights
      - link "SaaS Helix SaaS Platform Enterprise-grade workflow automation. $3M ARR in 14 months" [ref=e28] [cursor=pointer]:
        - /url: /portfolio/helix-saas
        - generic [ref=e32]:
          - generic [ref=e33]: SaaS
          - heading "Helix SaaS Platform" [level=3] [ref=e34]
        - generic [ref=e35]:
          - paragraph [ref=e36]: Enterprise-grade workflow automation.
          - paragraph [ref=e37]: $3M ARR in 14 months
      - link "Mobile Orbit Mobile Cross-platform social fitness app. 500k+ installs · 4.9★ average rating" [ref=e38] [cursor=pointer]:
        - /url: /portfolio/orbit-mobile
        - generic [ref=e42]:
          - generic [ref=e43]: Mobile
          - heading "Orbit Mobile" [level=3] [ref=e44]
        - generic [ref=e45]:
          - paragraph [ref=e46]: Cross-platform social fitness app.
          - paragraph [ref=e47]: 500k+ installs · 4.9★ average rating
      - link "Cloud Atlas Cloud Multi-region Kubernetes migration. 70% infra cost reduction" [ref=e48] [cursor=pointer]:
        - /url: /portfolio/atlas-cloud
        - generic [ref=e52]:
          - generic [ref=e53]: Cloud
          - heading "Atlas Cloud" [level=3] [ref=e54]
        - generic [ref=e55]:
          - paragraph [ref=e56]: Multi-region Kubernetes migration.
          - paragraph [ref=e57]: 70% infra cost reduction
      - link "UI/UX Prism Design System Design language for a healthtech scale-up. 3× faster feature delivery" [ref=e58] [cursor=pointer]:
        - /url: /portfolio/prism-design
        - generic [ref=e62]:
          - generic [ref=e63]: UI/UX
          - heading "Prism Design System" [level=3] [ref=e64]
        - generic [ref=e65]:
          - paragraph [ref=e66]: Design language for a healthtech scale-up.
          - paragraph [ref=e67]: 3× faster feature delivery
      - link "Software Vertex ERP Custom ERP for a manufacturing group. $1.2M/yr operational savings" [ref=e68] [cursor=pointer]:
        - /url: /portfolio/vertex-erp
        - generic [ref=e72]:
          - generic [ref=e73]: Software
          - heading "Vertex ERP" [level=3] [ref=e74]
        - generic [ref=e75]:
          - paragraph [ref=e76]: Custom ERP for a manufacturing group.
          - paragraph [ref=e77]: $1.2M/yr operational savings
      - link "AI / ML Lumen Vision Computer vision for retail loss prevention. -42% shrinkage in pilot chain" [ref=e78] [cursor=pointer]:
        - /url: /portfolio/lumen-vision
        - generic [ref=e82]:
          - generic [ref=e83]: AI / ML
          - heading "Lumen Vision" [level=3] [ref=e84]
        - generic [ref=e85]:
          - paragraph [ref=e86]: Computer vision for retail loss prevention.
          - paragraph [ref=e87]: "-42% shrinkage in pilot chain"
      - link "Web Dev Cascade Web Editorial platform for a Middle-East publisher. LCP 0.9s · +55% pageviews" [ref=e88] [cursor=pointer]:
        - /url: /portfolio/cascade-web
        - generic [ref=e92]:
          - generic [ref=e93]: Web Dev
          - heading "Cascade Web" [level=3] [ref=e94]
        - generic [ref=e95]:
          - paragraph [ref=e96]: Editorial platform for a Middle-East publisher.
          - paragraph [ref=e97]: LCP 0.9s · +55% pageviews
      - link "Automation Signal Automation AI-driven back-office automation. 12,000 hours saved / quarter" [ref=e98] [cursor=pointer]:
        - /url: /portfolio/signal-automation
        - generic [ref=e102]:
          - generic [ref=e103]: Automation
          - heading "Signal Automation" [level=3] [ref=e104]
        - generic [ref=e105]:
          - paragraph [ref=e106]: AI-driven back-office automation.
          - paragraph [ref=e107]: 12,000 hours saved / quarter
      - link "Digital Mirage Brand Studio Full brand + digital campaign relaunch. +180% qualified traffic" [ref=e108] [cursor=pointer]:
        - /url: /portfolio/mirage-brand
        - generic [ref=e112]:
          - generic [ref=e113]: Digital
          - heading "Mirage Brand Studio" [level=3] [ref=e114]
        - generic [ref=e115]:
          - paragraph [ref=e116]: Full brand + digital campaign relaunch.
          - paragraph [ref=e117]: +180% qualified traffic
      - link "AI / ML Quasar Chat Enterprise assistant grounded in company data. 94% question resolution rate" [ref=e118] [cursor=pointer]:
        - /url: /portfolio/quasar-chat
        - generic [ref=e122]:
          - generic [ref=e123]: AI / ML
          - heading "Quasar Chat" [level=3] [ref=e124]
        - generic [ref=e125]:
          - paragraph [ref=e126]: Enterprise assistant grounded in company data.
          - paragraph [ref=e127]: 94% question resolution rate
      - link "SaaS Meridian Fintech Cross-border payments platform. $120M processed in year one" [ref=e128] [cursor=pointer]:
        - /url: /portfolio/meridian-fintech
        - generic [ref=e132]:
          - generic [ref=e133]: SaaS
          - heading "Meridian Fintech" [level=3] [ref=e134]
        - generic [ref=e135]:
          - paragraph [ref=e136]: Cross-border payments platform.
          - paragraph [ref=e137]: $120M processed in year one
      - link "Web Dev Nebula Education Adaptive learning for K-12 in the UAE. Adopted by 60+ schools" [ref=e138] [cursor=pointer]:
        - /url: /portfolio/nebula-education
        - generic [ref=e142]:
          - generic [ref=e143]: Web Dev
          - heading "Nebula Education" [level=3] [ref=e144]
        - generic [ref=e145]:
          - paragraph [ref=e146]: Adaptive learning for K-12 in the UAE.
          - paragraph [ref=e147]: Adopted by 60+ schools
      - link "Cloud Forge DevOps CI/CD platform for a scale-up. Deploys reduced 45min → 4min" [ref=e148] [cursor=pointer]:
        - /url: /portfolio/forge-devops
        - generic [ref=e152]:
          - generic [ref=e153]: Cloud
          - heading "Forge DevOps" [level=3] [ref=e154]
        - generic [ref=e155]:
          - paragraph [ref=e156]: CI/CD platform for a scale-up.
          - paragraph [ref=e157]: Deploys reduced 45min → 4min
      - link "AI / ML Aria Voice Multilingual voice assistant for hospitality. Deployed in 20 hotels globally" [ref=e158] [cursor=pointer]:
        - /url: /portfolio/aria-voice
        - generic [ref=e162]:
          - generic [ref=e163]: AI / ML
          - heading "Aria Voice" [level=3] [ref=e164]
        - generic [ref=e165]:
          - paragraph [ref=e166]: Multilingual voice assistant for hospitality.
          - paragraph [ref=e167]: Deployed in 20 hotels globally
      - link "Mobile Kite Mobile iOS + Android for a logistics startup. 35% faster last-mile delivery" [ref=e168] [cursor=pointer]:
        - /url: /portfolio/kite-mobile
        - generic [ref=e172]:
          - generic [ref=e173]: Mobile
          - heading "Kite Mobile" [level=3] [ref=e174]
        - generic [ref=e175]:
          - paragraph [ref=e176]: iOS + Android for a logistics startup.
          - paragraph [ref=e177]: 35% faster last-mile delivery
      - link "UI/UX Lattice UX Overhaul Repositioning a legacy SaaS for scale. +72% activation rate" [ref=e178] [cursor=pointer]:
        - /url: /portfolio/lattice-ux
        - generic [ref=e182]:
          - generic [ref=e183]: UI/UX
          - heading "Lattice UX Overhaul" [level=3] [ref=e184]
        - generic [ref=e185]:
          - paragraph [ref=e186]: Repositioning a legacy SaaS for scale.
          - paragraph [ref=e187]: +72% activation rate
      - link "SaaS Pulse Marketplace Two-sided creator marketplace. 15k active creators in year one" [ref=e188] [cursor=pointer]:
        - /url: /portfolio/pulse-marketplace
        - generic [ref=e192]:
          - generic [ref=e193]: SaaS
          - heading "Pulse Marketplace" [level=3] [ref=e194]
        - generic [ref=e195]:
          - paragraph [ref=e196]: Two-sided creator marketplace.
          - paragraph [ref=e197]: 15k active creators in year one
      - link "Software Beacon IoT Industrial IoT monitoring platform. Predicted 3 major outages" [ref=e198] [cursor=pointer]:
        - /url: /portfolio/beacon-iot
        - generic [ref=e202]:
          - generic [ref=e203]: Software
          - heading "Beacon IoT" [level=3] [ref=e204]
        - generic [ref=e205]:
          - paragraph [ref=e206]: Industrial IoT monitoring platform.
          - paragraph [ref=e207]: Predicted 3 major outages
      - link "Web Dev Halo Brand Web Interactive marketing site with WebGL. Awwwards Site of the Day" [ref=e208] [cursor=pointer]:
        - /url: /portfolio/halo-brand-web
        - generic [ref=e212]:
          - generic [ref=e213]: Web Dev
          - heading "Halo Brand Web" [level=3] [ref=e214]
        - generic [ref=e215]:
          - paragraph [ref=e216]: Interactive marketing site with WebGL.
          - paragraph [ref=e217]: Awwwards Site of the Day
  - contentinfo [ref=e218]:
    - generic [ref=e219]:
      - generic [ref=e220]:
        - generic [ref=e221]:
          - link "Ajetix Ajetix" [ref=e222] [cursor=pointer]:
            - /url: /
            - img "Ajetix" [ref=e223]
            - generic [ref=e224]: Ajetix
          - paragraph [ref=e225]: International AI, software, and product studio. We build ambitious digital experiences for teams in the US, UK, EU, Canada, Australia and the Middle East.
          - link "info@ajetix.com" [ref=e226] [cursor=pointer]:
            - /url: mailto:info@ajetix.com
            - img [ref=e227]
            - text: info@ajetix.com
          - generic [ref=e230]:
            - link "Instagram" [ref=e231] [cursor=pointer]:
              - /url: https://www.instagram.com/ajetix_as/
              - img [ref=e232]
            - link "Facebook" [ref=e235] [cursor=pointer]:
              - /url: https://www.facebook.com/share/1DAJEzWjpH/
              - img [ref=e236]
            - link "YouTube" [ref=e238] [cursor=pointer]:
              - /url: https://youtube.com/@ajetix
              - img [ref=e239]
            - link "X (Twitter)" [ref=e242] [cursor=pointer]:
              - /url: https://x.com/Ajetix_1126
              - img [ref=e243]
        - generic [ref=e245]:
          - heading "Company" [level=3] [ref=e246]
          - list [ref=e247]:
            - listitem [ref=e248]:
              - link "Home" [ref=e249] [cursor=pointer]:
                - /url: /
            - listitem [ref=e250]:
              - link "About" [ref=e251] [cursor=pointer]:
                - /url: /about
            - listitem [ref=e252]:
              - link "Services" [ref=e253] [cursor=pointer]:
                - /url: /services
            - listitem [ref=e254]:
              - link "Process" [ref=e255] [cursor=pointer]:
                - /url: /process
            - listitem [ref=e256]:
              - link "Portfolio" [ref=e257] [cursor=pointer]:
                - /url: /portfolio
            - listitem [ref=e258]:
              - link "Contact" [ref=e259] [cursor=pointer]:
                - /url: /contact
        - generic [ref=e260]:
          - heading "Newsletter" [level=3] [ref=e261]
          - paragraph [ref=e262]: Occasional updates on AI, engineering and product craft.
          - generic [ref=e263]:
            - textbox "you@company.com" [ref=e264]
            - button "Join" [ref=e265]
      - generic [ref=e266]:
        - paragraph [ref=e267]: © 2026 Ajetix. All rights reserved.
        - generic [ref=e268]:
          - link "Privacy Policy" [ref=e269] [cursor=pointer]:
            - /url: /
          - link "Terms of Service" [ref=e270] [cursor=pointer]:
            - /url: /
```

# Test source

```ts
  11  |   "vertex-erp",
  12  |   "lumen-vision",
  13  |   "cascade-web",
  14  |   "signal-automation",
  15  |   "mirage-brand",
  16  |   "quasar-chat",
  17  |   "meridian-fintech",
  18  |   "nebula-education",
  19  |   "forge-devops",
  20  |   "aria-voice",
  21  |   "kite-mobile",
  22  |   "lattice-ux",
  23  |   "pulse-marketplace",
  24  |   "beacon-iot",
  25  |   "halo-brand-web",
  26  | ];
  27  | 
  28  | const STATIC_ROUTES = [
  29  |   "/",
  30  |   "/about",
  31  |   "/services",
  32  |   "/process",
  33  |   "/portfolio",
  34  |   "/contact",
  35  |   "/admin/login",
  36  |   "/admin",
  37  |   "/admin/projects",
  38  |   "/admin/submissions",
  39  | ];
  40  | 
  41  | function screenshotDir(projectName: string) {
  42  |   const dir = join("e2e", "screenshots", projectName);
  43  |   mkdirSync(dir, { recursive: true });
  44  |   return dir;
  45  | }
  46  | 
  47  | test.describe("Route screenshots", () => {
  48  |   for (const route of STATIC_ROUTES) {
  49  |     test(`screenshot ${route}`, async ({ page }, testInfo) => {
  50  |       const errors: string[] = [];
  51  |       page.on("pageerror", (err) => errors.push(err.message));
  52  |       page.on("console", (msg) => {
  53  |         if (msg.type() === "error") errors.push(msg.text());
  54  |       });
  55  | 
  56  |       const res = await page.goto(route, { waitUntil: "networkidle" });
  57  |       expect(res?.status(), `${route} should not 404`).toBeLessThan(400);
  58  | 
  59  |       await page.waitForTimeout(500);
  60  |       const dir = screenshotDir(testInfo.project.name);
  61  |       const safeName = route.replace(/\//g, "_").replace(/^_/, "") || "home";
  62  |       await page.screenshot({ path: join(dir, `${safeName}.png`), fullPage: true });
  63  | 
  64  |       expect(await page.locator("body").innerText()).not.toBe("");
  65  |       if (errors.length) {
  66  |         console.warn(`Console errors on ${route}:`, errors);
  67  |       }
  68  |     });
  69  |   }
  70  | 
  71  |   for (const slug of PORTFOLIO_SLUGS) {
  72  |     test(`screenshot /portfolio/${slug}`, async ({ page }, testInfo) => {
  73  |       const route = `/portfolio/${slug}`;
  74  |       const res = await page.goto(route, { waitUntil: "networkidle" });
  75  |       expect(res?.status(), `${route} should load`).toBeLessThan(400);
  76  |       await page.waitForTimeout(500);
  77  |       const dir = screenshotDir(testInfo.project.name);
  78  |       await page.screenshot({ path: join(dir, `portfolio_${slug}.png`), fullPage: true });
  79  |       await expect(page.locator("h1")).toBeVisible();
  80  |     });
  81  |   }
  82  | 
  83  |   test("screenshot 404 page", async ({ page }, testInfo) => {
  84  |     await page.goto("/this-route-does-not-exist-404-test", { waitUntil: "networkidle" });
  85  |     const dir = screenshotDir(testInfo.project.name);
  86  |     await page.screenshot({ path: join(dir, "404.png"), fullPage: true });
  87  |     await expect(page.getByRole("link", { name: /go home/i })).toBeVisible();
  88  |   });
  89  | });
  90  | 
  91  | test.describe("Navigation flows (390px only)", () => {
  92  |   test.beforeEach(({ }, testInfo) => {
  93  |     test.skip(testInfo.project.name !== "390px", "Navigation flows run at 390px only");
  94  |   });
  95  | 
  96  |   test("Portfolio → detail → browser Back preserves scroll", async ({ page }) => {
  97  |     await page.goto("/portfolio");
  98  |     await page.waitForTimeout(500);
  99  |     await page.evaluate(() => window.scrollTo(0, 400));
  100 |     const scrollBefore = await page.evaluate(() => window.scrollY);
  101 |     expect(scrollBefore).toBeGreaterThan(0);
  102 | 
  103 |     await page.getByRole("link", { name: /Nova AI Analytics/i }).first().click();
  104 |     await expect(page).toHaveURL(/\/portfolio\/nova-ai-analytics/);
  105 |     await expect(page.locator("h1")).toContainText("Nova AI Analytics");
  106 | 
  107 |     await page.goBack();
  108 |     await expect(page).toHaveURL(/\/portfolio$/);
  109 |     await page.waitForTimeout(500);
  110 |     const scrollAfter = await page.evaluate(() => window.scrollY);
> 111 |     expect(scrollAfter).toBeGreaterThan(0);
      |                         ^ Error: expect(received).toBeGreaterThan(expected)
  112 |   });
  113 | 
  114 |   test("Direct deep URL loads", async ({ page }) => {
  115 |     await page.goto("/portfolio/quasar-chat");
  116 |     await expect(page.locator("h1")).toContainText("Quasar Chat");
  117 |   });
  118 | 
  119 |   test("Refresh on deep route works", async ({ page }) => {
  120 |     await page.goto("/portfolio/helix-saas");
  121 |     await expect(page.locator("h1")).toContainText("Helix SaaS");
  122 |     await page.reload({ waitUntil: "networkidle" });
  123 |     await expect(page.locator("h1")).toContainText("Helix SaaS");
  124 |   });
  125 | 
  126 |   test("Admin login page loads", async ({ page }) => {
  127 |     await page.goto("/admin/login");
  128 |     await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  129 |   });
  130 | 
  131 |   test("/admin without auth shows API-not-configured or redirects", async ({ page }) => {
  132 |     await page.goto("/admin");
  133 |     const text = await page.locator("body").innerText();
  134 |     expect(text.length).toBeGreaterThan(10);
  135 |   });
  136 | });
  137 | 
```