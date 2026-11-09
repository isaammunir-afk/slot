import type { Metadata } from "next";
import Link from "next/link";
import { BusinessSearch } from "@/components/search/BusinessSearch";
import { Wordmark } from "@/components/ui/Wordmark";
import { businesses, nextAvailableLabel } from "@/lib/fake-data";
import { PageTransition } from "@/components/ui/PageTransition";
import { BACK } from "@/lib/transitions";

export const metadata: Metadata = { title: "Find a business" };

export default function SearchPage() {
  return (
    <PageTransition>
      <main className="mx-auto flex max-w-[560px] flex-col gap-4 px-4 pb-10 pt-5">
        <Link href="/" transitionTypes={BACK} aria-label="Slot home" className="flex h-11 w-fit items-center">
          <Wordmark size={24} />
        </Link>
        <h1 className="text-[28px] font-semibold leading-9 tracking-tight">Find a business</h1>
        <BusinessSearch businesses={businesses.map((b) => ({ ...b, nextAvailable: nextAvailableLabel(b) }))} />
      </main>
    </PageTransition>
  );
}
