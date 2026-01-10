import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Compare Players",
    description: "Compare side-by-side statistics of multiple players",
};

export default function CompareLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
