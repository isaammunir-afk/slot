import type { Metadata } from "next";
import { FlowHeader } from "@/components/booking/FlowHeader";
import { SignupForm } from "@/components/owner/SignupForm";

export const metadata: Metadata = { title: "List your business" };

export default function SignupPage() {
  return (
    <main className="mx-auto flex max-w-[560px] flex-col gap-5 px-4 pb-36 pt-5">
      <FlowHeader backHref="/" step={1} totalSteps={2} title="List your business" subtitle="Create your owner account. It’s free." />
      <SignupForm />
    </main>
  );
}
