import Link from "next/link";
import { Utensils, CheckCircle2 } from "lucide-react";

export default function ClaimSuccessPage() {
  return (
    <main className="min-h-screen bg-[var(--cream)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-[var(--charcoal)]">
            <Utensils className="h-6 w-6 text-[var(--terracotta)]" />
            <span className="font-semibold">Chef Recommends</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--sage)]/20 flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="h-10 w-10 text-[var(--sage)]" />
        </div>

        <h1 className="font-serif text-3xl text-[var(--charcoal)] mb-4">Request received</h1>

        <p className="text-[var(--warm-gray)] mb-8">
          We&apos;ll verify your ownership and email you within 2 business days.
        </p>

        <div className="bg-white border border-[var(--border)] rounded-2xl p-6 mb-8 text-left">
          <h2 className="font-semibold text-[var(--charcoal)] mb-4">What happens next?</h2>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] flex items-center justify-center font-medium shrink-0">1</span>
              <span className="text-[var(--warm-gray)]">We&apos;ll verify your ownership using the method you provided</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] flex items-center justify-center font-medium shrink-0">2</span>
              <span className="text-[var(--warm-gray)]">Once verified, you&apos;ll receive an email with a link to add your chef&apos;s recommendation</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] flex items-center justify-center font-medium shrink-0">3</span>
              <span className="text-[var(--warm-gray)]">Your profile will be marked as verified with a badge</span>
            </li>
          </ol>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[var(--terracotta)] text-white font-medium hover:bg-[var(--terracotta)]/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
