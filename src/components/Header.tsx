import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Athar</span>
          <span className="text-xl font-light text-accent">IA</span>
        </Link>
        <div className="flex items-center gap-4">
          <nav>
            <Link
              href="/a-propos"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              À propos
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
