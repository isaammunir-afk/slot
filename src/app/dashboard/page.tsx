import type { Metadata } from "next";
import Link from "next/link";
import { Card, HeroCard } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Calendar, ChevronRight, List, Plus } from "@/components/ui/icons";
import { TabBar } from "@/components/ui/TabBar";
import { getSlots, week } from "@/lib/fake-data";
import { bookings, initials, owner, ownerBusiness } from "@/lib/fake-owner";

export const metadata: Metadata = { title: "Home" };

export default function OwnerHomePage() {
  const today = week[0];
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const todays = confirmed.filter((b) => b.date === today.date);
  const nextUp = todays[0];
  const openCount = week.reduce((sum, d) => sum + getSlots(ownerBusiness, d.date).length, 0);
  const comingUp = confirmed.filter((b) => b.id !== nextUp?.id).slice(0, 3);

  const quickActions = [
    { href: "/dashboard/times/new", label: "Add time", Icon: Plus, primary: true },
    { href: "/dashboard/bookings", label: "Bookings", Icon: List, primary: false },
    { href: "/dashboard/times", label: "Your times", Icon: Calendar, primary: false },
  ];

  return (
    <main className="mx-auto flex max-w-[560px] flex-col gap-4 px-4 pb-32 pt-6">
      <header className="flex items-center gap-3">
        <div className="flex flex-1 flex-col">
          <span className="text-sm text-muted">{today.long.replace("Today, ", "")}</span>
          <h1 className="text-[26px] font-semibold leading-[34px] tracking-tight">Good morning, {owner.firstName}</h1>
        </div>
        <Link
          href="/dashboard/settings"
          aria-label="Settings"
          className="flex size-11 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-white"
        >
          {ownerBusiness.initials}
        </Link>
      </header>

      <HeroCard className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-white/70">Today</h2>
          <span className="text-sm text-white/85">{todays.length === 1 ? "1 booking" : `${todays.length} bookings`}</span>
        </div>
        {nextUp ? (
          <div className="flex items-center gap-3.5">
            <div className="flex flex-1 flex-col">
              <span className="text-[13px] text-white/70">Next up</span>
              <span className="text-[28px] font-semibold leading-[34px] tracking-tight tabular-nums">{nextUp.start}</span>
              <span className="text-[15px] text-white/90">
                {nextUp.name} · {ownerBusiness.sessionMinutes} min
              </span>
            </div>
            <ButtonLink href={`/dashboard/bookings/${nextUp.id}`} size="md" variant="secondary" className="border-0">
              View
            </ButtonLink>
          </div>
        ) : (
          <p className="text-[15px] text-white/85">Nothing booked for today yet.</p>
        )}
      </HeroCard>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard/bookings" className="flex flex-col gap-1 rounded-2xl bg-card p-4 hover:ring-1 hover:ring-line-mid">
          <span className="text-[13px] text-muted">Booked this week</span>
          <span className="text-[28px] font-semibold leading-[34px]">{confirmed.length}</span>
        </Link>
        <Link href="/dashboard/times" className="flex flex-col gap-1 rounded-2xl bg-card p-4 hover:ring-1 hover:ring-line-mid">
          <span className="text-[13px] text-muted">Open times</span>
          <span className="text-[28px] font-semibold leading-[34px] text-accent">{openCount}</span>
        </Link>
      </div>

      <section aria-labelledby="qa-h" className="flex flex-col gap-2.5">
        <h2 id="qa-h" className="text-base font-semibold">
          Quick actions
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          {quickActions.map(({ href, label, Icon, primary }) => (
            <Link
              key={href}
              href={href}
              className="flex h-[84px] flex-col items-center justify-center gap-2 rounded-2xl bg-card text-[13px] font-medium hover:ring-1 hover:ring-line-mid"
            >
              <span className={`flex size-9 items-center justify-center rounded-full ${primary ? "bg-accent text-white" : "bg-canvas"}`}>
                <Icon size={18} />
              </span>
              {label}
            </Link>
          ))}
        </div>
      </section>

      <Card className="px-4 py-1.5">
        <div className="flex h-11 items-center justify-between">
          <h2 className="text-base font-semibold">Coming up</h2>
          <Link href="/dashboard/bookings" className="py-3 text-sm font-medium text-accent">
            See all
          </Link>
        </div>
        <ul>
          {comingUp.map((b) => (
            <li key={b.id} className="border-t border-line">
              <Link href={`/dashboard/bookings/${b.id}`} className="flex min-h-[60px] items-center gap-3">
                <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-full bg-canvas text-[13px] font-semibold">
                  {initials(b.name)}
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="text-[15px] font-semibold">{b.name}</span>
                  <span className="text-[13px] text-muted">
                    {week.find((d) => d.date === b.date)?.compact} · {b.start}
                  </span>
                </span>
                <ChevronRight size={18} className="text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <TabBar active="home" />
    </main>
  );
}
