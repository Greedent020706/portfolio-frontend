import { useId, useState, type FormEvent } from "react";
import { sendContact, type ContactResult } from "../lib/api";

type Status = "idle" | "sending" | ContactResult;

const statusText: Record<ContactResult, string> = {
  ok: "Mensaje enviado. Te responderé pronto.",
  invalid: "Revisa los campos: el correo debe ser válido y ninguno puede quedar vacío.",
  throttled: "Has enviado varios mensajes seguidos. Inténtalo más tarde.",
  error: "No se pudo enviar. Inténtalo de nuevo en unos minutos.",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 " +
  "text-sm text-white placeholder-slate-500 transition-all " +
  "focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400";

const labelClass = "text-sm font-medium text-slate-200";

export function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Guardar el formulario ANTES del await: después, React ya no garantiza
    // que event.currentTarget siga disponible.
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    const result = await sendContact({
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? ""),
    });
    setStatus(result);
    if (result === "ok") form.reset();
  }

  const sending = status === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card mx-auto mt-8 w-full max-w-xl rounded-2xl p-6 text-left sm:p-8"
    >
      <div className="grid gap-5">
        <div>
          <label htmlFor={`${id}-name`} className={labelClass}>Nombre</label>
          <input id={`${id}-name`} name="name" type="text" required maxLength={100}
                 autoComplete="name" placeholder="Tu nombre completo"
                 className={inputClass} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className={labelClass}>Correo</label>
          <input id={`${id}-email`} name="email" type="email" required
                 autoComplete="email" placeholder="tunombre@ejemplo.com"
                 className={inputClass} />
        </div>
        <div>
          <label htmlFor={`${id}-message`} className={labelClass}>Mensaje</label>
          <textarea id={`${id}-message`} name="message" required maxLength={5000}
                    rows={4} placeholder="Cuéntame sobre tu proyecto o consulta…"
                    className={inputClass + " resize-y"} />
        </div>
      </div>

      {/* Campo trampa: fuera de pantalla, invisible y no enfocable. */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor={`${id}-website`}>No rellenar</label>
        <input id={`${id}-website`} name="website" type="text"
               tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="neon-frame group mt-6 inline-flex w-full rounded-xl disabled:opacity-60 sm:w-auto
                   focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-offset-2 focus-visible:outline-neon-cyan"
      >
        <span className="flex w-full items-center justify-center gap-2 rounded-[calc(0.75rem-1.5px)]
                         bg-[#090e17] px-8 py-3 text-sm font-bold tracking-wide text-white
                         transition-colors group-hover:bg-gray-900 sm:w-44">
          {sending ? "Enviando…" : "Enviar"}
          <span aria-hidden="true" className="text-xs text-cyan-400">➤</span>
        </span>
      </button>

      <p
        role="status"
        aria-live="polite"
        className={
          "mt-4 min-h-[1.5rem] text-sm " +
          (status === "ok" ? "text-emerald-300" : "text-rose-300")
        }
      >
        {status !== "idle" && status !== "sending" && statusText[status]}
      </p>
    </form>
  );
}