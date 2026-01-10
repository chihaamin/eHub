export default function PlayersLoading() {
    return (
        <div className="p-6">
            <div className="space-y-4">
                {/* Header skeleton */}
                <div className="h-10 bg-slate-200 rounded-lg w-48 animate-pulse" />

                {/* Player list skeleton */}
                <div className="space-y-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-12 bg-slate-200 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
