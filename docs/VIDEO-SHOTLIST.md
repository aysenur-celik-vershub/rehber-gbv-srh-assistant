# Pitch video – shot list (2 min)

Script by the project owner (10 Nov 2026). Screen recording is taken on the deployed
address in the **Arabic** UI, Chrome DevTools device emulation (Pixel 7, 412×915), in a
**freshly opened tab** (needed for the "no way back" shot). On-screen captions in English.
No real people, cases or organisations appear on screen; referral data is the fictional
sample set.

## Prerequisites

- `feat/demo-prototype` merged into `main`; repository renamed `wellspring-assistant`
  (the GitHub page is on camera at 1:35).
- Deployed at a neutral address (e.g. `wellspring.vercel.app`).
- Arabic content for at least `05-regl-ve-hijyen` in place (1:50 shot needs a real
  answer; placeholders make the assistant say it has no information).

## Scenes

| Time | On screen | What to do | Input |
|---|---|---|---|
| 0:00–0:38 | Founder on camera | — | — |
| 0:38–0:50 | Welcome → Arabic → RTL flip → Start | Open the address in a new tab, tap **العربية**, let the page mirror, tap **ابدئي** | — |
| 0:50–1:03 | Menstrual-hygiene answer, then an unknown question | Tap the topic button **الدورة الشهرية والنظافة**, wait for the reply; then type the unknown question and send | ما رقم هاتف أفضل محامية في إسطنبول؟ |
| 1:03–1:15 | High-risk message → emergency card above the reply | Type and send; the red card appears before the reply | زوجي يهددني بالقتل الآن |
| 1:15–1:26 | Consent-based referral, "بيانات تجريبية" label visible | Tap **نعم** → **نعم، متابعة** → province **غازي عنتاب**, need **الصحة** → **عرض الخيارات**; optional 2 s cut of DevTools Network tab showing no requests | — |
| 1:26–1:35 | Quick Exit → weather page → back button | Tap **العودة إلى المحادثة**, then **خروج سريع** (top-left in Arabic); press the browser back button: it does not return to the app | — |
| 1:35–1:45 | GitHub repository page | Show `main` with the README, click LICENSE (Apache-2.0) | — |
| 1:45–2:00 | Founder on camera | — | — |

## Script (English, ~290 words)

| Time | Screen | Voice |
|---|---|---|
| 0:00–0:22 | Founder, to camera | Hi, I'm Ayşenur Çelik, founder of VersHub. I started my career as an operating theatre nurse, and for over ten years I've worked with refugee women and girls in Türkiye on gender-based violence and sexual and reproductive health. Again and again, I've met women who didn't know where to turn, didn't speak the language, or couldn't search for help on a phone someone else checks. |
| 0:22–0:38 | Founder | Since January 2026, health access for refugees in Türkiye has narrowed, and the need for safe, trusted information has grown. So, together with our developer and a GBV and legal expert, we built Wellspring. Let me show you how it works today. |
| 0:38–0:50 | Screen: welcome, Arabic, RTL | No account, no name, no phone number. She chooses Arabic, and the whole app switches to right-to-left. |
| 0:50–1:03 | Screen: menstrual-hygiene Q&A, then unknown question | She asks about menstrual hygiene, and Wellspring answers only from expert-vetted content. When it doesn't know something, it says so instead of making it up. |
| 1:03–1:15 | Screen: high-risk message, emergency card | Now a high-risk message. Emergency contacts appear instantly, and they appear even if the AI fails. |
| 1:15–1:26 | Screen: consent-based referral, sample-data label | Referral is always her choice. She decides what to share, and nothing leaves her phone. |
| 1:26–1:35 | Screen: Quick Exit, weather page, back button | And one tap on Quick Exit takes her to a weather page, with no way back. |
| 1:35–1:45 | Screen: GitHub repository | Wellspring is open source under Apache-2.0, so organisations anywhere can add their own languages, content and referral pathways. |
| 1:45–2:00 | Founder, to camera | With UNICEF's support, we'll add Farsi and voice, validate Wellspring with protection experts, and pilot it safely with women and girls. Because every woman deserves a safe first step. Thank you. |
