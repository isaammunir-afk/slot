// Shown instantly while a page is still loading (from M2, pages wait for the database).
// Grey shapes in roughly the same layout, so nothing jumps around when content arrives.
export default function Loading() {
  return (
    <main className="mx-auto flex max-w-[560px] flex-col gap-4 px-4 pt-6" aria-busy="true">
      <span className="sr-only" role="status">
        Loading…
      </span>
      <div aria-hidden="true" className="flex animate-pulse flex-col gap-4">
        <div className="size-11 rounded-full bg-line" />
        <div className="h-9 w-2/3 rounded-lg bg-line" />
        <div className="h-5 w-1/2 rounded-md bg-line" />
        <div className="h-40 rounded-[var(--radius-card)] bg-card" />
        <div className="h-24 rounded-[var(--radius-card)] bg-card" />
        <div className="h-24 rounded-[var(--radius-card)] bg-card" />
      </div>
    </main>
  );
}
