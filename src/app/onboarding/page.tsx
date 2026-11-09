import type { Metadata } from "next";
import { FlowHeader } from "@/components/booking/FlowHeader";
import { BusinessProfileForm } from "@/components/owner/BusinessProfileForm";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata: Metadata = { title: "Set up your page" };

export default function OnboardingPage() {
  return (
    <PageTransition>
      <main className="mx-auto flex max-w-[560px] flex-col gap-5 px-4 pb-36 pt-5">
        <FlowHeader backHref="/signup" step={2} totalSteps={2} title="Set up your page" subtitle="This is what customers see in search." />
        <BusinessProfileForm submitLabel="Create my page" doneHref="/dashboard" />
      </main>
    </PageTransition>
  );
}
