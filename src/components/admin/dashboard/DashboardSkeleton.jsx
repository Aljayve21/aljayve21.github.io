
import Skeleton from "../../ui/Skeleton";

export default function DashboardSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading dashboard"
            className="space-y-6"
        >
            <span className="sr-only">
                Loading dashboard data...
            </span>

            {/* Statistics cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-3xl border border-white bg-white/90 p-5 shadow-lg shadow-pink-200/20"
                    >
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="mt-5 h-9 w-20" />
                        <Skeleton className="mt-4 h-3 w-36" />
                    </div>
                ))}
            </div>

            {/* Guest management skeleton */}
            <div className="rounded-[28px] border border-white bg-white/90 p-6 shadow-xl shadow-pink-200/30">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="mt-3 h-4 w-64 max-w-full" />

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Skeleton className="h-12 flex-1" />
                    <Skeleton className="h-12 w-full sm:w-40" />
                    <Skeleton className="h-12 w-full sm:w-40" />
                </div>

                <div className="mt-6 space-y-4">
                    {Array.from({ length: 5 }).map(
                        (_, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between gap-4 border-b border-pink-50 pb-4"
                            >
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-40 max-w-full" />
                                    <Skeleton className="h-3 w-24" />
                                </div>

                                <Skeleton className="h-8 w-24" />
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
