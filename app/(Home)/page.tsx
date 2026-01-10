

export default function Home() {
    return (
        <>
            <header>
                <nav
                    aria-label="Primary navigation"
                    className="flex gap-2 justify-between p-4"
                >
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a href="/">Brand</a>
                    <ul className="flex gap-2 justify-evenly w-1/2 ">
                        <li>
                            <a href="/players">Players</a>
                        </li>
                        <li>
                            <a href="/compare">Compare</a>
                        </li>
                        <li>
                            <a href="/players/1">Search</a>
                        </li>
                    </ul>
                    <span> Dark-mode</span>
                </nav>
            </header>

            {/* Main Content */}
            <main id="content" className="h-screen">
                {/* <!-- Hero / Primary Topic --> */}
                <section>
                    <h1>Main Page Topic (Primary Keyword)</h1>
                    <p>
                        Introductory paragraph clearly explaining what this page is about.
                    </p>
                </section>

                {/* <!-- Core Content --> */}
                <section>
                    <h2>Secondary Keyword / Feature Section</h2>
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
            <footer className="flex items-center flex-col">
                <nav aria-label="Footer navigation" className="flex gap-4 justify-center items-center">
                    <a href="/about">About</a>
                    <a href="/privacy-policy">Privacy</a>
                    <a href="/contact">Contact</a>
                    <a href="/terms">Terms</a>
                </nav>
                <p>© 2026 Brand Name</p>
            </footer>
        </>
    );
}
