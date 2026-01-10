import Link from "next/link";

export default function AdminNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center space-y-6">
                <h1 className="text-6xl font-bold text-gray-900">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800">
                    Admin Page Not Found
                </h2>
                <p className="text-xl text-gray-600 max-w-md">
                    The admin resource you&apos;re looking for doesn&apos;t exist.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/admin"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Back to Admin
                    </Link>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
