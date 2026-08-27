import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MessagesSquare, Send, Trash2, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";
import { generateChatReply } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "A professional workplace chatbot for emails, summaries, plain-language explanations, and meeting prep.",
      },
      { property: "og:title", content: "AI Workplace Chatbot | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Ask workplace questions and get clear, structured, professional guidance.",
      },
    ],
  }),
  component: Chatbot,
});

type Message = { id: number; role: "user" | "assistant"; content: string };

const WELCOME: Message = {
  id: 0,
  role: "assistant",
  content:
    "Hello — I'm your workplace assistant. I can help you draft emails, summarise documents, explain complex information simply, and prepare for meetings. What are you working on?",
};

const suggestions = [
  "Help me write a professional email.",
  "Summarize this report.",
  "Explain this information simply.",
  "Give me recommendations for this task.",
  "Help me prepare for a meeting.",
];

function renderLine(line: string, i: number) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p key={i} className={cn("min-h-[0.5rem]", line.startsWith("•") || /^\d\./.test(line) ? "pl-1" : "")}>
      {parts.map((p, j) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={j} className="font-semibold">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={j}>{p}</span>
        ),
      )}
    </p>
  );
}

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setInput("");
    setMessages((m) => [...m, { id: Date.now(), role: "user", content }]);
    setLoading(true);
    try {
      const reply = await generateChatReply(content);
      setMessages((m) => [...m, { id: Date.now() + 1, role: "assistant", content: reply }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          icon={MessagesSquare}
          title="AI Workplace Chatbot"
          description="A professional assistant for everyday work questions, drafting, and planning."
        />
        <Button variant="outline" onClick={() => setMessages([WELCOME])}>
          <Trash2 className="size-4" /> Clear Chat
        </Button>
      </div>

      <section className="fade-rise panel flex h-[60vh] min-h-[420px] flex-col overflow-hidden">
        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
            >
              {m.role === "assistant" && (
                <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                  <Bot className="size-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] space-y-1.5 rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-surface-foreground",
                )}
              >
                {m.content.split("\n").map(renderLine)}
              </div>
              {m.role === "user" && (
                <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="grid size-8 place-items-center rounded-lg bg-secondary">
                <Bot className="size-4" />
              </div>
              <span className="flex items-center gap-2">
                <Loader2 className="size-3.5 animate-spin" /> Thinking…
              </span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t bg-card p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                disabled={loading}
                className="rounded-full border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <Textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask anything about your work…"
              className="max-h-40 min-h-[44px] resize-none"
            />
            <Button type="submit" size="icon" className="size-11 shrink-0" disabled={loading || !input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </section>

      <ResponsibleAINotice />
    </div>
  );
}
