import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Information",
};

export default function StaticLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
