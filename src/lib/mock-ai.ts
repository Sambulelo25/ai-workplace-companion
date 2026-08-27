/**
 * Frontend-only mock AI engine.
 * Produces structured, professional, context-aware text without any backend.
 */

export type Audience = "Client" | "Manager" | "Team";
export type Tone = "Formal" | "Informal" | "Persuasive";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 24);
}

function keywords(text: string, limit = 6): string[] {
  const stop = new Set(
    "the a an and or but if of to in on for with by is are was were be been this that these those it its as at from we our you your they their he she has have had will would can could should about more most than then them us".split(
      " ",
    ),
  );
  const counts = new Map<string, number>();
  for (const raw of text.toLowerCase().match(/[a-z][a-z-]{3,}/g) ?? []) {
    if (stop.has(raw)) continue;
    counts.set(raw, (counts.get(raw) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

const greeting: Record<Audience, string> = {
  Client: "Dear Valued Client,",
  Manager: "Hi [Manager's Name],",
  Team: "Hi Team,",
};

const signoff: Record<Audience, string> = {
  Client: "Kind regards,\n[Your Name]\n[Your Role] | [Company]",
  Manager: "Thanks,\n[Your Name]",
  Team: "Thanks,\n[Your Name]",
};

export async function generateEmail(input: {
  purpose: string;
  audience: Audience;
  tone: Tone;
  instructions: string;
}): Promise<string> {
  await wait(900);
  const { purpose, audience, tone, instructions } = input;
  const topic = purpose.trim() || "the matter discussed";
  const focus = keywords(purpose + " " + instructions, 3);

  const subject =
    tone === "Persuasive"
      ? `A clear next step on ${focus[0] ?? "our priority"}`
      : tone === "Informal"
        ? `Quick update: ${topic.slice(0, 48)}`
        : `Regarding ${topic.slice(0, 60)}`;

  const opener: Record<Tone, string> = {
    Formal: `I hope this message finds you well. I am writing to you regarding ${topic}.`,
    Informal: `Hope you're doing well! Just reaching out about ${topic}.`,
    Persuasive: `I wanted to share something I believe is worth your attention: ${topic}.`,
  };

  const body: Record<Tone, string> = {
    Formal: `To provide context, we have reviewed the relevant details and identified the key points that require your attention. ${
      focus.length ? `The main considerations relate to ${focus.join(", ")}.` : ""
    } Please find a concise summary of the current position below, along with the proposed next steps for your consideration.`,
    Informal: `Here's the short version: we've looked at where things stand and pulled out the parts that matter${
      focus.length ? `, mostly around ${focus.join(", ")}` : ""
    }. Nothing complicated — just wanted to keep you in the loop and agree on what happens next.`,
    Persuasive: `Acting on this now gives us a clear advantage: less rework later, faster turnaround, and a better outcome for everyone involved${
      focus.length ? `, particularly on ${focus.join(", ")}` : ""
    }. The effort required is modest, and the benefit is immediate and measurable.`,
  };

  const audienceLine: Record<Audience, string> = {
    Client: "Please let me know if you would like any further detail, and I will gladly provide it.",
    Manager: "Happy to walk you through the detail or adjust the approach if you'd prefer a different direction.",
    Team: "Shout if anything is unclear, or drop your thoughts in the thread so we can keep moving.",
  };

  const extra = instructions.trim()
    ? `\n\nAdditional notes:\n- ${instructions
        .split(/[\n;]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .join("\n- ")}`
    : "";

  const close: Record<Tone, string> = {
    Formal: "Thank you for your time and consideration.",
    Informal: "Thanks a lot!",
    Persuasive: "Could you confirm by end of week so we can get started?",
  };

  return [
    `Subject: ${subject}`,
    "",
    greeting[audience],
    "",
    opener[tone],
    "",
    body[tone],
    "",
    "Next steps:",
    "1. Review the points outlined above.",
    "2. Confirm whether the proposed approach works for you.",
    "3. Share any changes so we can update the plan.",
    audienceLine[audience] + extra,
    "",
    close[tone],
    "",
    signoff[audience],
  ].join("\n");
}

export type ResearchResult = {
  summary: string;
  insights: string;
  points: string;
  recommendations: string;
};

export async function generateResearch(input: {
  topic: string;
  source: string;
  mode: "standard" | "simplified";
}): Promise<ResearchResult> {
  await wait(1000);
  const topic = input.topic.trim() || "the submitted material";
  const src = input.source.trim();
  const sents = sentences(src);
  const keys = keywords(src + " " + topic, 6);
  const simple = input.mode === "simplified";

  const pick = (i: number) => sents[i % Math.max(sents.length, 1)] ?? "";

  const summary = simple
    ? `In plain language: this material is about ${topic}. ${
        sents.length
          ? `The main idea is that ${pick(0).toLowerCase()}`
          : "It sets out the background, what is currently happening, and what should happen next."
      } Put simply, it explains the situation, why it matters, and what someone should do about it. ${
        keys.length ? `The ideas that come up most often are ${keys.slice(0, 4).join(", ")}.` : ""
      }`
    : `This summary covers ${topic}. ${
        sents.length
          ? `${pick(0)} ${pick(1)}`
          : "The material outlines the current context, the factors influencing outcomes, and the decisions that follow from them."
      } Overall, the content establishes context, evidences the current position, and points toward a set of practical actions. ${
        keys.length ? `Recurring themes include ${keys.slice(0, 4).join(", ")}.` : ""
      }`;

  const insights = [
    `1. ${simple ? "The biggest thing to notice" : "Primary insight"}: ${
      keys[0] ? `${keys[0]} is central to how ${topic} plays out.` : `${topic} is driven mainly by context, timing, and ownership.`
    }`,
    `2. ${simple ? "What connects things" : "Secondary insight"}: ${
      keys[1] ? `${keys[1]} and ${keys[2] ?? "delivery"} are closely linked and should be handled together.` : "Several factors reinforce each other and should not be treated in isolation."
    }`,
    `3. ${simple ? "What could go wrong" : "Risk insight"}: gaps in detail or unclear ownership are the most likely cause of delay.`,
    `4. ${simple ? "The opportunity" : "Opportunity"}: small, early clarifications remove most of the downstream rework.`,
  ].join("\n");

  const points = (
    sents.length
      ? sents.slice(0, 5).map((s, i) => `• ${simple ? s.replace(/\s+/g, " ").slice(0, 180) : s}`)
      : [
          `• The scope of ${topic} is defined but needs confirmation from stakeholders.`,
          "• Timelines depend on a small number of critical inputs.",
          "• Responsibilities should be written down and agreed.",
          "• Progress should be reviewed at a fixed, regular checkpoint.",
        ]
  ).join("\n");

  const recommendations = [
    `1. Confirm the objective for ${topic} in one sentence and share it with everyone involved.`,
    "2. Assign a single owner for each action, with a date attached.",
    "3. Verify the underlying facts and figures against a trusted source before acting.",
    `4. ${simple ? "Keep updates short and regular" : "Establish a lightweight review cadence"} so issues surface early.`,
    "5. Document decisions as they are made to avoid repeated discussion.",
  ].join("\n");

  return { summary, insights, points, recommendations };
}

const chatReplies: { match: RegExp; reply: (q: string) => string }[] = [
  {
    match: /email|write|draft|reply/i,
    reply: () =>
      "Happy to help with that email. Here's a professional structure you can adapt:\n\n**Subject:** clear and specific (6–9 words)\n**Opening:** one line of context — why you're writing\n**Body:** the key information in 2–3 short sentences\n**Next steps:** a numbered list with owners and dates\n**Close:** a polite, direct call to action\n\nTell me the audience (client, manager, or team) and the tone you want, and I'll tailor the wording. You can also use the Smart Email Generator for a full draft.",
  },
  {
    match: /summar|report|document|article/i,
    reply: () =>
      "To summarise a report effectively, work through it in four passes:\n\n1. **Purpose** — what question does the document answer?\n2. **Evidence** — which facts, figures, or findings carry the argument?\n3. **Implications** — what changes as a result?\n4. **Actions** — what should be done, by whom, and when?\n\nPaste the text into the AI Research Assistant and I'll produce a summary, key insights, important points, and recommendations you can edit.",
  },
  {
    match: /explain|simpl|understand|what is/i,
    reply: () =>
      "Here's a simple way to think about it:\n\n• **The core idea** — strip the topic down to one sentence a newcomer would understand.\n• **Why it matters** — connect it to a real outcome, such as time, cost, or quality.\n• **How it works** — describe the steps in order, using everyday words.\n• **A quick example** — one concrete case makes the abstract stick.\n\nShare the specific text or concept and I'll rewrite it in plain language.",
  },
  {
    match: /recommend|advice|suggest|improve|task/i,
    reply: () =>
      "Recommendations for this task:\n\n1. **Define the outcome** — write down what \"done\" looks like before starting.\n2. **Sequence the work** — put the highest-risk or blocking item first.\n3. **Assign ownership** — one name per action, with a date.\n4. **Set a checkpoint** — a short review midway is worth more than a long one at the end.\n5. **Capture decisions** — a two-line note prevents the same debate twice.\n\nIf you share more detail about scope and deadline, I can prioritise these for you.",
  },
  {
    match: /meeting|prepare|agenda|presentation/i,
    reply: () =>
      "A solid meeting prep checklist:\n\n**Before**\n• State the single decision or outcome the meeting must produce.\n• Circulate a short agenda with time boxes.\n• Send any reading material in advance.\n\n**During**\n• Open with the objective, close with the actions.\n• Keep a visible list of decisions and owners.\n\n**After**\n• Send a five-line recap within the hour: decisions, actions, owners, dates, next meeting.\n\nWant me to draft an agenda for a specific meeting?",
  },
];

export async function generateChatReply(question: string): Promise<string> {
  await wait(800);
  const hit = chatReplies.find((r) => r.match.test(question));
  if (hit) return hit.reply(question);
  const keys = keywords(question, 3);
  return `Thanks — let's work through this in a structured way.\n\n**Context:** you're asking about ${
    keys.length ? keys.join(", ") : "this topic"
  }.\n\n**Suggested approach**\n1. Clarify the goal in one sentence so everyone is aligned.\n2. List what you already know and what's still missing.\n3. Tackle the missing pieces in order of impact.\n4. Agree on an owner and a date for each action.\n5. Review the outcome against the goal you set in step 1.\n\n**Next step:** share more detail — the audience, deadline, or the text you're working with — and I'll give you a more specific answer. For longer material, the AI Research Assistant will break it into a summary, insights, and recommendations.`;
}
