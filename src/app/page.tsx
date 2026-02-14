import SearchBar from "@/components/SearchBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative mx-auto max-w-3xl px-6 py-16">
      {/* Image de fond — planète */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <Image
          src="/mars-bg.jpg"
          alt=""
          width={800}
          height={800}
          className="h-[600px] w-[600px] object-contain opacity-[0.07] dark:opacity-[0.12]"
          priority
        />
      </div>

      <div className="relative text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Athar <span className="font-light text-accent">IA</span>
        </h1>
        <p className="mt-2 font-arabic text-2xl text-muted" dir="rtl">
          أثر
        </p>
        <p className="mt-4 text-lg text-muted">
          La chaîne des mises en garde entre savants.
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted">
          Si tu n&apos;écoutes plus un savant parce qu&apos;un autre l&apos;a
          mis en garde, sache que ce même savant a aussi été mis en garde.
        </p>
      </div>

      <div className="relative mt-12">
        <SearchBar />
      </div>
    </div>
  );
}
