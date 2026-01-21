import Link from "next/link";
import { redirect } from "next/navigation";
import { ChefHat, ArrowLeft, LogOut, ExternalLink } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getClaimsByStatus } from "@/lib/claims";
import { ClaimActions } from "./claim-actions";

export default async function ClaimsPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const pendingClaims = await getClaimsByStatus("pending");

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-primary">
            <ChefHat className="h-6 w-6" />
            <span className="font-semibold">Admin Dashboard</span>
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <Button variant="ghost" size="sm" type="submit">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span>Pending Claims</span>
        </div>

        <h1 className="text-2xl font-bold mb-6">Pending Claims</h1>

        {pendingClaims.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No pending claims to review.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingClaims.map((claim) => {
              const restaurant = claim.restaurant;
              const citySlug = restaurant.city
                .toLowerCase()
                .replace(/\s+/g, "-");

              return (
                <Card key={claim.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Claim Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {restaurant.name}
                          </h3>
                          <Badge variant="outline">
                            {restaurant.city}, {restaurant.state}
                          </Badge>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 mt-4">
                          {/* Claimant Info */}
                          <div className="space-y-1.5">
                            <p className="text-sm font-medium">Claimant</p>
                            <p className="text-sm">
                              {claim.owner_name} ({claim.role})
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {claim.owner_email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {claim.owner_phone}
                            </p>
                          </div>

                          {/* Verification Method */}
                          <div className="space-y-1.5">
                            <p className="text-sm font-medium">Verification Method</p>
                            <p className="text-sm text-muted-foreground">
                              {claim.verification_method}
                            </p>
                          </div>
                        </div>

                        {/* Quick Links */}
                        <div className="flex gap-3 mt-4">
                          <Link
                            href={`/${citySlug}/${restaurant.slug}`}
                            target="_blank"
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            View Profile
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                          {restaurant.website && (
                            <a
                              href={
                                restaurant.website.startsWith("http")
                                  ? restaurant.website
                                  : `https://${restaurant.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                            >
                              Website
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {restaurant.phone && (
                            <a
                              href={`tel:${restaurant.phone}`}
                              className="text-sm text-primary hover:underline"
                            >
                              Call {restaurant.phone}
                            </a>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground mt-4">
                          Submitted{" "}
                          {new Date(claim.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <ClaimActions
                        claimId={claim.id}
                        restaurantId={claim.restaurant_id}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
