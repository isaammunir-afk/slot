import Link from "next/link";
import { Calendar, Home, List, Sliders } from "./icons";

export type OwnerTab = "home" | "bookings" | "times" | "settings";

const tabs = [
  { id: "home", label: "Home", href: "/dashboard", Icon: Home },
  { id: "bookings", label: "Bookings", href: "/dashboard/bookings", Icon: List },
  { id: "times", label: "Times", href: "/dashboard/times", Icon: Calendar },
  { id: "settings", label: "Settings", href: "/dashboard/settings", Icon: Sliders },
] as const;

/** Bottom navigation for the owner app. Fixed to the bottom of the screen on phones. */
export function TabBar({ active }: { active: OwnerTab }) {
  return (
    <nav
      aria-label="Owner menu"
      style={{ viewTransitionName: "tab-bar" }}
      className="fixed inset-x-0 bottom-0 border-t border-line bg-card pb-[max(env(safe-area-inset-bottom),12px)] pt-1.5"
    >
      <ul className="mx-auto grid max-w-[560px] grid-cols-4">
        {tabs.map(({ id, label, href, Icon }) => {
          const on = id === active;
          return (
            <li key={id}>
              <Link
                href={href}
                aria-current={on ? "page" : undefined}
                className={`flex h-14 flex-col items-center justify-center gap-1 text-xs ${on ? "font-semibold text-ink" : "font-medium text-muted"}`}
              >
                <span className={`flex h-7 w-14 items-center justify-center rounded-full ${on ? "bg-ink text-white" : ""}`}>
                  <Icon size={on ? 18 : 20} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
