import type { Metadata } from "next";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import BreadcrumbNav from "../components/breadcrumbs";

export const metadata: Metadata = {
    title: "Information",
};

export default function StaticLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>
        <Navbar />
        <div className="px-4 md:px-6">
            <BreadcrumbNav />
            {children}
        </div>
        <Footer />
    </>;
}
