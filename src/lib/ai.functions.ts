import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function chat(system: string, user: string): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured (missing API key).");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `AI request failed (HTTP ${res.status}).`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export const aiEmail = createServerFn({ method: "POST" })
  .inputValidator(
    (data) =>
      z
        .object({
          purpose: z.string().min(1),
          audience: z.enum(["Client", "Manager", "Team"]),
          tone: z.enum(["Formal", "Informal", "Persuasive"]),
          instructions: z.string(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    return chat(
      "You are an expert workplace communication assistant. Write professional, specific, ready-to-send emails. Output the email only: start with 'Subject: ...', then the greeting, body, and sign-off. No commentary.",
      `Write a ${data.tone.toLowerCase()} email to my ${data.audience.toLowerCase()}.\n\nPurpose/context:\n${data.purpose}${
        data.instructions.trim() ? `\n\nAdditional instructions:\n${data.instructions}` : ""
      }`,
    );
  });

export const aiResearch = createServerFn({ method: "POST" })
  .inputValidator(
    (data) =>
      z
        .object({
          topic: z.string(),
          source: z.string(),
          mode: z.enum(["standard", "simplified"]),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    const style =
      data.mode === "simplified"
        ? "Write for a non-expert: plain language, short sentences, no jargon."
        : "Write for a professional audience: concise, precise, business-appropriate.";
    const text = await chat(
      `You are an expert research analyst. ${style} Analyse the material and respond with EXACTLY these four sections, each starting with its heading on its own line:\nSUMMARY\nKEY INSIGHTS\nIMPORTANT POINTS\nRECOMMENDATIONS\nUnder each heading provide substantive, specific content grounded in the material (numbered or bulleted lists for insights, points, and recommendations). No other headings or commentary.`,
      `Topic: ${data.topic || "the submitted material"}\n\nMaterial:\n${data.source || "(No source text provided — base the analysis on the topic itself.)"}`,
    );
    const grab = (from: string, to?: string) => {
      const start = text.toUpperCase().indexOf(from);
      if (start === -1) return "";
      const end = to ? text.toUpperCase().indexOf(to, start + from.length) : -1;
      return text.slice(start + from.length, end === -1 ? undefined : end).trim();
    };
    return {
      summary: grab("SUMMARY", "KEY INSIGHTS") || text,
      insights: grab("KEY INSIGHTS", "IMPORTANT POINTS"),
      points: grab("IMPORTANT POINTS", "RECOMMENDATIONS"),
      recommendations: grab("RECOMMENDATIONS"),
    };
  });

export const aiChat = createServerFn({ method: "POST" })
  .inputValidator(
    (data) =>
      z
        .object({
          question: z.string().min(1),
          history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).max(20),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured (missing API key).");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a professional workplace productivity assistant. Help with drafting emails, summarising documents, explaining concepts simply, planning tasks, and meeting preparation. Be specific and practical. Use short paragraphs, **bold** for key terms, and numbered or bulleted lists where helpful.",
          },
          ...data.history.slice(-10),
          { role: "user", content: data.question },
        ],
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message ?? `AI request failed (HTTP ${res.status}).`);
    }
    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? "";
  });
