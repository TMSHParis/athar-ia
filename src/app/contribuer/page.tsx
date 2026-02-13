import type { Metadata } from "next";
import ContributeForm from "@/components/ContributeForm";

export const metadata: Metadata = {
  title: "Contribuer",
  description:
    "Ajoutez un savant ou une mise en garde avec ses sources pour enrichir Athar IA.",
};

export default function ContribuerPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-foreground">Contribuer</h1>
      <p className="mt-3 text-base text-muted">
        Aidez-nous à enrichir la base de données. Remplissez le formulaire
        ci-dessous pour soumettre une mise en garde entre savants avec ses
        sources. Votre soumission sera vérifiée avant d&apos;être ajoutée.
      </p>

      <div className="mt-8">
        <ContributeForm />
      </div>
    </div>
  );
}
