export default function AdminPlayersLoading() {
    return (
        <div className="p-6 space-y-6">
            {/* Toolbar skeleton */}
            <div className="flex gap-3">
                <div className="h-10 bg-slate-200 rounded-lg w-32 animate-pulse" />
                <div className="h-10 bg-slate-200 rounded-lg w-32 animate-pulse" />
            </div>

            {/* Table skeleton */}
            <div className="space-y-3">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-12 bg-slate-200 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        </div>
    );
}
