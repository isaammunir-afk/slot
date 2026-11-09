// A short list for M1. In M2 we validate against the full list of IANA time zones.
export const TIMEZONES = [
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "America/New_York", label: "New York (ET)" },
  { value: "Asia/Karachi", label: "Karachi (PKT)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
] as const;
