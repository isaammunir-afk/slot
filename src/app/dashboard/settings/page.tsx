import type { Metadata } from "next";
import Link from "next/link";
import { CopyLinkButton, ListedSwitch, TimezoneSelect } from "@/components/owner/SettingsControls";
import { ChevronRight } from "@/components/ui/icons";
import { Pill } from "@/components/ui/Pill";
import { TabBar } from "@/components/ui/TabBar";
import { owner, ownerBusiness } from "@/lib/fake-owner";
import { PageTransition } from "@/components/ui/PageTransition";
import { BACK, FORWARD } from "@/lib/transitions";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  const b = ownerBusiness;
  return (
    <PageTransition>
      <main className="mx-auto flex max-w-[560px] flex-col gap-5 px-4 pb-32 pt-6">
        <h1 className="text-[28px] font-semibold leading-9 tracking-tight">Settings</h1>

        <section className="flex items-center gap-3.5 rounded-[var(--radius-card)] bg-card p-4">
          <div aria-hidden="true" className="flex size-[52px] items-center justify-center rounded-full bg-ink text-lg font-semibold text-white">
            {b.initials}
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-semibold">{b.name}</span>
            <span className="text-sm text-muted">{owner.email}</span>
          </div>
        </section>

        <section aria-labelledby="biz-h" className="flex flex-col gap-2">
          <h2 id="biz-h" className="ml-1 text-[13px] font-semibold text-muted">
            Business
          </h2>
          <ul className="rounded-2xl bg-card px-4">
            <li className="border-b border-line">
              <Link href="/dashboard/settings/profile" transitionTypes={FORWARD} className="flex min-h-14 items-center gap-3 py-2">
                <span className="flex flex-1 flex-col">
                  <span className="text-[15px] font-medium">Business profile</span>
                  <span className="text-[13px] text-muted">Name, category, area, description</span>
                </span>
                <ChevronRight size={16} className="text-muted" />
              </Link>
            </li>
            <li className="border-b border-line">
              <ListedSwitch />
            </li>
            <li className="border-b border-line">
              <TimezoneSelect defaultValue="Europe/London" />
            </li>
            <li>
              <CopyLinkButton path={`/b/${b.slug}`} />
            </li>
          </ul>
          <p className="mx-1 text-[13px] leading-[18px] text-muted">
            Changing the time zone changes how every time is shown, for you and your customers.
          </p>
        </section>

        <section aria-labelledby="acc-h" className="flex flex-col gap-2">
          <h2 id="acc-h" className="ml-1 text-[13px] font-semibold text-muted">
            Account
          </h2>
          <ul className="rounded-2xl bg-card px-4">
            <li className="flex min-h-14 items-center gap-3 border-b border-line">
              <span className="flex-1 text-[15px] font-medium text-muted">Change password</span>
              <Pill>Coming soon</Pill>
            </li>
            <li>
              <Link href="/" transitionTypes={BACK} className="flex min-h-14 items-center text-[15px] font-semibold text-danger">
                Sign out
              </Link>
            </li>
          </ul>
        </section>

        <TabBar active="settings" />
      </main>
    </PageTransition>
  );
}
