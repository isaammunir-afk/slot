import { ViewTransition, type ReactNode } from "react";

/**
 * Wrap each page's content in this. When you navigate, React and the browser's
 * View Transitions API animate the old page out and the new one in:
 *  - "nav-forward" links slide the content left,
 *  - "nav-back" links slide it right,
 *  - everything else crossfades.
 * Browsers without support simply switch pages instantly, as before.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const kinds = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "nav-fade" };
  return (
    <ViewTransition enter={kinds} exit={kinds} default="none">
      {children}
    </ViewTransition>
  );
}
