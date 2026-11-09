/** "Step 2 of 4" label plus a segmented bar. */
export function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-muted">
        Step {current} of {total}
      </p>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }} aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className={`h-1 rounded-full ${i < current ? "bg-accent" : "bg-line"}`} />
        ))}
      </div>
    </div>
  );
}
