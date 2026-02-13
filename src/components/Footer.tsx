export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-3xl px-6 py-6 text-center text-sm text-muted">
        <p>
          Athar IA — Chaîne des mises en garde entre savants
        </p>
        <p className="mt-1">
          <a
            href="https://github.com/kambot/athar-ia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-light transition-colors hover:text-primary"
          >
            GitHub
          </a>
          {" · "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
