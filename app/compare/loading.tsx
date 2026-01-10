export default function CompareLoading() {
    return (
        <div className="p-6 space-y-6">
            {/* Header skeleton */}
            <div className="h-10 bg-slate-200 rounded-lg w-64 animate-pulse" />

            {/* Comparison grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-4 border rounded-lg p-4">
                        <div className="h-8 bg-slate-200 rounded-lg animate-pulse" />
                        <div className="space-y-2">
                            {Array.from({ length: 8 }).map((_, j) => (
                                <div
                                    key={j}
                                    className="h-4 bg-slate-200 rounded-lg animate-pulse"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
