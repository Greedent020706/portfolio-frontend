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
  "mt-1 w-full rounded-lg border border-ink/25 bg-paper px-3 py-2 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent";

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
    <form onSubmit={handleSubmit} className="mt-6 w-full max-w-md text-left">
      <div className="grid gap-4">
        <div>
          <label htmlFor={`${id}-name`} className="text-sm font-medium">Nombre</label>
          <input id={`${id}-name`} name="name" type="text" required maxLength={100}
                 autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="text-sm font-medium">Correo</label>
          <input id={`${id}-email`} name="email" type="email" required
                 autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor={`${id}-message`} className="text-sm font-medium">Mensaje</label>
          <textarea id={`${id}-message`} name="message" required maxLength={5000}
                    rows={4} className={inputClass} />
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
        className="mt-5 rounded-lg bg-ink px-5 py-2 font-medium text-paper disabled:opacity-60
                   focus-visible:outline focus-visible:outline-2
                   focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {sending ? "Enviando…" : "Enviar"}
      </button>

      <p role="status" aria-live="polite" className="mt-3 min-h-[1.5rem] text-sm">
        {status !== "idle" && status !== "sending" && statusText[status]}
      </p>
    </form>
  );
}