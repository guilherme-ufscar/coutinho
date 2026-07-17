/** Após login/cadastro: se veio de um CTA de plano, vai direto pro checkout; senão, pro dashboard. */
export function postAuthPath(search: string): string {
  const params = new URLSearchParams(search);
  const plano = params.get("plano");
  const periodo = params.get("periodo");
  if (plano) {
    return `/planos?plano=${plano}${periodo ? `&periodo=${periodo}` : ""}`;
  }
  return "/app";
}
