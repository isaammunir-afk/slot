import type { Metadata } from "next";
import { BackButton } from "@/components/ui/BackButton";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, HeroCard } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Calendar } from "@/components/ui/icons";
import { Pill } from "@/components/ui/Pill";
import { StepProgress } from "@/components/ui/StepProgress";
import { TabBar } from "@/components/ui/TabBar";
import { Wordmark } from "@/components/ui/Wordmark";

// Temporary page (M1 only): every UI building block in one place, so we can check them
// on a phone. It is hidden from search engines and gets deleted before launch.
export const metadata: Metadata = { title: "Styleguide", robots: { index: false } };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <main className="mx-auto flex max-w-[560px] flex-col gap-8 px-4 pb-32 pt-6">
      <div className="flex items-center justify-between">
        <BackButton href="/" />
        <Wordmark size={24} />
      </div>
      <h1 className="text-[28px] font-semibold leading-9 tracking-tight">Styleguide</h1>

      <Section title="Buttons">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Yes, cancel booking</Button>
        <Button loading>Confirming…</Button>
        <Button disabled>Continue</Button>
        <div className="flex flex-wrap gap-2">
          <Button size="md">Small primary</Button>
          <Button size="md" variant="danger-outline">Cancel</Button>
          <ButtonLink href="/" size="md" variant="secondary">Link button</ButtonLink>
        </div>
      </Section>

      <Section title="Form fields">
        <Card className="flex flex-col gap-4">
          <Field id="sg-name" label="Full name">
            {(a11y) => <Input {...a11y} autoComplete="name" defaultValue="Alex Morgan" />}
          </Field>
          <Field id="sg-email" label="Email" hint="Only used to contact you about this booking.">
            {(a11y) => <Input {...a11y} type="email" placeholder="you@example.com" />}
          </Field>
          <Field id="sg-bad" label="Email" error="That email looks incomplete, e.g. name@example.com">
            {(a11y) => <Input {...a11y} type="email" defaultValue="alex@example" />}
          </Field>
          <Field id="sg-note" label="Note" optional>
            {(a11y) => <Textarea {...a11y} placeholder="Anything they should know?" />}
          </Field>
          <Field id="sg-cat" label="Category">
            {(a11y) => (
              <Select {...a11y} defaultValue="Tutoring">
                <option>Tutoring</option>
                <option>Hair</option>
                <option>Nails</option>
              </Select>
            )}
          </Field>
        </Card>
      </Section>

      <Section title="Chips">
        <div className="flex gap-2 overflow-x-auto">
          <Chip selected>All</Chip>
          <Chip selected={false}>Tutoring</Chip>
          <Chip selected={false}>Hair</Chip>
          <Chip selected={false}>Nails</Chip>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Chip shape="slot" selected={false}>09:00</Chip>
          <Chip shape="slot" selected>10:00</Chip>
          <Chip shape="slot" selected={false}>11:30</Chip>
        </div>
      </Section>

      <Section title="Pills">
        <div className="flex flex-wrap gap-2">
          <Pill tone="open">Open</Pill>
          <Pill tone="booked">Booked</Pill>
          <Pill tone="cancelled">Cancelled</Pill>
          <Pill>Fully booked</Pill>
        </div>
      </Section>

      <Section title="Cards">
        <HeroCard className="flex flex-col gap-1">
          <span className="text-[13px] text-white/70">Next available</span>
          <span className="text-[32px] font-semibold leading-10 tracking-tight tabular-nums">16:00</span>
          <span className="text-[15px] text-white/85">Monday 9 November · 60 min</span>
        </HeroCard>
        <Card>
          <p className="font-semibold">A plain card</p>
          <p className="text-sm text-muted">White on the grey canvas, 20px corners.</p>
        </Card>
      </Section>

      <Section title="Step progress">
        <StepProgress current={2} total={4} />
      </Section>

      <Section title="Empty state">
        <EmptyState
          icon={<Calendar size={28} />}
          title="No times on Saturday"
          action={<Button size="md" variant="secondary">See first available</Button>}
        >
          Try another day. New times are added regularly.
        </EmptyState>
      </Section>

      <TabBar active="home" />
    </main>
  );
}
