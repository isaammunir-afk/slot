import type { ReactNode } from "react";
import { BackButton } from "@/components/ui/BackButton";
import { StepProgress } from "@/components/ui/StepProgress";

/** Top of every booking step: back button, "Step x of 4" bar, title and subtitle. */
export function FlowHeader({
  backHref,
  step,
  title,
  subtitle,
}: {
  backHref: string;
  step?: number;
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5">
      <BackButton href={backHref} />
      {step && <StepProgress current={step} total={4} />}
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-semibold leading-9 tracking-tight">{title}</h1>
        {subtitle && <p className="text-[15px] leading-[22px] text-muted">{subtitle}</p>}
      </div>
    </header>
  );
}

/** The white bar fixed to the bottom of the screen that holds the main action. */
export function ActionFooter({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 border-t border-line bg-card px-4 pb-[max(env(safe-area-inset-bottom),20px)] pt-4">
      <div className="mx-auto flex max-w-[528px] flex-col gap-2.5">{children}</div>
    </div>
  );
}
