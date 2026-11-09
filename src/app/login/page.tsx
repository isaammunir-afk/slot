import type { Metadata } from "next";
import { LoginForm } from "@/components/owner/LoginForm";
import { BackButton } from "@/components/ui/BackButton";
import { Wordmark } from "@/components/ui/Wordmark";

export const metadata: Metadata = { title: "Owner sign in" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col gap-7 px-4 pb-8 pt-5">
      <BackButton href="/" />
      <div className="flex flex-col gap-4">
        <Wordmark size={40} />
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-semibold leading-9 tracking-tight">Welcome back</h1>
          <p className="text-[15px] text-muted">Sign in to manage your times and bookings.</p>
        </div>
      </div>
      <LoginForm />
    </main>
  );
}
