import SearchBar from "@/components/SearchBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative mx-auto max-w-3xl px-6 py-16">
      {/* Image de fond — planète */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <Image
          src="/mars-bg.png"
          alt=""
          width={1024}
          height={1024}
          className="h-[600px] w-[600px] object-contain opacity-[0.07] dark:opacity-[0.15]"
          priority
        />
      </div>

      <div className="relative text-center">
        <p className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
          La chaîne des mises en garde et critiques entre savants et étudiants.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted md:text-lg">
          Si tu n&apos;écoutes plus un savant ou un étudiant parce qu&apos;un autre l&apos;a
          mis en garde ou critiqué, sache que ce même savant ou étudiant a aussi été mis en garde ou critiqué.
        </p>
      </div>

      <div className="relative mt-12">
        <SearchBar />
      </div>
    </div>
  );
}
