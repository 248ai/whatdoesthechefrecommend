"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClaimActionsProps {
  claimId: string;
  restaurantId: string;
}

export function ClaimActions({ claimId, restaurantId }: ClaimActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const handleAction = async (action: "approve" | "reject") => {
    setIsLoading(action);

    try {
      const res = await fetch(`/api/admin/claims/${claimId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          restaurantId,
          notes,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update claim");
      }

      router.refresh();
    } catch (error) {
      console.error("Action failed:", error);
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 lg:items-end shrink-0">
      {showNotes ? (
        <div className="space-y-2 w-full lg:w-64">
          <textarea
            placeholder="Verification notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-background text-sm resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleAction("approve")}
              disabled={isLoading !== null}
              className="flex-1"
            >
              {isLoading === "approve" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleAction("reject")}
              disabled={isLoading !== null}
              className="flex-1"
            >
              {isLoading === "reject" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </>
              )}
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowNotes(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setShowNotes(true)}
            disabled={isLoading !== null}
          >
            <Check className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNotes(true)}
            disabled={isLoading !== null}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}
