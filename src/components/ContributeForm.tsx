"use client";

import { useState, useRef } from "react";

const SOURCE_TYPES = [
  { value: "texte", label: "Texte / Écrit" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Vidéo" },
  { value: "pdf", label: "PDF / Document" },
];

const FILE_ACCEPT: Record<string, string> = {
  audio: "audio/*",
  video: "video/*",
  pdf: ".pdf",
};

type FormStatus = "idle" | "sending" | "success" | "error";

interface SourceEntry {
  sourceType: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceDescription: string;
  file: File | null;
}

function createEmptySource(): SourceEntry {
  return {
    sourceType: "texte",
    sourceTitle: "",
    sourceUrl: "",
    sourceDescription: "",
    file: null,
  };
}

interface ContributeFormProps {
  existingScholars: string[];
}

export default function ContributeForm({ existingScholars }: ContributeFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRefs = useRef<Map<number, HTMLInputElement>>(new Map());
  const [sources, setSources] = useState<SourceEntry[]>([createEmptySource()]);
  const [formData, setFormData] = useState({
    scholarFrom: "",
    scholarFromNew: "",
    scholarTo: "",
    scholarToNew: "",
    summary: "",
    submitterName: "",
    submitterContact: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSourceChange = (
    index: number,
    field: keyof SourceEntry,
    value: string
  ) => {
    setSources((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      // Réinitialiser le fichier quand on change de type de source
      if (field === "sourceType") {
        updated[index].file = null;
        const ref = fileInputRefs.current.get(index);
        if (ref) ref.value = "";
      }
      return updated;
    });
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 50 * 1024 * 1024) {
      alert("Le fichier est trop volumineux (max 50 MB).");
      e.target.value = "";
      return;
    }

    setSources((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], file: selected };
      return updated;
    });
  };

  const addSource = () => {
    setSources((prev) => [...prev, createEmptySource()]);
  };

  const removeSource = (index: number) => {
    if (sources.length <= 1) return;
    setSources((prev) => prev.filter((_, i) => i !== index));
    fileInputRefs.current.delete(index);
  };

  const fileToBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });
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

    try {
      const SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbyM87BifKYnGUpH-u5Vpjv_756tVm8N45EAJBMUPtvvrMnqe8WQvPoVupwqvOJ2QQL-Gw/exec";

      // Envoyer chaque source comme une ligne séparée
      for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        setUploadProgress(`Envoi de la source ${i + 1}/${sources.length}...`);

        let fileData: string | undefined;
        let fileName: string | undefined;
        let fileMimeType: string | undefined;

        if (source.file) {
          setUploadProgress(`Préparation du fichier ${i + 1}/${sources.length}...`);
          fileData = await fileToBase64(source.file);
          fileName = source.file.name;
          fileMimeType = source.file.type;
          setUploadProgress(`Envoi du fichier ${i + 1}/${sources.length}...`);
        }

        const payload = {
          scholarFrom,
          scholarTo,
          summary: formData.summary,
          sourceType: source.sourceType,
          sourceTitle: source.sourceTitle,
          sourceUrl: source.sourceUrl,
          sourceDescription: source.sourceDescription,
          submitterName: formData.submitterName,
          submitterContact: formData.submitterContact,
          date: new Date().toISOString(),
          fileData,
          fileName,
          fileMimeType,
        };

        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.type !== "opaque" && !response.ok) {
          setStatus("error");
          return;
        }
      }

      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setUploadProgress("");
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
          Votre soumission a été envoyée. Elle sera visible sur le site
          dans quelques instants.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setSources([createEmptySource()]);
            fileInputRefs.current.clear();
            setFormData({
              scholarFrom: "",
              scholarFromNew: "",
              scholarTo: "",
              scholarToNew: "",
              summary: "",
              submitterName: "",
              submitterContact: "",
            });
          }}
          className="mt-6 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:opacity-80"
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
      {/* Savant/étudiant qui met en garde ou critique */}
      <div>
        <label className={labelClasses}>
          Savant/étudiant qui met en garde ou critique <span className="text-red-500">*</span>
        </label>
        <select
          name="scholarFrom"
          value={formData.scholarFrom}
          onChange={handleChange}
          required
          className={`${inputClasses} mt-1.5`}
        >
          <option value="">— Sélectionner un savant ou un étudiant —</option>
          {existingScholars.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value="__new__">+ Ajouter un nouveau savant ou étudiant</option>
        </select>
        {formData.scholarFrom === "__new__" && (
          <input
            type="text"
            name="scholarFromNew"
            value={formData.scholarFromNew}
            onChange={handleChange}
            placeholder="Nom complet du savant ou étudiant"
            required
            className={`${inputClasses} mt-2`}
          />
        )}
      </div>

      {/* Savant/étudiant mis en garde ou critiqué */}
      <div>
        <label className={labelClasses}>
          Savant/étudiant mis en garde ou critiqué <span className="text-red-500">*</span>
        </label>
        <select
          name="scholarTo"
          value={formData.scholarTo}
          onChange={handleChange}
          required
          className={`${inputClasses} mt-1.5`}
        >
          <option value="">— Sélectionner un savant ou un étudiant —</option>
          {existingScholars.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
          <option value="__new__">+ Ajouter un nouveau savant ou étudiant</option>
        </select>
        {formData.scholarTo === "__new__" && (
          <input
            type="text"
            name="scholarToNew"
            value={formData.scholarToNew}
            onChange={handleChange}
            placeholder="Nom complet du savant ou étudiant"
            required
            className={`${inputClasses} mt-2`}
          />
        )}
      </div>

      {/* Résumé */}
      <div>
        <label className={labelClasses}>
          Résumé de la mise en garde ou critique <span className="text-red-500">*</span>
        </label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          placeholder="Décrivez brièvement la nature de la mise en garde ou critique..."
          required
          rows={3}
          className={`${inputClasses} mt-1.5`}
        />
      </div>

      {/* Sources multiples */}
      {sources.map((source, index) => {
        const showFileUpload =
          source.sourceType === "audio" ||
          source.sourceType === "video" ||
          source.sourceType === "pdf";

        return (
          <fieldset
            key={index}
            className="relative rounded-lg border border-border p-5"
          >
            <legend className="px-2 text-sm font-semibold text-foreground">
              Source {sources.length > 1 ? `${index + 1}` : ""} / Preuve
            </legend>

            {sources.length > 1 && (
              <button
                type="button"
                onClick={() => removeSource(index)}
                className="absolute right-3 top-3 rounded-md px-2 py-1 text-xs text-red-500 transition-colors hover:bg-red-500/10"
              >
                Supprimer
              </button>
            )}

            <div className="space-y-4">
              <div>
                <label className={labelClasses}>
                  Type de source <span className="text-red-500">*</span>
                </label>
                <select
                  value={source.sourceType}
                  onChange={(e) =>
                    handleSourceChange(index, "sourceType", e.target.value)
                  }
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
                  value={source.sourceTitle}
                  onChange={(e) =>
                    handleSourceChange(index, "sourceTitle", e.target.value)
                  }
                  placeholder="Ex: Réfutation dans Majmu al-Fatawa"
                  required
                  className={`${inputClasses} mt-1.5`}
                />
              </div>

              {showFileUpload && (
                <div>
                  <label className={labelClasses}>Importer un fichier</label>
                  <input
                    ref={(el) => {
                      if (el) fileInputRefs.current.set(index, el);
                    }}
                    type="file"
                    accept={FILE_ACCEPT[source.sourceType] || "*/*"}
                    onChange={(e) => handleFileChange(index, e)}
                    className="mt-1.5 w-full text-sm text-foreground file:mr-4 file:rounded-lg file:border file:border-border file:bg-surface file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground file:transition-colors hover:file:bg-primary/10"
                  />
                  {source.file && (
                    <p className="mt-1.5 text-xs text-muted">
                      📎 {source.file.name} (
                      {(source.file.size / 1024 / 1024).toFixed(1)} MB)
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted">
                    Max 50 MB. Le fichier sera hébergé sur Google Drive.
                  </p>
                </div>
              )}

              <div>
                <label className={labelClasses}>
                  {showFileUpload ? "Ou coller un lien (URL)" : "Lien (URL)"}
                </label>
                <input
                  type="url"
                  value={source.sourceUrl}
                  onChange={(e) =>
                    handleSourceChange(index, "sourceUrl", e.target.value)
                  }
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
                  value={source.sourceDescription}
                  onChange={(e) =>
                    handleSourceChange(
                      index,
                      "sourceDescription",
                      e.target.value
                    )
                  }
                  placeholder="Contexte supplémentaire sur cette source..."
                  rows={2}
                  className={`${inputClasses} mt-1.5`}
                />
              </div>
            </div>
          </fieldset>
        );
      })}

      {/* Bouton ajouter une source */}
      <button
        type="button"
        onClick={addSource}
        className="w-full rounded-lg border border-dashed border-accent py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
      >
        + Ajouter une autre source
      </button>

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
        className="w-full rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-foreground dark:text-foreground transition-colors hover:opacity-80 disabled:opacity-50"
      >
        {status === "sending"
          ? uploadProgress || "Envoi en cours..."
          : "Envoyer la contribution"}
      </button>

      {status === "error" && (
        <p className="text-center text-sm text-red-500">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}
    </form>
  );
}
