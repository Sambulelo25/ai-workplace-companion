import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, BookOpenText, MessagesSquare, ArrowRight, Sparkle, Clock, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Work smarter, communicate better, and simplify information with three AI workplace tools: email drafting, research summaries, and a workplace chatbot.",
      },
      { property: "og:title", content: "Dashboard | AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Work smarter, communicate better, and simplify information with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email-generator",
    icon: Mail,
    title: "Smart Email Generator",
    description:
      "Draft polished workplace emails in seconds. Choose your audience and tone, then edit the result before sending.",
  },
  {
    to: "/research-assistant",
    icon: BookOpenText,
    title: "AI Research Assistant",
    description:
      "Turn long articles and reports into a clear summary, key insights, important points, and practical recommendations.",
  },
  {
    to: "/chatbot",
    icon: MessagesSquare,
    title: "AI Workplace Chatbot",
    description:
      "Ask questions, prepare for meetings, and get structured guidance from a professional workplace assistant.",
  },
] as const;

const stats = [
  { icon: Sparkle, label: "AI tools available", value: "3" },
  { icon: Clock, label: "Average draft time", value: "< 30s" },
  { icon: ListChecks, label: "Structured outputs", value: "4 sections" },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="fade-rise panel overflow-hidden">
        <div className="border-b bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
            Workplace productivity
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            AI Workplace Productivity Assistant
          </h1>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/70 sm:text-base">
            Work smarter, communicate better, and simplify information with AI.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="lg">
              <Link to="/email-generator">
                Start with an email <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/chatbot">Open the chatbot</Link>
            </Button>
          </div>
        </div>
        <dl className="grid gap-px bg-border sm:grid-cols-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-card px-6 py-5">
              <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="size-3.5" /> {label}
              </dt>
              <dd className="mt-1 text-xl font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Your tools</h2>
          <p className="text-sm text-muted-foreground">Pick a tool to get started.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tools.map(({ to, icon: Icon, title, description }) => (
            <article
              key={to}
              className="fade-rise panel flex flex-col p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-raised"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <Button asChild className="mt-5 w-full">
                <Link to={to}>
                  Open tool <ArrowRight className="size-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <ResponsibleAINotice />
    </div>
  );
}
