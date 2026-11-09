import type { Metadata } from "next";
import { FlowHeader } from "@/components/booking/FlowHeader";
import { BusinessProfileForm } from "@/components/owner/BusinessProfileForm";
import { ownerBusiness } from "@/lib/fake-owner";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata: Metadata = { title: "Business profile" };

export default function ProfilePage() {
  const b = ownerBusiness;
  return (
    <PageTransition>
      <main className="mx-auto flex max-w-[560px] flex-col gap-5 px-4 pb-36 pt-5">
        <FlowHeader backHref="/dashboard/settings" title="Business profile" subtitle="This is what customers see in search." />
        <BusinessProfileForm
          submitLabel="Save changes"
          doneHref="/dashboard/settings"
            doneDirection="back"
          initial={{ name: b.name, category: b.category, area: `${b.area}, London`, description: b.description, timezone: "Europe/London" }}
        />
      </main>
    </PageTransition>
  );
}
