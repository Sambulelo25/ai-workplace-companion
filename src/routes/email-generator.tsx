import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Copy, RefreshCw, Trash2, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";
import { generateEmail, type Audience, type Tone } from "@/lib/mock-ai";

export const Route = createFileRoute("/email-generator")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate professional workplace emails by audience and tone, then edit, copy, or regenerate the draft.",
      },
      { property: "og:title", content: "Smart Email Generator | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Draft clear, professional emails for clients, managers, and teams in seconds.",
      },
    ],
  }),
  component: EmailGenerator,
});

function EmailGenerator() {
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState<Audience>("Client");
  const [tone, setTone] = useState<Tone>("Formal");
  const [instructions, setInstructions] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!purpose.trim()) {
      toast.error("Add an email purpose or context first.");
      return;
    }
    setLoading(true);
    try {
      setResult(await generateEmail({ purpose, audience, tone, instructions }));
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setPurpose("");
    setInstructions("");
    setResult("");
  }

  async function copy() {
    await navigator.clipboard.writeText(result);
    toast.success("Email copied to clipboard");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe what you need to say, choose your audience and tone, and get a professional draft you can edit."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <section className="fade-rise panel space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="purpose">Email purpose / context</Label>
            <Textarea
              id="purpose"
              rows={5}
              placeholder="e.g. Follow up with the client about the delayed delivery and propose a new timeline."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Team">Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Informal">Informal</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Additional instructions</Label>
            <Input
              id="instructions"
              placeholder="e.g. Keep it under 150 words; mention the invoice reference."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={run} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
            {loading ? "Generating…" : "Generate Email"}
          </Button>
        </section>

        <section className="fade-rise panel flex min-h-[420px] flex-col p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div>
              <h2 className="text-sm font-semibold">Generated email</h2>
              <p className="text-xs text-muted-foreground">Editable — adjust before you copy.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={copy} disabled={!result}>
                <Copy className="size-3.5" /> Copy
              </Button>
              <Button size="sm" variant="outline" onClick={run} disabled={loading || !purpose.trim()}>
                <RefreshCw className="size-3.5" /> Regenerate
              </Button>
              <Button size="sm" variant="ghost" onClick={clearAll}>
                <Trash2 className="size-3.5" /> Clear
              </Button>
            </div>
          </div>

          {result ? (
            <Textarea
              className="mt-4 min-h-[340px] flex-1 resize-none font-mono text-[13px] leading-relaxed"
              value={result}
              onChange={(e) => setResult(e.target.value)}
            />
          ) : (
            <div className="mt-4 flex flex-1 items-center justify-center rounded-xl border border-dashed bg-surface p-8 text-center">
              <p className="max-w-xs text-sm text-muted-foreground">
                {loading ? "Drafting your email…" : "Your generated email will appear here, ready to edit."}
              </p>
            </div>
          )}
        </section>
      </div>

      <ResponsibleAINotice />
    </div>
  );
}
