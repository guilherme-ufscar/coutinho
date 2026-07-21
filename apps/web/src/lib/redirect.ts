/**
 * Após login/cadastro: profissionais vão direto pro painel admin (nunca têm
 * plano pra escolher); clientes seguem pro CTA de plano (se veio de um) ou
 * pro dashboard.
 */
export function postAuthPath(search: string, role?: "CLIENT" | "PROFESSIONAL"): string {
  if (role === "PROFESSIONAL") {
    return "/admin";
  }
  const params = new URLSearchParams(search);
  const plano = params.get("plano");
  const periodo = params.get("periodo");
  if (plano) {
    return `/planos?plano=${plano}${periodo ? `&periodo=${periodo}` : ""}`;
  }
  return "/app";
}
