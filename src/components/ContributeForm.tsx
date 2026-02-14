"use client";

import { useState } from "react";

const SOURCE_TYPES = [
  { value: "texte", label: "Texte / Écrit" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Vidéo" },
  { value: "pdf", label: "PDF / Document" },
];

type FormStatus = "idle" | "sending" | "success" | "error";

interface ContributeFormProps {
  existingScholars: string[];
}

export default function ContributeForm({ existingScholars }: ContributeFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState({
    scholarFrom: "",
    scholarFromNew: "",
    scholarTo: "",
    scholarToNew: "",
    summary: "",
    sourceType: "texte",
    sourceTitle: "",
    sourceUrl: "",
    sourceDescription: "",
    submitterName: "",
    submitterContact: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const scholarFrom =
      formData.scholarFrom === "__new__"
        ? formData.scholarFromNew
        : formData.scholarFrom;
    const scholarTo =
      formData.scholarTo === "__new__"
        ? formData.scholarToNew
        : formData.scholarTo;

    const payload = {
      scholarFrom,
      scholarTo,
      summary: formData.summary,
      sourceType: formData.sourceType,
      sourceTitle: formData.sourceTitle,
      sourceUrl: formData.sourceUrl,
      sourceDescription: formData.sourceDescription,
      submitterName: formData.submitterName,
      submitterContact: formData.submitterContact,
      date: new Date().toISOString(),
    };

    try {
      const SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbyM87BifKYnGUpH-u5Vpjv_756tVm8N45EAJBMUPtvvrMnqe8WQvPoVupwqvOJ2QQL-Gw/exec";

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // no-cors always returns opaque response, so we assume success
      if (response.type === "opaque" || response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-8 text-center">
        <p className="text-2xl">✅</p>
        <h3 className="mt-3 text-lg font-semibold text-foreground">
          Merci pour votre contribution !
        </h3>
        <p className="mt-2 text-sm text-muted">
          Votre soumission a été envoyée. Elle sera vérifiée puis ajoutée au
          site.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setFormData({
              scholarFrom: "",
              scholarFromNew: "",
              scholarTo: "",
              scholarToNew: "",
              summary: "",
              sourceType: "texte",
              sourceTitle: "",
              sourceUrl: "",
              sourceDescription: "",
              submitterName: "",
              submitterContact: "",
            });
          }}
          className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-light"
        >
          Soumettre une autre contribution
        </button>
      </div>
    );
  }

  const inputClasses =
    "w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-primary-light focus:ring-2 focus:ring-primary-light/20";
  const labelClasses = "block text-sm font-medium text-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Savant qui met en garde */}
      <div>
        <label className={labelClasses}>
          Savant qui met en garde <span className="text-red-500">*</span>
        </label>
        <select
          name="scholarFrom"
          value={formData.scholarFrom}
          onChange={handleChange}
          required
          className={`${inputClasses} mt-1.5`}
        >
          <option value="">— Sélectionner un savant —</option>
          {existingScholars.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value="__new__">+ Ajouter un nouveau savant</option>
        </select>
        {formData.scholarFrom === "__new__" && (
          <input
            type="text"
            name="scholarFromNew"
            value={formData.scholarFromNew}
            onChange={handleChange}
            placeholder="Nom complet du savant"
            required
            className={`${inputClasses} mt-2`}
          />
        )}
      </div>

      {/* Savant mis en garde */}
      <div>
        <label className={labelClasses}>
          Savant mis en garde <span className="text-red-500">*</span>
        </label>
        <select
          name="scholarTo"
          value={formData.scholarTo}
          onChange={handleChange}
          required
          className={`${inputClasses} mt-1.5`}
        >
          <option value="">— Sélectionner un savant —</option>
          {existingScholars.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value="__new__">+ Ajouter un nouveau savant</option>
        </select>
        {formData.scholarTo === "__new__" && (
          <input
            type="text"
            name="scholarToNew"
            value={formData.scholarToNew}
            onChange={handleChange}
            placeholder="Nom complet du savant"
            required
            className={`${inputClasses} mt-2`}
          />
        )}
      </div>

      {/* Résumé */}
      <div>
        <label className={labelClasses}>
          Résumé de la mise en garde <span className="text-red-500">*</span>
        </label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          placeholder="Décrivez brièvement la nature de la mise en garde..."
          required
          rows={3}
          className={`${inputClasses} mt-1.5`}
        />
      </div>

      {/* Source */}
      <fieldset className="rounded-lg border border-border p-5">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Source / Preuve
        </legend>

        <div className="space-y-4">
          <div>
            <label className={labelClasses}>
              Type de source <span className="text-red-500">*</span>
            </label>
            <select
              name="sourceType"
              value={formData.sourceType}
              onChange={handleChange}
              required
              className={`${inputClasses} mt-1.5`}
            >
              {SOURCE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClasses}>
              Titre de la source <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sourceTitle"
              value={formData.sourceTitle}
              onChange={handleChange}
              placeholder="Ex: Réfutation dans Majmu al-Fatawa"
              required
              className={`${inputClasses} mt-1.5`}
            />
          </div>

          <div>
            <label className={labelClasses}>Lien (URL)</label>
            <input
              type="url"
              name="sourceUrl"
              value={formData.sourceUrl}
              onChange={handleChange}
              placeholder="https://..."
              className={`${inputClasses} mt-1.5`}
            />
            <p className="mt-1 text-xs text-muted">
              Lien YouTube, lien vers un PDF, page web, etc. (optionnel)
            </p>
          </div>

          <div>
            <label className={labelClasses}>Description de la source</label>
            <textarea
              name="sourceDescription"
              value={formData.sourceDescription}
              onChange={handleChange}
              placeholder="Contexte supplémentaire sur cette source..."
              rows={2}
              className={`${inputClasses} mt-1.5`}
            />
          </div>
        </div>
      </fieldset>

      {/* Informations du contributeur */}
      <fieldset className="rounded-lg border border-border p-5">
        <legend className="px-2 text-sm font-semibold text-foreground">
          Vos informations (optionnel)
        </legend>

        <div className="space-y-4">
          <div>
            <label className={labelClasses}>Votre nom / pseudo</label>
            <input
              type="text"
              name="submitterName"
              value={formData.submitterName}
              onChange={handleChange}
              placeholder="Votre nom ou pseudo"
              className={`${inputClasses} mt-1.5`}
            />
          </div>

          <div>
            <label className={labelClasses}>
              Contact (email ou Telegram)
            </label>
            <input
              type="text"
              name="submitterContact"
              value={formData.submitterContact}
              onChange={handleChange}
              placeholder="Pour vous recontacter si besoin"
              className={`${inputClasses} mt-1.5`}
            />
          </div>
        </div>
      </fieldset>

      {/* Bouton d'envoi */}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light disabled:opacity-50"
      >
        {status === "sending" ? "Envoi en cours..." : "Envoyer la contribution"}
      </button>

      {status === "error" && (
        <p className="text-center text-sm text-red-500">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}
    </form>
  );
}
