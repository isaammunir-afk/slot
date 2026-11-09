import type { ReactNode } from "react";

/** Friendly message for "nothing here yet" or "something went wrong", with an optional action. */
export function EmptyState({
  icon,
  title,
  children,
  action,
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-card px-5 py-8 text-center">
      <div className="text-muted">{icon}</div>
      <p className="mt-1 text-base font-semibold">{title}</p>
      {children && <p className="text-sm leading-5 text-muted">{children}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
