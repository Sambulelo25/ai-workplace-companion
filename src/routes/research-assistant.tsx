import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpenText, Copy, RefreshCw, Trash2, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";
import { aiResearch } from "@/lib/ai.functions";

type ResearchResult = { summary: string; insights: string; points: string; recommendations: string };
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/research-assistant")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste a report or article and get an editable summary, key insights, important points, and recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Turn long documents into clear summaries, insights, and recommendations.",
      },
    ],
  }),
  component: ResearchAssistant,
});

const sectionMeta: { key: keyof ResearchResult; title: string; hint: string }[] = [
  { key: "summary", title: "Summary", hint: "The overall picture in a few sentences." },
  { key: "insights", title: "Key Insights", hint: "What the material really tells you." },
  { key: "points", title: "Important Points", hint: "The details worth remembering." },
  { key: "recommendations", title: "Recommendations", hint: "Practical next actions." },
];

function ResearchAssistant() {
  const [topic, setTopic] = useState("");
  const [source, setSource] = useState("");
  const [mode, setMode] = useState<"standard" | "simplified">("standard");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!topic.trim() && !source.trim()) {
      toast.error("Add a topic or paste some text first.");
      return;
    }
    setLoading(true);
    try {
      setResult(await aiResearch({ data: { topic, source, mode } }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setTopic("");
    setSource("");
    setResult(null);
  }

  async function copyAll() {
    if (!result) return;
    const text = sectionMeta
      .map(({ key, title }) => `${title.toUpperCase()}\n${result[key]}`)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    toast.success("Research output copied to clipboard");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={BookOpenText}
        title="AI Research Assistant"
        description="Summarise reports and articles into scannable sections you can edit, copy, and share."
      />

      <section className="fade-rise panel space-y-5 p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-2">
            <Label htmlFor="topic">Research topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Hybrid work policy trends for 2026"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Output style</Label>
            <div className="inline-flex rounded-lg border bg-surface p-1">
              {(["standard", "simplified"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-md px-4 py-1.5 text-sm capitalize transition-colors duration-200",
                    mode === m
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m === "standard" ? "Standard summary" : "Simplified explanation"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="source">Article, report, or text</Label>
          <Textarea
            id="source"
            rows={9}
            placeholder="Paste the content you want summarised…"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={run} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
            {loading ? "Analysing…" : "Generate Research Brief"}
          </Button>
          <Button variant="outline" onClick={copyAll} disabled={!result}>
            <Copy className="size-4" /> Copy
          </Button>
          <Button variant="outline" onClick={run} disabled={loading || !result}>
            <RefreshCw className="size-4" /> Regenerate
          </Button>
          <Button variant="ghost" onClick={clearAll}>
            <Trash2 className="size-4" /> Clear
          </Button>
        </div>
      </section>

      {result && (
        <div className="grid gap-5 lg:grid-cols-2">
          {sectionMeta.map(({ key, title, hint }) => (
            <section key={key} className="fade-rise panel flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">{title}</h2>
                  <p className="text-xs text-muted-foreground">{hint}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await navigator.clipboard.writeText(result[key]);
                    toast.success(`${title} copied`);
                  }}
                >
                  <Copy className="size-3.5" />
                </Button>
              </div>
              <Textarea
                className="mt-3 min-h-[190px] flex-1 resize-none text-[13px] leading-relaxed"
                value={result[key]}
                onChange={(e) => setResult({ ...result, [key]: e.target.value })}
              />
            </section>
          ))}
        </div>
      )}

      <ResponsibleAINotice />
    </div>
  );
}
