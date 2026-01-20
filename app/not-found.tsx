import Link from "next/link";
import { Utensils } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-4">
      <div className="text-center">
        <Utensils className="h-16 w-16 text-[var(--terracotta)]/30 mx-auto mb-6" />
        <h1 className="font-serif text-4xl text-[var(--charcoal)] mb-3">Page Not Found</h1>
        <p className="text-[var(--warm-gray)] mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[var(--terracotta)] text-white font-medium hover:bg-[var(--terracotta)]/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
