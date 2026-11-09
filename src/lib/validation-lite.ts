// Simple checks used by the M1 forms for instant feedback in the browser.
// They are NOT security: in M2/M3 the server re-checks everything with Zod.
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
