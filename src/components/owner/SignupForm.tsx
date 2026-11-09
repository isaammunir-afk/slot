"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ActionFooter } from "@/components/booking/FlowHeader";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Check } from "@/components/ui/icons";
import { isEmail } from "@/lib/validation-lite";

type Errors = { name?: string; email?: string; password?: string };

export function SignupForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const longEnough = password.length >= 10;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "");
    const found: Errors = {
      name: name ? undefined : "Please enter your name.",
      email: !email.trim() ? "Please enter your email." : !isEmail(email) ? "That email looks incomplete." : undefined,
      password: longEnough ? undefined : "Use at least 10 characters.",
    };
    setErrors(found);
    const first = (["name", "email", "password"] as const).find((k) => found[k]);
    if (first) {
      document.getElementById(`su-${first}`)?.focus();
      return;
    }
    setLoading(true);
    // M1: pretend. M3: Supabase creates the account and emails a confirmation link.
    setTimeout(() => router.push("/onboarding"), 600);
  }

  return (
    <form id="signup" noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-[18px] rounded-[var(--radius-card)] bg-card px-4 py-5">
        <Field id="su-name" label="Your name" error={errors.name}>
          {(a11y) => <Input {...a11y} name="name" autoComplete="name" />}
        </Field>
        <Field id="su-email" label="Email" hint="We’ll send a link to confirm it’s you." error={errors.email}>
          {(a11y) => <Input {...a11y} name="email" type="email" inputMode="email" autoComplete="email" />}
        </Field>
        <Field
          id="su-password"
          label="Password"
          error={errors.password}
          hint={
            <span className={`flex items-center gap-1.5 ${longEnough ? "text-ink" : ""}`}>
              {longEnough && <Check size={14} className="text-accent" />}
              At least 10 characters
            </span>
          }
        >
          {(a11y) => (
            <Input
              {...a11y}
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </Field>
      </div>
      <p className="text-center text-sm text-muted">
        Already on Slot?{" "}
        <Link href="/login" className="font-semibold text-ink underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
      <ActionFooter>
        <Button type="submit" form="signup" loading={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </ActionFooter>
    </form>
  );
}
