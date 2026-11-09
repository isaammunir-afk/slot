"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { isEmail } from "@/lib/validation-lite";
import { FORWARD } from "@/lib/transitions";

export function LoginForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const found = {
      email: !email.trim() ? "Please enter your email." : !isEmail(email) ? "That email looks incomplete." : undefined,
      password: !password ? "Please enter your password." : undefined,
    };
    setErrors(found);
    if (found.email || found.password) {
      document.getElementById(found.email ? "li-email" : "li-pass")?.focus();
      return;
    }
    setLoading(true);
    // M1: pretend to sign in. M3: Supabase Auth checks the email and password.
    setTimeout(() => router.push("/dashboard", { transitionTypes: FORWARD }), 600);
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-1 flex-col gap-7">
      <div className="flex flex-col gap-[18px] rounded-[var(--radius-card)] bg-card px-4 py-5">
        <Field id="li-email" label="Email" error={errors.email}>
          {(a11y) => <Input {...a11y} name="email" type="email" autoComplete="username" inputMode="email" />}
        </Field>
        <Field id="li-pass" label="Password" error={errors.password}>
          {(a11y) => <Input {...a11y} name="password" type="password" autoComplete="current-password" />}
        </Field>
      </div>
      <div className="mt-auto flex flex-col gap-3">
        <Button type="submit" loading={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-center text-sm text-muted">
          New to Slot?{" "}
          <Link href="/signup" className="inline-block py-3 font-semibold text-ink underline-offset-2 hover:underline">
            List your business
          </Link>
        </p>
      </div>
    </form>
  );
}
