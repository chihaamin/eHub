import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { SearchCommand } from "../components/Search-components/search-form";

export default function Home() {
    return (
        <>
            <Navbar />

            {/* Main Content */}
            <main className="flex flex-col  h-lvh justify-center items-center px-4 md:px-6 gap-12">
                <h1 className="text-3xl font-bold">Search Page</h1>
                <SearchCommand />
            </main>

            {/* <!-- Footer --> */}
            <Footer />
        </>
    );
}
