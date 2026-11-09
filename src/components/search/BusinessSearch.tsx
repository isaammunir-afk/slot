"use client";

// "use client" means this component runs in the browser, because it reacts
// instantly to typing and tapping. The page around it still renders on the server.

import Link from "next/link";
import { useState, ViewTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Field";
import { ChevronRight, Search } from "@/components/ui/icons";
import { Pill } from "@/components/ui/Pill";
import { CATEGORIES, type Business, type Category } from "@/lib/fake-data";
import { FORWARD } from "@/lib/transitions";

export type SearchResult = Business & { nextAvailable: string | null };

type Filter = "All" | Category;

export function BusinessSearch({ businesses }: { businesses: SearchResult[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Filter>("All");

  const q = query.trim().toLowerCase();
  const results = businesses.filter((b) => {
    const matchesCategory = category === "All" || b.category === category;
    const matchesText = !q || `${b.name} ${b.category} ${b.area}`.toLowerCase().includes(q);
    return matchesCategory && matchesText;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <label htmlFor="search" className="sr-only">
          Search businesses
        </label>
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          id="search"
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder="Name, service or area"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12"
        />
      </div>

      <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {(["All", ...CATEGORIES] as Filter[]).map((c) => (
          <Chip key={c} selected={c === category} onClick={() => setCategory(c)}>
            {c}
          </Chip>
        ))}
      </div>

      <p className="text-sm text-muted" aria-live="polite">
        {results.length === 1 ? "1 business on Slot" : `${results.length} businesses on Slot`}
      </p>

      {results.length > 0 ? (
        <ul className="flex flex-col gap-2.5">
          {results.map((b) => (
            <li key={b.slug}>
              <Link
                href={`/b/${b.slug}`}
                transitionTypes={FORWARD}
                className="flex items-center gap-3 rounded-2xl bg-card px-3.5 py-3.5 ring-inset hover:ring-1 hover:ring-line-mid"
              >
                <ViewTransition name={`biz-avatar-${b.slug}`} share="morph" default="none">
                  <span
                    aria-hidden="true"
                    className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-white"
                  >
                    {b.initials}
                  </span>
                </ViewTransition>
                <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
                  <span className="text-base font-semibold leading-[22px]">{b.name}</span>
                  <span className="text-[13px] leading-[18px] text-muted">
                    {b.category} · {b.area}
                  </span>
                  <span className="mt-1">
                    {b.nextAvailable ? <Pill tone="open">Next: {b.nextAvailable}</Pill> : <Pill>Fully booked</Pill>}
                  </span>
                </span>
                <ChevronRight size={16} className="shrink-0 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<Search size={28} />}
          title="No businesses found"
          action={
            <Button
              size="md"
              variant="secondary"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Show all
            </Button>
          }
        >
          Try a different word, or pick another category.
        </EmptyState>
      )}
    </div>
  );
}
