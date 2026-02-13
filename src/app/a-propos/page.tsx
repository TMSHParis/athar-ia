import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez l'objectif d'Athar IA et pourquoi ce projet existe.",
};

export default function AProposPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground">À propos</h1>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground/80">
        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Qu&apos;est-ce qu&apos;Athar IA ?
          </h2>
          <p className="mt-2">
            Athar IA est un outil qui met en lumière les chaînes de mises en
            garde entre savants musulmans sunnites. Le mot « athar » (أثر)
            signifie « trace » ou « impact » en arabe.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Pourquoi ce projet ?
          </h2>
          <p className="mt-2">
            Dans notre époque, certains musulmans cessent d&apos;écouter un
            savant dès qu&apos;un autre savant émet une mise en garde contre
            lui. Pourtant, ce même savant qui a émis la mise en garde a
            lui-même été mis en garde par d&apos;autres savants.
          </p>
          <p className="mt-2">
            L&apos;objectif n&apos;est pas de dénigrer les savants — qui
            restent tous des imams de la Sounnah — mais de montrer que les
            mises en garde mutuelles font partie de la tradition savante et ne
            doivent pas conduire au rejet systématique.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Comment ça fonctionne ?
          </h2>
          <p className="mt-2">
            Tapez le nom d&apos;un savant dans la barre de recherche. Vous
            verrez sa fiche avec deux sections : les savants qui l&apos;ont mis
            en garde, et ceux contre lesquels il a mis en garde. Chaque mise en
            garde est accompagnée de ses sources.
          </p>
          <p className="mt-2">
            Cliquez sur le nom d&apos;un savant dans les mises en garde pour
            naviguer vers sa propre fiche et découvrir la chaîne complète.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">
            Contribuer
          </h2>
          <p className="mt-2">
            Ce projet est open source. Si vous souhaitez ajouter des savants,
            corriger des informations ou améliorer l&apos;outil, rendez-vous
            sur{" "}
            <a
              href="https://github.com/kambot/athar-ia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-light underline transition-colors hover:text-primary"
            >
              GitHub
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
