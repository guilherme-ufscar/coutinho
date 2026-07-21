// Tokens espelhados de tokens.css para uso em JS/TS (ex.: gráficos, valores dinâmicos).
// Fonte da verdade visual continua sendo tokens.css — não duplicar regras de layout aqui.
export const colors = {
  ink900: "#0E0F11",
  ink800: "#17181B",
  ink700: "#222222",
  ink600: "#2C2E32",
  gray500: "#4A4F54",
  gray300: "#9A9DA2",
  gray100: "#EDEDED",
  white: "#FFFFFF",
  accent: "#F7BE00",
  accent2: "#F5B335",
  success: "#3FB98C",
  danger: "#E5484D",
  info: "#5B9DEF",
} as const;

export const accentGradient = "linear-gradient(90deg,#F7BE00,#F5B335)";

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  full: 999,
} as const;

export const spacing = [4, 8, 12, 16, 24, 32, 48, 64] as const;

export const layout = {
  sidebarWidth: 260,
  headerHeight: 76,
} as const;
