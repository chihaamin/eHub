export default function PlayerDetailLoading() {
    return (
        <div className="p-6 space-y-6">
            {/* Header skeleton */}
            <div className="space-y-4">
                <div className="h-8 bg-slate-200 rounded-lg w-64 animate-pulse" />
                <div className="h-4 bg-slate-200 rounded-lg w-48 animate-pulse" />
            </div>

            {/* Content skeleton */}
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-6 bg-slate-200 rounded-lg animate-pulse"
                    />
                ))}
            </div>

            {/* Stats section skeleton */}
            <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-20 bg-slate-200 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
}
