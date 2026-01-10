import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn more about EFHub and our mission",
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}