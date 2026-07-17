# CoutHealth — Design System & Geração de UI via Google Stitch (MCP)

> Documento de sistema de design + guia operacional para gerar **todas as telas** (desktop e mobile) no **Google Stitch** através do **MCP**, mantendo consistência com a marca **Rafael Coutinho / CoutHealth**.
> Companion do `escopo.md`.

---

## 1. Objetivo

Definir a **Design DNA** da CoutHealth (tokens, tipografia, componentes) e o **fluxo de trabalho no Stitch MCP** para que cada tela seja gerada de forma consistente, premium e alinhada ao briefing (referência: Apple / Oura / Whoop — **nunca "app de academia"**).

---

## 2. Direção de design (thesis)

**Tese:** *health-tech premium, dark-first, disciplinado, com um único sinal quente de cor.* O amarelo da marca (#F7BE00) é usado com **restrição**, como o "sinal" de progresso e continuidade — não como preenchimento.

**Elemento-assinatura:** o **anel de continuidade** (o símbolo "C" da marca vira um *progress ring*). Ele reaparece em: progresso da anamnese, ciclo de revisão do plano, e evolução do cliente. Isso amarra o símbolo da marca ao conceito central do produto — o **ciclo contínuo de acompanhamento**.

**Referências aprovadas pelo cliente e como aplicá-las:**
- **Landing (ref. dark cinematográfica):** hero forte, cards em glassmorphism sutil, badge, depoimentos, planos, FAQ — mas **preto + amarelo** (não azul).
- **App (ref. mobile limpo):** cards claros de treino/nutrição, mobile-first, calendário de evolução.
- **GetSkills (dashboard SaaS):** estrutura de painel (sidebar, cards, gráficos) — porém em tema **dark premium**, não o visual claro/colorido do template.

---

## 3. Design tokens

### 3.1 Cores (derivadas do Manual da Marca)
Base da marca: `#222222` (Preto Neutro), `#F7BE00` (amarelo primário), `#F5B335` (amarelo secundário/quente), `#4A4F54` (cinza), `#EDEDED` (cinza claro). Escala expandida para produto dark premium:

| Token | Hex | Uso |
|---|---|---|
| `--ink-900` | `#0E0F11` | Fundo base do app |
| `--ink-800` | `#17181B` | Superfície elevada |
| `--ink-700` | `#222222` | Cards (Preto Neutro da marca) |
| `--ink-600` | `#2C2E32` | Bordas/hairlines, hover |
| `--gray-500` | `#4A4F54` | Texto secundário (marca) |
| `--gray-300` | `#9A9DA2` | Texto terciário / placeholders |
| `--gray-100` | `#EDEDED` | Superfície clara / texto sobre dark (marca) |
| `--white` | `#FFFFFF` | Texto principal sobre dark |
| `--accent` | `#F7BE00` | Cor de destaque primária (marca) |
| `--accent-2` | `#F5B335` | Gradiente/hover do destaque (marca) |
| `--accent-grad` | `linear-gradient(90deg,#F7BE00,#F5B335)` | Anel de continuidade, CTAs de marca |
| `--success` | `#3FB98C` | Metas atingidas / status ok |
| `--danger` | `#E5484D` | Erros / alertas |
| `--info` | `#5B9DEF` | Informativo |

**Regras:** amarelo só em ações primárias, dados de progresso e o anel-assinatura. Texto sobre amarelo = `--ink-900` (nunca branco). Contraste sempre ≥ AA.

> Tema claro (para tabelas densas de nutrição/biblioteca) é **opcional/fase posterior** — MVP é dark-first.

### 3.2 Tipografia
- **Display:** **Luxora Grotesk** (fonte da marca) — títulos, hero, números grandes. *Fallback web:* `Space Grotesk` (confirmar licença web da Luxora; ver `escopo.md` §13).
- **Corpo / UI / dados:** **Inter** — legível em telas densas e no APK.
- **Stack CSS:** `--font-display: "Luxora Grotesk","Space Grotesk",sans-serif;` · `--font-body: "Inter",system-ui,sans-serif;`

**Escala de tipo (rem):** Display 3.0 / 2.25 / 1.75 · Título 1.375 / 1.125 · Corpo 1.0 / 0.9375 · Legenda/dados 0.8125. Pesos: display 600–700; corpo 400–500; labels 500–600.

### 3.3 Espaçamento, raio, sombra, motion
- **Spacing (px):** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64.
- **Radius:** `--r-sm` 8 · `--r-md` 14 · `--r-lg` 20 · `--r-full` 999 (pílulas e anel).
- **Sombra:** dark premium usa **elevação por cor/borda**, não sombras pesadas. `--elev: 0 1px 0 rgba(255,255,255,.04) inset, 0 8px 24px rgba(0,0,0,.35)`.
- **Motion:** transições 160–240ms `ease-out`; reveal on scroll na landing; micro-hover nos cards. **Respeitar `prefers-reduced-motion`.**

### 3.4 Ícones & ilustração
Ícones de traço fino, cantos suaves (ex.: Lucide). Sem clip-art de academia. Uso pontual do **pattern** da marca (as formas em "C") como textura sutil em fundos de seção — baixa opacidade.

---

## 4. Componentes base (biblioteca)

- **Botões:** primário (fundo `--accent`, texto `--ink-900`), secundário (contorno `--ink-600`), ghost. Estados hover/focus/disabled; foco visível.
- **Cards:** `--ink-700`, borda `--ink-600`, radius `--r-lg`.
- **Inputs / selects / toggles:** dark, label acima, mensagens de erro em `--danger` (voz da interface, sem pedir desculpas — ver `escopo.md`/skill de escrita).
- **Navegação:** sidebar (desktop) e **bottom nav** (mobile/APK). Ícones + label.
- **Anel de continuidade (assinatura):** progress ring com `--accent-grad`.
- **Gráficos (Evolução):** linhas/áreas minimalistas, uma cor de destaque, grade discreta.
- **Tabelas de macros:** densas mas arejadas; números em Inter tabular.
- **Badges/tags de plano:** Essencial / Plus / Elite.
- **Accordion (FAQ), toasts, empty states, modais.**
- **Player de vídeo** (embed YouTube não listado) para exercícios.

**Copy:** voz ativa, sentence case, verbo = ação exata ("Criar conta", "Publicar plano", "Salvar medidas"). Empty state é convite para agir; erro diz o que houve e como resolver.

---

## 5. Setup do Google Stitch MCP

O Stitch é do Google Labs (gera UI + HTML/CSS via Gemini). O **Stitch MCP** é um servidor remoto que expõe ferramentas como `create_project`, `generate_screen_from_text`, `get_screen`, `list_projects`. Seu fluxo é via **Claude Code**.

### 5.1 Autenticação — chave de API (modo direto)
O servidor remoto fica em `https://stitch.googleapis.com/mcp` e autentica pelo header **`X-Goog-Api-Key`**.

> ⚠️ **Segurança:** a chave **nunca** vai para o Git. Guarde em `.env` local / config do MCP. **Rotacione a chave que você me passou** (Stitch → Profile → Stitch settings → API key) depois deste setup — ela foi compartilhada só para facilitar.

**1) Coloque a chave numa variável de ambiente (não versionada):**
```bash
# ~/.zshrc, ~/.bashrc ou .env local — NÃO commitar
export STITCH_API_KEY="<sua-stitch-api-key>"   # NUNCA commitar o valor real
```

**2) Registre o MCP no Claude Code (transporte HTTP):**
```bash
claude mcp add stitch --transport http https://stitch.googleapis.com/mcp \
  --header "X-Goog-Api-Key: ${STITCH_API_KEY}" -s user
```

Ou, equivalente, no config JSON do cliente MCP:
```json
{
  "mcpServers": {
    "stitch": {
      "type": "http",
      "url": "https://stitch.googleapis.com/mcp",
      "headers": { "X-Goog-Api-Key": "${STITCH_API_KEY}" }
    }
  }
}
```

### 5.2 Alternativa via proxy (OAuth)
Se preferir OAuth em vez de chave, use o wizard do pacote `@_davideast/stitch-mcp` (`npx @_davideast/stitch-mcp init`), que instala um gcloud isolado e configura o cliente. Observação prática: **o modo proxy costuma exigir OAuth** (`gcloud auth application-default login`) — a chave de API pura pode não funcionar no proxy; para chave use o **transporte HTTP direto** da §5.1. Além disso, um `.env` na pasta do projeto pode quebrar o proxy — se der erro, mova/renomeie o `.env`.

### 5.3 Verificação
No Claude Code, liste as ferramentas / rode `list_projects` (ou `list_tools`) e confirme que aparecem `create_project`, `generate_screen_from_text`, `get_screen`. Se aparecerem, está pronto.

### 5.4 Do design ao código
Ferramentas úteis do proxy: `build_site` (mapeia telas → rotas e devolve o HTML), `get_screen_code` (baixa o HTML da tela) e `get_screen_image` (screenshot em base64). Fluxo: **gerar no Stitch → revisar imagem → puxar o código → reimplementar** nos componentes React/Next com nossos tokens (não colar HTML cru; usar como referência de layout).

---

## 6. Workflow de geração (passo a passo)

1. `create_project` → **"CoutHealth"**.
2. Enviar o **Prompt Base (Design DNA)** da §7 como contexto/estilo do projeto.
3. Para **cada tela** do inventário (§8): `generate_screen_from_text` com o prompt específico, **duas variantes**: `web` (desktop) e `mobile`. Guias do Stitch: mobile costuma render com mais qualidade; **seja específico** ("dark mode, card-based, minimal" > "faça bonito").
4. Revisar com `get_screen_image`; iterar o prompt até bater com a Design DNA.
5. `get_screen_code` / `build_site` para extrair layout de referência.
6. Reimplementar no front (React SPA / Next.js) com os **tokens da §3** e os **componentes da §4**.
7. **Commitar no GitHub após cada mudança** (ver `escopo.md` §12). Não versionar a chave.

**Idioma dos prompts:** instruções em **inglês** (Stitch/Gemini rende melhor), mas **todo texto de tela em português** (é um produto BR). Isso está embutido nos prompts abaixo.

---

## 7. Prompt Base (Design DNA) — reutilizar em toda tela

> Cole isto no início de cada geração (ou como estilo do projeto):

```
Design system: "CoutHealth" — premium health-tech, dark-first, minimal, calm.
Inspiration: Apple, Oura, Whoop. NOT a gym app; no loud fitness clichés.
Palette: base #0E0F11, surfaces #17181B and #222222, hairlines #2C2E32,
secondary text #4A4F54/#9A9DA2, light #EDEDED, white #FFFFFF.
Single accent = warm yellow #F7BE00 (hover/gradient to #F5B335), used sparingly
for primary actions and progress only; text on yellow is near-black #0E0F11.
Signature element: a "continuity ring" (circular progress ring) with the
yellow gradient — reuse it for progress/cycles.
Typography: display = Space Grotesk (600–700) for headings and big numbers;
body/UI/data = Inter (400–500). Generous spacing, radius 14–20px, subtle depth
(no heavy shadows), gentle 160–240ms motion.
All on-screen copy MUST be in Brazilian Portuguese. Icons: thin-line (Lucide-style).
Accessible contrast (AA), visible focus states.
```

---

## 8. Inventário de telas (gerar cada uma em desktop + mobile)

### A) Landing (público) — Next.js — **3 direções para o cliente escolher**
Gerar **três landings distintas** (não são variações de cor — são conceitos diferentes), cada uma desktop + mobile. O cliente aprova **uma**; as três ficam navegáveis em `/`, `/v2`, `/v3` até a escolha.

1. **Landing A — "Cinematográfica dark"** (mais próxima da referência aprovada): hero full-bleed escuro com foto do Rafael, headline display grande, cards em glassmorphism sutil, badge de credibilidade, anel de continuidade. Editorial, alto contraste, impacto imediato.
2. **Landing B — "Clínica premium (Oura-like)"**: mais calma e com respiro; o **ciclo de acompanhamento** é o herói (diagrama/animação do anel em vez de foto). Foco em confiança/método, tipografia refinada, prova baseada em processo. Menos cinematográfica, mais "health-tech de confiança".
3. **Landing C — "Editorial clara + amarelo"**: light-first (lado branco da marca, como o cartão de visita), headlines Luxora enormes, amarelo como acento forte, grid tipográfico marcante, pattern "C" como textura. Sensação genuinamente diferente das outras duas.

Todas as três compartilham as mesmas seções de conteúdo (hero → como funciona → diferenciais → planos → depoimentos → app → FAQ → CTA/rodapé) e o mesmo copy PT; **muda a direção visual e o layout**, não a mensagem.

### B) Autenticação & Onboarding — App (React SPA)
2. **Cadastro** (e-mail/senha + Google)
3. **Login**
4. **Escolha de plano** (Essencial/Plus/Elite × período, com cupom)
5. **Checkout / Pagamento** (PIX/cartão) + confirmação
6. **Anamnese** (formulário único, multi-etapas, com "Responder depois" e barra = anel de continuidade)

### C) Área do cliente — App (React SPA / APK)
7. **Dashboard** (resumo, próxima revisão, últimas mensagens/planos, notificações)
8. **Nutrição** (plano por refeição + macros/kcal por 100 g)
9. **Treino** (lista A/B/C… + detalhe do exercício com vídeo)
10. **Biblioteca** (receitas/artigos/vídeos/materiais + detalhe)
11. **Mensagens** (thread cliente ↔ equipe)
12. **Notificações**
13. **Evolução** (gráficos de medidas + registrar avaliação)
14. **Check-in** (nutrição/treino)
15. **Perfil / Avaliação física**

### D) Painel administrativo — App (React SPA)
16. **Admin — Dashboard** (fila de anamneses, pacientes prioritários, atalhos)
17. **Admin — Cliente** (ver anamnese + montar/publicar plano alimentar e treino)
18. **Admin — Banco de Alimentos** (CRUD)
19. **Admin — Banco de Exercícios** (CRUD)
20. **Admin — Biblioteca** (receitas/artigos/vídeos/materiais)
21. **Admin — Notificações** (campanhas/personalizadas)
22. **Admin — Cupons**
23. **Admin — Planos & Assinaturas**

---

## 9. Prompts prontos por tela

> Cada prompt assume o **Prompt Base (§7)** já aplicado. Gerar `web` e `mobile`.

**1A. Landing — direção Cinematográfica dark**
```
Premium marketing landing page for "CoutHealth", a continuous health-coaching service
(nutrition + training) run by professionals. Direction: cinematic dark, editorial,
high-contrast. Full-bleed dark hero with a professional photo, a bold Portuguese
display headline about "cuidado contínuo", and a primary yellow CTA "Criar conta".
Sections: how it works (4-step continuous cycle: cadastro → anamnese → análise
profissional → acompanhamento), differentiators (technology + human professional),
plans (Essencial / Plus / Elite with a period toggle Mensal/Trimestral/Semestral/Anual),
testimonials, app-mockup block, FAQ accordion, final CTA, footer. Subtle "C" ring
pattern texture; continuity-ring motif. Copy in Brazilian Portuguese. Must look like a
top studio built it — not templated.
```

**1B. Landing — direção Clínica premium (Oura-like)**
```
Premium marketing landing page for "CoutHealth". Direction: calm clinical premium,
Oura/Whoop-like, lots of whitespace, refined typography, trust-first. The HERO is the
continuous-care CYCLE itself: an elegant animated continuity ring / diagram (cadastro →
anamnese → análise profissional → acompanhamento) instead of a big photo. Same sections
as the other version (how it works, differentiators, plans Essencial/Plus/Elite with
period toggle, testimonials, app mockup, FAQ, CTA, footer). Dark, minimal, medical-grade
trust. Yellow accent used sparingly. Copy in Brazilian Portuguese. Polished, professional.
```

**1C. Landing — direção Editorial clara + amarelo**
```
Premium marketing landing page for "CoutHealth". Direction: LIGHT editorial, magazine
grid, typographic. Light background (brand's white side), huge display headlines,
strong yellow #F7BE00 accents, structured columns, the "C" ring pattern as texture.
Same content/sections as the other versions (how it works cycle, differentiators, plans
with period toggle, testimonials, app mockup, FAQ, CTA, footer). Genuinely different feel
from the dark versions — confident, editorial, high-end. Copy in Brazilian Portuguese.
```

**2. Cadastro**
```
Sign-up screen. Email + password, plus "Continuar com Google". Minimal, centered
card on dark background, continuity-ring accent. LGPD consent checkbox with link to
"Política de Privacidade". Copy in Brazilian Portuguese ("Criar conta").
```

**4. Escolha de plano**
```
Plan selection. Three plan cards — Essencial, Plus, Elite — with feature lists;
a period toggle (Mensal, Trimestral, Semestral, Anual) that shows growing discount;
a coupon field. "Elite" highlighted with yellow accent. Portuguese copy.
```

**6. Anamnese**
```
Single multi-step health intake form (anamnese) combining: dados pessoais, objetivo,
alimentação, saúde, sono, função intestinal, hábitos, exercícios, avaliação física.
Top progress shown as a yellow continuity ring / step bar. Persistent "Responder
depois" (save & continue later) button. Clean grouped fields, one section per step,
dark theme. Portuguese labels exactly as listed.
```

**7. Dashboard (cliente)**
```
Client home dashboard, Oura/Whoop-like calm premium. Top: greeting + next plan
review date shown in a continuity ring. Cards: último plano alimentar, treino de hoje,
últimas mensagens, notificações, próximo check-in. Bottom nav on mobile, sidebar on
desktop. Portuguese copy.
```

**8. Nutrição**
```
Nutrition plan screen. Meals listed by time (Café, Almoço, Lanche, Jantar...), each
meal with foods, quantities, notes. Each food expandable to show kcal/protein/carbs/
fat per 100 g. Calm dark cards, macros in tabular Inter. Portuguese.
```

**9. Treino**
```
Workout screen. Tabs/letters (Treino A, B, C...). List of exercises with sets, reps,
optional load, optional rest, notes, and an embedded demo video thumbnail. Detail view
per exercise with the video player. Dark premium, yellow accents on active tab.
Portuguese.
```

**13. Evolução**
```
Progress screen. Minimal line/area charts for peso, cintura, abdômen, braço, coxa,
massa muscular, massa de gordura over time. A "registrar avaliação" primary action.
Empty-state that invites the user to add first measurements. One yellow accent line,
subtle grid. Portuguese.
```

**16. Admin — Dashboard**
```
Professional/admin dashboard. Queue of pending anamneses, "pacientes prioritários",
quick actions (publicar plano, nova notificação). Dense but calm dark data UI,
sidebar nav. Portuguese. This is an internal tool for the professional — never
auto-generates clinical plans; it only helps organize.
```

**17. Admin — Cliente (montar/publicar)**
```
Admin patient detail. Left: read the client's anamnese (grouped). Right: builder to
compose the plano alimentar (meals + foods from the food bank) and the treino
(workouts A/B/C from the exercise bank), then a primary "Publicar" action that
notifies the client. Internal messaging panel to ask the client questions before
publishing. Dark premium admin UI. Portuguese.
```

**18. Admin — Banco de Alimentos**
```
Admin CRUD table for the food bank (~50 items, expandable): nome, categoria, kcal,
proteínas, carboidratos, gorduras, observações. Search, add, edit modal. Dark data
table, Inter tabular numbers. Portuguese.
```

**19. Admin — Banco de Exercícios**
```
Admin CRUD for the exercise bank (~50, expandable): nome, grupo muscular, descrição,
vídeo. Table + add/edit modal with video URL field. Dark. Portuguese.
```

**21. Admin — Notificações**
```
Admin screen to create custom notifications/campaigns (promoções, avisos, campanhas,
lembretes) targeting all or segments of clients, without code. Compose + schedule +
audience. Dark. Portuguese.
```

> Telas 3, 5, 10, 11, 12, 14, 15, 20, 22, 23 seguem o mesmo padrão: reaproveitar o Prompt Base + descrever objetivo/campos do módulo correspondente no `escopo.md`.

---

## 10. Nomenclatura de telas e rotas

Nomear no Stitch como `plataforma/<modulo>-<web|mobile>`. Ex.: `plataforma/nutricao-mobile`, `plataforma/admin-cliente-web`.

Rotas do app: `/`, `/entrar`, `/criar-conta`, `/planos`, `/checkout`, `/anamnese`, `/app` (dashboard), `/app/nutricao`, `/app/treino`, `/app/biblioteca`, `/app/mensagens`, `/app/evolucao`, `/app/perfil`, `/admin`, `/admin/clientes/:id`, `/admin/alimentos`, `/admin/exercicios`, `/admin/biblioteca`, `/admin/notificacoes`, `/admin/cupons`, `/admin/assinaturas`.

---

## 11. Consistência — Do / Don't

**Do:** dark-first; amarelo só em ação/progresso; anel de continuidade como assinatura; Space Grotesk (ou Luxora) em títulos + Inter em dados; espaçamento generoso; foco visível; copy em PT, voz ativa; gerar mobile e desktop de cada tela.

**Don't:** amarelo como cor de fundo grande; sombras pesadas; visual de "app de academia"; texto branco sobre amarelo; colar HTML do Stitch cru sem passar pelos tokens; commitar a `STITCH_API_KEY`.

---

## 12. Referências
- Setup e ferramentas do Stitch MCP (transporte HTTP + `X-Goog-Api-Key`; ferramentas `create_project`, `generate_screen_from_text`, `get_screen`, `build_site`, `get_screen_code`, `get_screen_image`).
- Manual da Marca — Rafael Coutinho (cores, tipografia Luxora Grotesk, símbolo/pattern).
- `escopo.md` (fluxos, módulos, decisões em aberto).
