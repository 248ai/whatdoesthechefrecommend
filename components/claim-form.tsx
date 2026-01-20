"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ClaimFormProps {
  restaurantId: string;
  restaurantName: string;
}

export function ClaimForm({ restaurantId, restaurantName }: ClaimFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      restaurantId,
      ownerName: formData.get("ownerName") as string,
      ownerEmail: formData.get("ownerEmail") as string,
      ownerPhone: formData.get("ownerPhone") as string,
      role: formData.get("role") as string,
      verificationMethod: formData.get("verificationMethod") as string,
    };

    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to submit claim");
      }

      router.push("/claim/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-[var(--border)]">
        <h2 className="font-serif text-2xl text-[var(--charcoal)]">Claim {restaurantName}</h2>
        <p className="text-[var(--warm-gray)] mt-2">
          Once verified, you can add your chef&apos;s recommendation and get a verified badge on your profile.
        </p>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="ownerName" className="block text-sm font-medium text-[var(--charcoal)] mb-2">
              Your Name *
            </label>
            <input
              id="ownerName"
              name="ownerName"
              type="text"
              required
              placeholder="John Smith"
              className="w-full h-12 px-4 rounded-xl border-2 border-[var(--border)] bg-white text-[var(--charcoal)] focus:outline-none focus:border-[var(--terracotta)] transition-colors placeholder:text-[var(--warm-gray)]/50"
            />
          </div>

          <div>
            <label htmlFor="ownerEmail" className="block text-sm font-medium text-[var(--charcoal)] mb-2">
              Email Address *
            </label>
            <input
              id="ownerEmail"
              name="ownerEmail"
              type="email"
              required
              placeholder="john@restaurant.com"
              className="w-full h-12 px-4 rounded-xl border-2 border-[var(--border)] bg-white text-[var(--charcoal)] focus:outline-none focus:border-[var(--terracotta)] transition-colors placeholder:text-[var(--warm-gray)]/50"
            />
            <p className="text-xs text-[var(--warm-gray)] mt-1.5">
              Preferably an email at your restaurant&apos;s domain
            </p>
          </div>

          <div>
            <label htmlFor="ownerPhone" className="block text-sm font-medium text-[var(--charcoal)] mb-2">
              Phone Number *
            </label>
            <input
              id="ownerPhone"
              name="ownerPhone"
              type="tel"
              required
              placeholder="(555) 123-4567"
              className="w-full h-12 px-4 rounded-xl border-2 border-[var(--border)] bg-white text-[var(--charcoal)] focus:outline-none focus:border-[var(--terracotta)] transition-colors placeholder:text-[var(--warm-gray)]/50"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-[var(--charcoal)] mb-2">
              Your Role *
            </label>
            <select
              id="role"
              name="role"
              required
              className="w-full h-12 px-4 rounded-xl border-2 border-[var(--border)] bg-white text-[var(--charcoal)] focus:outline-none focus:border-[var(--terracotta)] transition-colors"
            >
              <option value="">Select your role</option>
              <option value="Owner">Owner</option>
              <option value="Manager">Manager</option>
              <option value="Chef">Head Chef</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="verificationMethod" className="block text-sm font-medium text-[var(--charcoal)] mb-2">
              How can we verify you? *
            </label>
            <textarea
              id="verificationMethod"
              name="verificationMethod"
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white text-[var(--charcoal)] focus:outline-none focus:border-[var(--terracotta)] transition-colors resize-none placeholder:text-[var(--warm-gray)]/50"
              placeholder="e.g., Call the restaurant and ask for me, check our website's about page, etc."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-full bg-[var(--terracotta)] text-white font-medium hover:bg-[var(--terracotta)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit claim"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
