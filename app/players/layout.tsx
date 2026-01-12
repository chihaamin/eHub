import type { Metadata } from "next";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

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
        {children}

        {/* <!-- Footer --> */}
        <Footer />
    </>;
}
