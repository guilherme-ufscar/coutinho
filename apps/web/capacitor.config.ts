import type { CapacitorConfig } from "@capacitor/cli";

// Empacota só a área do cliente (/app/*) — landing e admin não entram no APK (escopo.md §4.5).
// webDir aponta pro build do Vite, que já foi compilado com VITE_API_URL de produção
// (https://couthealth.com.br/api) — o app roda offline-first, chamando a API real.
const config: CapacitorConfig = {
  appId: "br.com.couthealth.app",
  appName: "CoutHealth",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
