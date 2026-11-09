"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/icons";
import { useDraft } from "./draft";
import { ActionFooter } from "./FlowHeader";
import { BACK, FORWARD } from "@/lib/transitions";

type Row = { label: string; value: string; editHref?: string };

function Rows({ rows, label }: { rows: Row[]; label: string }) {
  return (
    <section aria-label={label} className="rounded-[var(--radius-card)] bg-card px-4 py-1">
      <dl>
        {rows.map((row) => (
          <div key={row.label} className="flex min-h-16 items-center gap-3 border-b border-line py-2 last:border-b-0">
            <div className="flex flex-1 flex-col gap-0.5">
              <dt className="text-[13px] text-muted">{row.label}</dt>
              <dd className="break-words text-base font-semibold">{row.value}</dd>
            </div>
            {row.editHref && (
              <Link href={row.editHref} transitionTypes={BACK} className="px-1 py-3 text-sm font-medium text-accent" aria-label={`Edit ${row.label.toLowerCase()}`}>
                Edit
              </Link>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ReviewSummary(props: {
  slotId: string;
  businessName: string;
  dayLong: string;
  timeLabel: string;
  dayPath: string;
  timePath: string;
  detailsPath: string;
  confirmedPath: string;
}) {
  const router = useRouter();
  const { ready, draft } = useDraft(props.slotId);
  const [submitting, setSubmitting] = useState(false);

  if (!ready) return <div className="h-[320px] animate-pulse rounded-[var(--radius-card)] bg-card" aria-hidden="true" />;

  if (!draft) {
    return (
      <EmptyState
        icon={<Alert size={28} />}
        title="We need your details first"
        action={<ButtonLink href={props.detailsPath} transitionTypes={BACK} size="md" variant="secondary">Add your details</ButtonLink>}
      >
        This can happen if the page was opened in a new tab.
      </EmptyState>
    );
  }

  function confirm() {
    setSubmitting(true);
    // M1: pretend to save. In M2 this calls a Server Action that books the slot in the
    // database (and fails gracefully if someone else got it first).
    setTimeout(() => router.push(props.confirmedPath, { transitionTypes: FORWARD }), 700);
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <Rows
          label="Session"
          rows={[
            { label: "Day", value: props.dayLong, editHref: props.dayPath },
            { label: "Time", value: props.timeLabel, editHref: props.timePath },
            { label: "With", value: props.businessName },
          ]}
        />
        <Rows
          label="Your details"
          rows={[
            { label: "Name", value: draft.name, editHref: props.detailsPath },
            { label: "Email", value: draft.email, editHref: props.detailsPath },
            ...(draft.note ? [{ label: "Note", value: draft.note, editHref: props.detailsPath }] : []),
          ]}
        />
      </div>
      <ActionFooter>
        <Button loading={submitting} onClick={confirm}>
          {submitting ? "Confirming…" : "Confirm booking"}
        </Button>
        <p className="text-center text-[13px] text-muted">No payment needed. Free to book.</p>
      </ActionFooter>
    </>
  );
}
