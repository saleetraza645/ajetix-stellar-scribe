/** Shared tech-stack pill styling for home + services pages. */
export function TechStackPills({ items }: { items: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((t) => (
        <span
          key={t}
          className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-medium leading-none text-foreground/90 whitespace-nowrap"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
