export default function Footer({
    props,
}: {
    props?: React.ComponentProps<"footer">;
}) {
    return (
        <footer {...props}>
            <nav
                aria-label="Footer navigation"
                className="flex gap-4 justify-center items-center"
            >
                <a href="/about">About</a>
                <a href="/privacy-policy">Privacy</a>
                <a href="/contact">Contact</a>
                <a href="/terms">Terms</a>
            </nav>
            <p>© 2026 eFootballHub</p>
        </footer>
    );
}
