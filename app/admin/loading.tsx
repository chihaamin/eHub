export default function AdminLoading() {
    return (
        <div className="p-6 space-y-6">
            {/* Sidebar skeleton */}
            <div className="flex gap-6">
                <div className="w-48 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-10 bg-slate-200 rounded-lg animate-pulse"
                        />
                    ))}
                </div>

                {/* Main content skeleton */}
                <div className="flex-1 space-y-4">
                    <div className="h-10 bg-slate-200 rounded-lg w-48 animate-pulse" />
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
        </div>
    );
}
