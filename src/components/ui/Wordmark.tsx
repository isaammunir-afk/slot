type WordmarkProps = {
  /** Font size in pixels. */
  size?: number;
  /** "dark" = black text for light backgrounds, "light" = white text for dark ones. */
  tone?: "dark" | "light";
  className?: string;
};

/** The Slot logo: the word "Slot" in heavy type, with a square full stop in the accent colour (see .wm-dot). */
export function Wordmark({ size = 24, tone = "dark", className = "" }: WordmarkProps) {
  return (
    <span
      role="img"
      aria-label="Slot"
      className={`inline-block font-extrabold leading-none tracking-[-0.06em] ${
        tone === "light" ? "text-white" : "text-ink"
      } ${className}`}
      style={{ fontSize: size }}
    >
      Slot
      <span aria-hidden="true" className={`wm-dot ${tone === "light" ? "text-accent-on-dark" : "text-accent"}`} />
    </span>
  );
}
