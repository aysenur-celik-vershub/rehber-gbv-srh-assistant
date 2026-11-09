# Rehber – AI-supported GBV and SRH information and safe referral assistant

> Early-stage prototype developed by VersHub for the UNICEF Femtech Ventures call (2026).

## What it does

A privacy-first, multilingual (Turkish, Arabic) AI assistant that helps women and girls,
including refugees and migrants in Türkiye, access vetted information on gender-based
violence and sexual and reproductive health, recognises risk signals, and offers
consent-based referral to support services.

## Live demo

`<URL – to be added after deployment>`

## Status: early-stage prototype

| Feature | Status |
|---|---|
| Turkish and Arabic chat (full RTL) | ✅ In demo |
| Answers grounded only in vetted content | ✅ In demo |
| Two-layer risk detection (keywords + AI classifier, highest wins) | ✅ In demo |
| Emergency information card independent of AI output | ✅ In demo |
| Consent-based referral flow (user chooses what to share) | ✅ In demo (sample data) |
| Quick exit (button + Esc), no history trace | ✅ In demo |
| Voice input/output for low-literacy users | 🛣 Roadmap |
| WhatsApp / SMS channel | 🛣 Roadmap |
| Offline on-device model (edge AI) | 🛣 Roadmap |
| Human case-worker handoff dashboard | 🛣 Roadmap |
| Farsi and other languages | 🛣 Roadmap |

**All service providers shown in the referral flow are fictional sample data**
(`data/sample-services.json`; names start with "Örnek"/"تجريبي" and phone numbers are
deliberately invalid).

Content marked `reviewed: false` is placeholder or pending expert review. At the moment
**all 14 content files** (7 Turkish, 7 Arabic under `content/`) are placeholders waiting
for the vetted texts; until they are replaced the assistant states it has no information on
the topic and points to support options. The Arabic UI strings in `locales/ar.json` are a
draft pending review by a native speaker.

## Privacy and safety by design

- No accounts, no names, phone numbers or addresses requested
- Conversations are kept only in browser memory (React state) and are deleted when the tab closes
- No cookies, local storage, analytics or third-party trackers; no external fonts or CDNs
- Message content is not logged on the server (only error kind and HTTP status on failure)
- Messages are sent to the AI provider only to generate replies; retention of that data is
  subject to the provider's policy (see "Tech stack")
- Referral choices are processed entirely in the browser and never sent anywhere
- Neutral title and icon for shared-device safety; the app is a single route, so quick exit
  (`location.replace`) leaves no back-navigation trace; `Referrer-Policy: no-referrer`
  keeps the app address from the exit destination
- Safe failure: if the AI fails, the keyword layer still triggers the emergency card and the
  user is still offered support ("more safety information on error, not less")
- Model output is rendered as plain text only, never as HTML
- Security headers: `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options`,
  `Permissions-Policy`, `Strict-Transport-Security` (see `next.config.ts`)
- Next.js telemetry is disabled on the development machine (`npx next telemetry disable`)

## Architecture

```
Browser (chat history in React state only)
      │  POST /api/chat  { language, messages }
      ▼
Next.js API route (serverless, stateless)
      ├─ 1) Input validation (lib/validate.ts)
      ├─ 2) Keyword risk check, instant, no AI (lib/risk.ts)
      ├─ 3) Two parallel model calls (lib/llm.ts):
      │       a) risk classification (returns JSON)
      │       b) answer generation (vetted content + system prompt)
      ├─ 4) Combine risk levels: the higher one wins
      └─ 5) Response: { reply, risk, showEmergency, showSupportOffer }
      ▼
Browser shows the emergency card / support offer according to risk
```

## Tech stack

Next.js 16 (App Router, TypeScript, strict), Tailwind CSS 4, Vitest, Vercel.
The LLM layer is abstracted (`lib/llm.ts`, one `complete()` function; provider, model
and key come from environment variables only) so the assistant can move to another
provider or an open-weight model; `anthropic` and any OpenAI-compatible API are supported
out of the box. Grounding currently passes all vetted content as context; `lib/content.ts`
is designed to switch to retrieval (RAG) as content grows. Heavier future work (edge
model compression, embeddings, evaluation scripts) can live in a separate Python service
behind the same two entry points without changing the UI.

Measured first load (production build, Lighthouse mobile, welcome screen): 153 KiB
transferred, Accessibility 100, Performance 90, Best practices 100; usable in about 4 s on an
emulated Slow 3G connection. All assets are served from the app itself. `npm audit` reports 0
vulnerabilities in production dependencies (one moderate advisory remains in ESLint's
dev-only tooling, not shipped).

## Run locally

```bash
git clone <repo>
cd <repo>
cp .env.example .env.local   # add your provider, model and key
npm install
npm run dev
```

Environment variables:

| Variable | Example | Notes |
|---|---|---|
| `LLM_PROVIDER` | `anthropic` | or `openai` for any OpenAI-compatible API |
| `LLM_MODEL` | model id of the provider | never hard-coded |
| `LLM_API_KEY` | secret | never committed |
| `LLM_BASE_URL` | optional | override the provider's base URL (gateways, mock) |

To work on the UI without a key, run the bundled mock provider:

```bash
node scripts/mock-llm.mjs      # terminal 1
LLM_PROVIDER=anthropic LLM_MODEL=mock LLM_API_KEY=mock \
LLM_BASE_URL=http://127.0.0.1:8787 npm run dev   # terminal 2
```

`MOCK_FAIL=1 node scripts/mock-llm.mjs` makes every model call fail, to verify that the
emergency card still appears (test G11).

To compare two candidate models on the brief's Arabic and grounding tests (15.1: 4, 5, 6,
11, 7, 8), run the app once per model and use `scripts/compare-models.mjs run` / `merge`
(usage at the top of the script); it prints a side-by-side Markdown table.

Checks: `npm run lint`, `npm test`, `npm run typecheck`, `npm run build`.

## Adapting to a new language or country

1. Add `locales/<lang>.json`
2. Add vetted content under `content/<lang>/`
3. Add keywords to `config/risk_keywords.json`
4. Update `config/emergency_contacts.json` with verified local numbers

## Known limitations

- All vetted content files are placeholders until the approved texts arrive; replies are
  therefore limited to "no information on this topic" plus support options.
- Arabic UI strings (including Arabic province names) and the keyword list are drafts awaiting native-speaker review.
- Switching language mid-conversation keeps the history; later replies come in the new language, and the welcome message is not repeated.
- The keyword layer matches substrings on purpose (stems), so some false positives are
  expected (e.g. Turkish "öldürücü", or an adult describing a forced marriage being rated
  high); this is the intended cautious behaviour, confirmed by the project owner.
- No streaming: the reply arrives in one piece after both model calls finish (up to 20 s).
- Tests listed in `TESTS.md` as "pending" must still be run on the deployed URL and on
  real Android/iOS devices.

## License

Apache-2.0
