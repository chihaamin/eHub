import Footer from "../components/footer";
import Navbar from "../components/navbar";

export default function Home() {
    return (
        <>
            <Navbar />

            {/* Main Content */}
            <main
                id="content"
                className="h-screen items-center flex flex-col justify-center"
            >
                {/* <!-- Hero / Primary Topic --> */}
                <section>
                    <h1>eFootball hub</h1>
                    <p>
                        Introductory paragraph clearly explaining what this page is about.
                    </p>
                </section>

                {/* <!-- Core Content --> */}
                <section>
                    <h2>Player Features</h2>
                    <article>
                        <h3>Subtopic or Item</h3>
                        <p>Descriptive, keyword-rich but natural content.</p>
                    </article>
                </section>

                {/* <!-- Supporting Content --> */}
                <section>
                    <h2>Additional Context</h2>
                    <ul>
                        <li>Relevant internal link</li>
                        <li>Another related entity</li>
                    </ul>
                </section>
            </main>

            {/* <!-- Footer --> */}
            <Footer />
        </>
    );
}
