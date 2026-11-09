// Outside-in security check: talks to the real Supabase API with ONLY the public
// (publishable) key, exactly like a stranger who copied it from the website would.
// Run: npm run check:security   (reads NEXT_PUBLIC_* values from .env.local)
// It never creates data: the one booking attempt uses an invalid email on purpose.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local");
  process.exit(1);
}
const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
const api = (path, init = {}) => fetch(`${url}/rest/v1/${path}`, { ...init, headers: { ...headers, ...init.headers } });

const checks = [
  ["Stranger cannot read bookings", async () => {
    const r = await api("bookings?select=customer_name,customer_email");
    return !r.ok ? "PASS" : `FAIL: got ${(await r.json()).length} bookings`;
  }],
  ["Stranger cannot add a booking directly", async () => {
    const r = await api("bookings", { method: "POST", body: JSON.stringify({ customer_name: "x", customer_email: "x@example.com" }) });
    return !r.ok ? "PASS" : "FAIL: insert accepted";
  }],
  ["Stranger can list business profiles", async () => {
    const r = await api("businesses?select=name,city,country_code");
    const rows = r.ok ? await r.json() : [];
    return rows.length ? `PASS (${rows.length} businesses)` : `FAIL: status ${r.status}`;
  }],
  ["Stranger cannot see business owners' account ids", async () => {
    const r = await api("businesses?select=owner_id");
    return !r.ok ? "PASS" : "FAIL: owner_id readable";
  }],
  ["Stranger only sees open times", async () => {
    const r = await api("slots?select=id&status=neq.open");
    const rows = r.ok ? await r.json() : null;
    return rows && rows.length === 0 ? "PASS" : `FAIL: ${rows ? rows.length + " booked times visible" : "status " + r.status}`;
  }],
  ["Stranger cannot change a time", async () => {
    const r = await api("slots?status=eq.booked", { method: "PATCH", body: JSON.stringify({ status: "open" }), headers: { Prefer: "return=representation" } });
    const rows = r.ok ? await r.json() : null;
    return !r.ok || rows.length === 0 ? "PASS" : `FAIL: changed ${rows.length}`;
  }],
  ["book_slot() refuses a bad email (nothing is saved)", async () => {
    const slots = await (await api("slots?select=id&limit=1")).json();
    const r = await api("rpc/book_slot", { method: "POST", body: JSON.stringify({ p_slot_id: slots[0]?.id, p_name: "Test", p_email: "not-an-email" }) });
    const body = await r.json();
    return !r.ok && body.message === "invalid_email" ? "PASS" : `FAIL: ${r.status} ${JSON.stringify(body)}`;
  }],
];

let failed = 0;
for (const [name, run] of checks) {
  let result;
  try { result = await run(); } catch (e) { result = `FAIL: ${e.message}`; }
  if (!result.startsWith("PASS")) failed++;
  console.log(`${result.startsWith("PASS") ? "✔" : "✘"} ${name}: ${result}`);
}
console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
