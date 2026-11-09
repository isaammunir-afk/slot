"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ActionFooter } from "@/components/booking/FlowHeader";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { CATEGORIES } from "@/lib/fake-data";
import { slugify } from "@/lib/slug";
import { TIMEZONES } from "@/lib/timezones";

type Values = { name: string; category: string; area: string; description: string; timezone: string };
type Errors = Partial<Record<keyof Values, string>>;

/** Used both when a new owner sets up their page and later in Settings → Business profile. */
export function BusinessProfileForm({
  initial,
  submitLabel,
  doneHref,
}: {
  initial?: Partial<Values>;
  submitLabel: string;
  doneHref: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const slug = slugify(name);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const area = String(form.get("area") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const found: Errors = {
      name: !name.trim() ? "Please enter your business name." : name.trim().length > 60 ? "Keep it under 60 characters." : undefined,
      area: area ? undefined : "Please add your area, e.g. Camden, London.",
      description: description.length > 160 ? "Keep it under 160 characters." : undefined,
    };
    setErrors(found);
    const first = (["name", "area", "description"] as const).find((k) => found[k]);
    if (first) {
      document.getElementById(`bp-${first}`)?.focus();
      return;
    }
    setLoading(true);
    // M1: pretend to save. M3: a Server Action validates with Zod and saves to the database.
    setTimeout(() => router.push(doneHref), 600);
  }

  return (
    <form id="business" noValidate onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-card px-4 py-5">
        <Field id="bp-name" label="Business name" error={errors.name}>
          {(a11y) => <Input {...a11y} name="name" value={name} onChange={(e) => setName(e.target.value)} />}
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field id="bp-category" label="Category">
            {(a11y) => (
              <Select {...a11y} name="category" defaultValue={initial?.category ?? "Tutoring"}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
                <option>Other</option>
              </Select>
            )}
          </Field>
          <Field id="bp-area" label="Area" error={errors.area}>
            {(a11y) => <Input {...a11y} name="area" defaultValue={initial?.area} placeholder="e.g. Camden" className="min-w-0" />}
          </Field>
        </div>
        <Field id="bp-description" label="Short description" optional error={errors.description}>
          {(a11y) => (
            <Textarea {...a11y} name="description" rows={2} defaultValue={initial?.description} placeholder="What you offer, in one line" />
          )}
        </Field>
        <Field id="bp-timezone" label="Time zone" hint="All your times are shown in this zone.">
          {(a11y) => (
            <Select {...a11y} name="timezone" defaultValue={initial?.timezone ?? "Europe/London"}>
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <p className="rounded-2xl bg-accent-soft px-3.5 py-3 text-sm" aria-live="polite">
        Your link: <span className="font-semibold break-all">…/b/{slug || "your-business"}</span>
      </p>

      <ActionFooter>
        <Button type="submit" form="business" loading={loading}>
          {loading ? "Saving…" : submitLabel}
        </Button>
      </ActionFooter>
    </form>
  );
}
