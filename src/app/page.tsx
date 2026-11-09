import { Wordmark } from "@/components/ui/Wordmark";

// Temporary home page for M1 step 2: shows the logo and design tokens.
// It gets replaced by the real welcome screen in a later step.
export default function Home() {
  const swatches = [
    { name: "Ink", className: "bg-ink" },
    { name: "Muted", className: "bg-muted" },
    { name: "Line", className: "bg-line" },
    { name: "Canvas", className: "bg-canvas" },
    { name: "Card", className: "bg-card" },
    { name: "Accent", className: "bg-accent" },
    { name: "Danger", className: "bg-danger" },
  ];

  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col gap-6 px-4 py-12">
      <Wordmark size={56} />
      <p className="text-base text-muted">Design tokens are in place. Screens come next.</p>

      <section className="rounded-[var(--radius-card)] bg-card p-5">
        <h1 className="text-[28px] font-semibold leading-9 tracking-tight">Choose a time</h1>
        <p className="mt-1 text-[15px] text-muted">Tuesday 10 November · London time</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button className="h-[52px] rounded-[var(--radius-control)] border border-line-mid bg-card text-[17px] font-medium">
            09:00
          </button>
          <button className="h-[52px] rounded-[var(--radius-control)] bg-accent text-[17px] font-semibold text-white">
            10:00
          </button>
          <button className="h-[52px] rounded-[var(--radius-control)] border border-line-mid bg-card text-[17px] font-medium">
            11:30
          </button>
        </div>
      </section>

      <ul className="grid grid-cols-4 gap-3 sm:grid-cols-7">
        {swatches.map((s) => (
          <li key={s.name} className="flex flex-col gap-1.5 text-xs text-muted">
            <span className={`h-12 rounded-xl border border-line ${s.className}`} />
            {s.name}
          </li>
        ))}
      </ul>

      <button className="h-14 rounded-[14px] bg-ink text-[17px] font-semibold text-white">Continue</button>
    </main>
  );
}
