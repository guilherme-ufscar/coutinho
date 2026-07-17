// Gera ícone e splash placeholder do app (anel de continuidade, cores da marca) a partir de SVG.
// Rodar antes de `npx @capacitor/assets generate` — ver package.json script "icons:generate".
import sharp from "sharp";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "resources");
mkdirSync(outDir, { recursive: true });

const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F7BE00"/>
      <stop offset="100%" stop-color="#F5B335"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="#0E0F11"/>
  <circle cx="512" cy="512" r="300" fill="none" stroke="#2C2E32" stroke-width="56"/>
  <circle cx="512" cy="512" r="300" fill="none" stroke="url(#g)" stroke-width="56"
          stroke-linecap="round" stroke-dasharray="1885" stroke-dashoffset="470"
          transform="rotate(-90 512 512)"/>
</svg>`;

const splashSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732" viewBox="0 0 2732 2732">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F7BE00"/>
      <stop offset="100%" stop-color="#F5B335"/>
    </linearGradient>
  </defs>
  <rect width="2732" height="2732" fill="#0E0F11"/>
  <circle cx="1366" cy="1366" r="360" fill="none" stroke="#2C2E32" stroke-width="64"/>
  <circle cx="1366" cy="1366" r="360" fill="none" stroke="url(#g)" stroke-width="64"
          stroke-linecap="round" stroke-dasharray="2262" stroke-dashoffset="565"
          transform="rotate(-90 1366 1366)"/>
</svg>`;

await sharp(Buffer.from(iconSvg)).png().toFile(join(outDir, "icon.png"));
await sharp(Buffer.from(splashSvg)).png().toFile(join(outDir, "splash.png"));
await sharp(Buffer.from(splashSvg)).png().toFile(join(outDir, "splash-dark.png"));

console.log("[icons] gerado resources/icon.png, resources/splash.png, resources/splash-dark.png");
