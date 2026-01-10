export default function AdminPlayersNewLoading() {
    return (
        <div className="p-6 space-y-6">
            {/* Title skeleton */}
            <div className="h-10 bg-slate-200 rounded-lg w-64 animate-pulse" />

            {/* Form skeleton */}
            <div className="space-y-4 max-w-2xl">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded-lg w-32 animate-pulse" />
                        <div className="h-10 bg-slate-200 rounded-lg animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Button skeleton */}
            <div className="flex gap-3">
                <div className="h-10 bg-slate-200 rounded-lg w-24 animate-pulse" />
                <div className="h-10 bg-slate-200 rounded-lg w-24 animate-pulse" />
            </div>
        </div>
    );
}
