// Minimal stand-in for the Anthropic Messages API, for local UI work and
// tests without a real key. It never sees the internet and logs nothing.
//
//   node scripts/mock-llm.mjs            # listens on http://127.0.0.1:8787
//   LLM_PROVIDER=anthropic LLM_MODEL=mock LLM_API_KEY=mock \
//   LLM_BASE_URL=http://127.0.0.1:8787 npm run dev
//
// Set MOCK_FAIL=1 to make every call return HTTP 500 (safe-failure test G11).

import http from "node:http";

const PORT = Number(process.env.MOCK_PORT ?? 8787);
const FAIL = process.env.MOCK_FAIL === "1";

const REPLIES = {
  Turkish:
    "Bu bir örnek yanıttır (sahte model). Gerçek sistemde yanıt yalnızca onaylı içerikten üretilir. İsterseniz eğitimli bir uzmanla konuşabilirsiniz. Hızlı Çıkış butonunu istediğiniz zaman kullanabilirsiniz.",
  Arabic:
    "هذه إجابة تجريبية (نموذج وهمي). في النظام الفعلي تُنتج الإجابة من المحتوى المعتمد فقط. يمكنكِ التحدث مع أخصائية مدرّبة إذا أردتِ. يمكنكِ استخدام زر الخروج السريع في أي وقت.",
};

function classify(text) {
  const t = text.toLowerCase();
  if (/yaşamak istemiyorum|14 yaşındayım|evlendirecek|اعيش/.test(t)) return "high";
  if (/bağırıyor|izin vermiyor|لا يسمح/.test(t)) return "medium";
  return "low";
}

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    if (FAIL) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "mock_failure" }));
      return;
    }
    let text;
    try {
      const data = JSON.parse(body);
      const system = String(data.system ?? "");
      const last = data.messages?.[data.messages.length - 1]?.content ?? "";
      if (system.startsWith("You are a safety classifier")) {
        text = JSON.stringify({ risk: classify(String(last)), category: "none" });
      } else {
        const lang = /reply in Arabic/.test(system) ? "Arabic" : "Turkish";
        text = REPLIES[lang];
      }
    } catch {
      res.writeHead(400);
      res.end();
      return;
    }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ content: [{ type: "text", text }] }));
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`mock llm listening on http://127.0.0.1:${PORT}${FAIL ? " (FAIL mode)" : ""}`);
});
