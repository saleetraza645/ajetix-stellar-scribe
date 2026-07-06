/**
 * One-time script: generates 20 branded portfolio cover WebP images.
 * Run: node scripts/generate-portfolio-covers.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../src/assets/portfolio");

const projects = [
  { slug: "nova-ai-analytics", theme: "ai" },
  { slug: "helix-saas", theme: "saas" },
  { slug: "orbit-mobile", theme: "mobile" },
  { slug: "atlas-cloud", theme: "cloud" },
  { slug: "prism-design", theme: "design" },
  { slug: "vertex-erp", theme: "software" },
  { slug: "lumen-vision", theme: "ai" },
  { slug: "cascade-web", theme: "web" },
  { slug: "signal-automation", theme: "automation" },
  { slug: "mirage-brand", theme: "digital" },
  { slug: "quasar-chat", theme: "ai" },
  { slug: "meridian-fintech", theme: "saas" },
  { slug: "nebula-education", theme: "web" },
  { slug: "forge-devops", theme: "cloud" },
  { slug: "aria-voice", theme: "ai" },
  { slug: "kite-mobile", theme: "mobile" },
  { slug: "lattice-ux", theme: "design" },
  { slug: "pulse-marketplace", theme: "saas" },
  { slug: "beacon-iot", theme: "software" },
  { slug: "halo-brand-web", theme: "web" },
];

const PALETTE = {
  blue: "#3B82F6",
  violet: "#8B5CF6",
  cyan: "#22D3EE",
  navy: "#0B1220",
  navyLight: "#141E33",
};

function themeOverlay(theme, seed) {
  const s = seed % 7;
  switch (theme) {
    case "ai":
      return `
        <g opacity="0.85">
          ${Array.from({ length: 8 }, (_, i) => {
            const x = 80 + (i % 4) * 180 + (s * 12);
            const y = 100 + Math.floor(i / 4) * 200;
            return `<circle cx="${x}" cy="${y}" r="28" fill="${PALETTE.cyan}" opacity="0.35"/>
              ${i < 7 ? `<line x1="${x}" y1="${y}" x2="${80 + ((i + 1) % 4) * 180 + (s * 12)}" y2="${100 + Math.floor((i + 1) / 4) * 200}" stroke="${PALETTE.blue}" stroke-width="2" opacity="0.5"/>` : ""}`;
          }).join("")}
          <circle cx="640" cy="180" r="60" fill="url(#glow)" opacity="0.6"/>
        </g>`;
    case "saas":
      return `
        <g opacity="0.9">
          <rect x="100" y="120" width="520" height="320" rx="16" fill="${PALETTE.navyLight}" stroke="${PALETTE.blue}" stroke-width="2" opacity="0.8"/>
          <rect x="130" y="160" width="180" height="100" rx="8" fill="${PALETTE.blue}" opacity="0.35"/>
          <rect x="340" y="160" width="240" height="100" rx="8" fill="${PALETTE.violet}" opacity="0.3"/>
          <rect x="130" y="290" width="450" height="12" rx="4" fill="${PALETTE.cyan}" opacity="0.4"/>
          <rect x="130" y="320" width="380" height="12" rx="4" fill="${PALETTE.cyan}" opacity="0.25"/>
          <rect x="130" y="350" width="420" height="12" rx="4" fill="${PALETTE.cyan}" opacity="0.2"/>
        </g>`;
    case "mobile":
      return `
        <g opacity="0.9">
          <rect x="280" y="60" width="200" height="400" rx="28" fill="${PALETTE.navyLight}" stroke="${PALETTE.violet}" stroke-width="3"/>
          <rect x="300" y="100" width="160" height="280" rx="8" fill="url(#screenGrad)"/>
          <circle cx="380" cy="410" r="14" fill="${PALETTE.cyan}" opacity="0.5"/>
          <rect x="340" y="78" width="80" height="8" rx="4" fill="${PALETTE.blue}" opacity="0.4"/>
        </g>`;
    case "web":
      return `
        <g opacity="0.9">
          <rect x="80" y="100" width="560" height="340" rx="12" fill="${PALETTE.navyLight}" stroke="${PALETTE.blue}" stroke-width="2"/>
          <rect x="80" y="100" width="560" height="40" rx="12" fill="${PALETTE.blue}" opacity="0.25"/>
          <circle cx="110" cy="120" r="6" fill="${PALETTE.cyan}" opacity="0.7"/>
          <circle cx="130" cy="120" r="6" fill="${PALETTE.violet}" opacity="0.7"/>
          <circle cx="150" cy="120" r="6" fill="${PALETTE.blue}" opacity="0.7"/>
          <text x="120" y="220" font-family="monospace" font-size="14" fill="${PALETTE.cyan}" opacity="0.5">&lt;/&gt; build()</text>
          <rect x="120" y="250" width="300" height="8" rx="2" fill="${PALETTE.violet}" opacity="0.35"/>
          <rect x="120" y="275" width="420" height="8" rx="2" fill="${PALETTE.cyan}" opacity="0.25"/>
        </g>`;
    case "cloud":
      return `
        <g opacity="0.85">
          <ellipse cx="200" cy="260" rx="100" ry="60" fill="${PALETTE.blue}" opacity="0.3"/>
          <ellipse cx="280" cy="240" rx="120" ry="70" fill="${PALETTE.violet}" opacity="0.35"/>
          <ellipse cx="380" cy="260" rx="110" ry="65" fill="${PALETTE.cyan}" opacity="0.3"/>
          <ellipse cx="480" cy="250" rx="90" ry="55" fill="${PALETTE.blue}" opacity="0.25"/>
          <circle cx="380" cy="180" r="8" fill="${PALETTE.cyan}" opacity="0.6"/>
          <circle cx="420" cy="200" r="6" fill="${PALETTE.cyan}" opacity="0.4"/>
          <circle cx="340" cy="200" r="6" fill="${PALETTE.cyan}" opacity="0.4"/>
        </g>`;
    case "design":
      return `
        <g opacity="0.85">
          ${[0, 1, 2, 3].map((i) => `<rect x="${100 + i * 130}" y="140" width="100" height="100" rx="12" fill="${[PALETTE.blue, PALETTE.violet, PALETTE.cyan, PALETTE.blue][i]}" opacity="0.35"/>`).join("")}
          <circle cx="380" cy="320" r="80" fill="none" stroke="${PALETTE.violet}" stroke-width="3" opacity="0.5"/>
          <rect x="480" y="180" width="80" height="80" rx="40" fill="${PALETTE.cyan}" opacity="0.25"/>
        </g>`;
    case "software":
      return `
        <g opacity="0.85">
          <rect x="140" y="140" width="80" height="80" rx="8" fill="${PALETTE.blue}" opacity="0.35"/>
          <rect x="260" y="140" width="80" height="80" rx="8" fill="${PALETTE.violet}" opacity="0.3"/>
          <rect x="380" y="140" width="80" height="80" rx="8" fill="${PALETTE.cyan}" opacity="0.3"/>
          <rect x="200" y="260" width="80" height="80" rx="8" fill="${PALETTE.cyan}" opacity="0.25"/>
          <rect x="320" y="260" width="80" height="80" rx="8" fill="${PALETTE.blue}" opacity="0.25"/>
          <line x1="220" y1="180" x2="300" y2="180" stroke="${PALETTE.cyan}" stroke-width="2" opacity="0.4"/>
          <line x1="340" y1="180" x2="420" y2="180" stroke="${PALETTE.cyan}" stroke-width="2" opacity="0.4"/>
        </g>`;
    case "automation":
      return `
        <g opacity="0.85">
          <circle cx="180" cy="250" r="40" fill="${PALETTE.blue}" opacity="0.35"/>
          <circle cx="380" cy="180" r="40" fill="${PALETTE.violet}" opacity="0.35"/>
          <circle cx="580" cy="250" r="40" fill="${PALETTE.cyan}" opacity="0.35"/>
          <path d="M220 250 L340 180" stroke="${PALETTE.cyan}" stroke-width="3" opacity="0.5" marker-end="url(#arrow)"/>
          <path d="M420 180 L540 250" stroke="${PALETTE.cyan}" stroke-width="3" opacity="0.5"/>
        </g>`;
    case "digital":
      return `
        <g opacity="0.85">
          <path d="M200 350 Q380 120 560 350" fill="none" stroke="${PALETTE.violet}" stroke-width="4" opacity="0.5"/>
          <circle cx="380" cy="200" r="50" fill="${PALETTE.blue}" opacity="0.3"/>
          <circle cx="280" cy="280" r="30" fill="${PALETTE.cyan}" opacity="0.35"/>
          <circle cx="480" cy="280" r="30" fill="${PALETTE.cyan}" opacity="0.35"/>
        </g>`;
    default:
      return "";
  }
}

function buildSvg(theme, seed) {
  const angle = (seed * 37) % 360;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${PALETTE.navy}"/>
        <stop offset="50%" stop-color="${PALETTE.navyLight}"/>
        <stop offset="100%" stop-color="${PALETTE.navy}"/>
      </linearGradient>
      <linearGradient id="accent" gradientTransform="rotate(${angle})">
        <stop offset="0%" stop-color="${PALETTE.blue}" stop-opacity="0.6"/>
        <stop offset="50%" stop-color="${PALETTE.violet}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="${PALETTE.cyan}" stop-opacity="0.4"/>
      </linearGradient>
      <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${PALETTE.blue}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="${PALETTE.violet}" stop-opacity="0.2"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${PALETTE.cyan}" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="${PALETTE.cyan}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="600" fill="url(#bg)"/>
    <rect width="800" height="600" fill="url(#accent)"/>
    <circle cx="650" cy="80" r="120" fill="${PALETTE.violet}" opacity="0.15"/>
    <circle cx="100" cy="500" r="150" fill="${PALETTE.blue}" opacity="0.12"/>
    ${themeOverlay(theme, seed)}
  </svg>`;
}

await mkdir(OUT_DIR, { recursive: true });

for (let i = 0; i < projects.length; i++) {
  const { slug, theme } = projects[i];
  const svg = buildSvg(theme, i);
  const outPath = join(OUT_DIR, `${slug}.webp`);

  let quality = 82;
  let buffer = await sharp(Buffer.from(svg)).webp({ quality }).toBuffer();

  while (buffer.length > 200 * 1024 && quality > 40) {
    quality -= 8;
    buffer = await sharp(Buffer.from(svg)).webp({ quality }).toBuffer();
  }

  await writeFile(outPath, buffer);
  console.log(`${slug}.webp — ${(buffer.length / 1024).toFixed(1)} KB (q=${quality})`);
}

console.log(`\nDone — ${projects.length} covers in ${OUT_DIR}`);
