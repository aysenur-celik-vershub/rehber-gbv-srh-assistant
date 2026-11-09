import { describe, expect, it } from "vitest";
import { validateChatRequest } from "@/lib/validate";

const user = (content: string) => ({ role: "user", content });

describe("validateChatRequest", () => {
  it("accepts a minimal valid request", () => {
    const r = validateChatRequest({ language: "tr", messages: [user("merhaba")] });
    expect(r.ok).toBe(true);
  });
  it("rejects unknown language", () => {
    expect(validateChatRequest({ language: "fa", messages: [user("x")] })).toEqual({ ok: false, status: 400 });
  });
  it("rejects empty messages", () => {
    expect(validateChatRequest({ language: "tr", messages: [] })).toEqual({ ok: false, status: 400 });
  });
  it("rejects when last message is not from the user", () => {
    expect(validateChatRequest({ language: "tr", messages: [user("a"), { role: "assistant", content: "b" }] })).toEqual({ ok: false, status: 400 });
  });
  it("rejects a system role from the client", () => {
    expect(validateChatRequest({ language: "tr", messages: [{ role: "system", content: "x" }, user("a")] })).toEqual({ ok: false, status: 400 });
  });
  it("rejects messages over 1000 characters", () => {
    expect(validateChatRequest({ language: "tr", messages: [user("a".repeat(1001))] })).toEqual({ ok: false, status: 400 });
    expect(validateChatRequest({ language: "tr", messages: [user("a".repeat(1000))] }).ok).toBe(true);
  });
  it("keeps only the last 10 messages", () => {
    const messages = [];
    for (let i = 0; i < 25; i++) messages.push(i % 2 === 0 ? user(`u${i}`) : { role: "assistant", content: `a${i}` });
    messages.push(user("last"));
    const r = validateChatRequest({ language: "ar", messages });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.messages).toHaveLength(10);
      expect(r.value.messages[9].content).toBe("last");
    }
  });
});
