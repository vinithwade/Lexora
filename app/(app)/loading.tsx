import { PageContainer } from "@/components/AppShell";
import { Skeleton } from "@/components/ui/Skeleton";

// Generic loading skeleton shown the instant any (app) route is clicked.
// Next.js renders this immediately while the new page's server component
// fetches its data, so navigation feels instant even on slow networks.
export default function AppLoading() {
  return (
    <PageContainer>
      <div className="flex items-end justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>

      <Skeleton className="h-64 rounded-xl" />
    </PageContainer>
  );
}
