import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="relative mx-auto max-w-4xl px-6 py-20 lg:py-32">
      <div className="relative text-center">
        {/* Main title with gradient text */}
        <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent dark:from-white dark:to-accent">
            La chaîne des mises en garde et critiques
          </span>
          <br />
          <span className="text-foreground">entre savants et étudiants</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted md:text-xl">
          Si tu n&apos;écoutes plus un savant ou un étudiant parce qu&apos;un autre l&apos;a
          mis en garde ou critiqué, sache que ce même savant ou étudiant a aussi été mis en garde ou critiqué.
        </p>
      </div>

      <div className="relative mt-16">
        <SearchBar />
      </div>
    </div>
  );
}
