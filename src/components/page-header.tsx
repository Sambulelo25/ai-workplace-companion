import type { LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="fade-rise flex items-start gap-4">
      {Icon && (
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Icon className="size-5" />
        </div>
      )}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
