import type { ChatRole } from "@/lib/types";

type Props = {
  role: ChatRole;
  content: string;
  roleLabel: string;
};

// Model output is rendered as plain text only (pre-wrap). Never as HTML.
export default function MessageBubble({ role, content, roleLabel }: Props) {
  const isUser = role === "user";
  return (
    <div className={"flex " + (isUser ? "justify-end" : "justify-start")}>
      <div
        dir="auto"
        className={
          "max-w-[85%] rounded-2xl px-4 py-3 text-base whitespace-pre-wrap break-words " +
          (isUser
            ? "rounded-ee-md bg-brand text-white"
            : "rounded-es-md border border-line bg-surface text-ink")
        }
      >
        <span className="sr-only">{roleLabel}: </span>
        {content}
      </div>
    </div>
  );
}
