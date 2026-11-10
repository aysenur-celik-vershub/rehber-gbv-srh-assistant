# Roadmap (after the demo)

Short version; the 12-month milestones are in the application form. Everything below
builds on two seams that already exist in the prototype: `lib/llm.ts` (one `complete()`
call, provider chosen by environment) and `lib/content.ts` (one `getGroundingContent()`
call, today full-context, tomorrow retrieval).

1. **Vetted content, for real.** Replace all placeholders with reviewed Turkish and Arabic
   texts; add an editorial workflow (versioning, `reviewed`/`reviewer` tracked per file);
   move `getGroundingContent()` to retrieval (embeddings + similarity search) once the
   corpus grows beyond a few dozen documents.
2. **Measured safety.** A labelled test set for the risk classifier (Turkish and Arabic),
   evaluation scripts, red-teaming for prompt injection and misuse, an independent
   security review.
3. **Real referral.** Agreements with support organisations, a consent-based referral
   record, a case-worker dashboard. This is the first point where personal data exists:
   encryption, data minimisation, retention limits and audit logs are designed before any
   data is stored.
4. **More channels.** WhatsApp Business and SMS adapters sharing the same core; voice
   input and output for low-literacy users.
5. **More languages.** Farsi and Kurmanji with native-speaker content and keyword lists,
   using the per-language structure already in `locales/`, `content/` and `config/`.
6. **Model independence.** A self-hosted open-weight model behind `lib/llm.ts` for data
   sovereignty and cost; later, a compressed on-device model for offline use.
