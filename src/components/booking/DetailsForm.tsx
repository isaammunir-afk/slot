"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { isEmail } from "@/lib/validation-lite";
import { saveDraft, useDraft, type Draft } from "./draft";
import { ActionFooter } from "./FlowHeader";
import { FORWARD } from "@/lib/transitions";

type Errors = Partial<Record<keyof Draft, string>>;

// Quick checks in the browser so people get instant feedback.
// IMPORTANT: these are for convenience only. In M2 the server checks everything
// again with Zod, because anyone can skip browser checks.
function check(d: Draft): Errors {
  const errors: Errors = {};
  if (!d.name.trim()) errors.name = "Please enter your name.";
  else if (d.name.trim().length > 80) errors.name = "Please keep your name under 80 characters.";
  if (!d.email.trim()) errors.email = "Please enter your email.";
  else if (!isEmail(d.email)) errors.email = "That email looks incomplete, e.g. name@example.com";
  if (d.note.length > 500) errors.note = "Please keep the note under 500 characters.";
  return errors;
}

export function DetailsForm({ slotId, reviewPath, ownerFirstName }: { slotId: string; reviewPath: string; ownerFirstName: string }) {
  const router = useRouter();
  const { ready, draft } = useDraft(slotId);
  const [errors, setErrors] = useState<Errors>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values: Draft = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      note: String(form.get("note") ?? ""),
    };
    const found = check(values);
    setErrors(found);
    const firstBad = (["name", "email", "note"] as const).find((k) => found[k]);
    if (firstBad) {
      document.getElementById(`d-${firstBad}`)?.focus();
      return;
    }
    saveDraft(slotId, { name: values.name.trim(), email: values.email.trim(), note: values.note.trim() });
    router.push(reviewPath, { transitionTypes: FORWARD });
  }

  // Wait for the browser so previously typed details (after pressing Edit) can be filled back in.
  if (!ready) return <div className="h-[380px] animate-pulse rounded-[var(--radius-card)] bg-card" aria-hidden="true" />;

  return (
    <form id="details" noValidate onSubmit={onSubmit} className="flex flex-col gap-[18px] rounded-[var(--radius-card)] bg-card px-4 py-5">
      <Field id="d-name" label="Full name" error={errors.name}>
        {(a11y) => <Input {...a11y} name="name" autoComplete="name" defaultValue={draft?.name} />}
      </Field>
      <Field id="d-email" label="Email" hint="Only used to contact you about this booking." error={errors.email}>
        {(a11y) => <Input {...a11y} name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" defaultValue={draft?.email} />}
      </Field>
      <Field id="d-note" label="Note" optional error={errors.note}>
        {(a11y) => <Textarea {...a11y} name="note" placeholder={`Anything ${ownerFirstName} should know?`} defaultValue={draft?.note} />}
      </Field>

      <ActionFooter>
        <Button type="submit" form="details">
          Continue
        </Button>
      </ActionFooter>
    </form>
  );
}
