import type { Metadata } from "next";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import BreadcrumbNav from "../components/breadcrumbs";

export const metadata: Metadata = {
    title: "Players",
    description: "Browse all elite football players",
};

export default function PlayersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>
        <Navbar />

        {/* Main Content */}
        <div className="px-4 md:px-6">
            <BreadcrumbNav />
            {children}
        </div>

        {/* <!-- Footer --> */}
        <Footer />
    </>;
}
