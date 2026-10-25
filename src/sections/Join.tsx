import { useRef, useState, type FormEvent } from "react";
import ClickSpark from "../components/rb/ClickSpark";
import Magnet from "../components/rb/Magnet";
import ReleaseText from "../components/ReleaseText";
import { useLenisRef } from "../lenis";
import { site } from "../data";

type Field = "name" | "email" | "instagram" | "accept";
type Values = { name: string; email: string; instagram: string; accept: boolean };

const check = (f: Field, v: Values): string | null => {
  switch (f) {
    case "name": return v.name.trim().length < 2 ? "Tell us your name so we know who to cheer for." : null;
    case "email":
      if (!v.email.trim()) return "We need an email to send you run updates.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()) ? null : "That email looks off. Check for typos.";
    case "instagram":
      return !v.instagram.trim() || /^@?[A-Za-z0-9._]{1,30}$/.test(v.instagram.trim())
        ? null : "Instagram handles use letters, numbers, dots and underscores.";
    case "accept": return v.accept ? null : "Please read and accept the Release of Liability to join.";
  }
};

const FIELDS: Field[] = ["name", "email", "instagram", "accept"];

export default function Join() {
  const lenis = useLenisRef();
  const dialog = useRef<HTMLDialogElement>(null);
  const [v, setV] = useState<Values>({ name: "", email: "", instagram: "", accept: false });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    const next = { ...v, [k]: val };
    setV(next);
    if (errors[k as Field]) setErrors((e) => ({ ...e, [k]: check(k as Field, next) ?? undefined }));
  };

  const open = () => { lenis?.current?.lenis?.stop(); dialog.current?.showModal(); };
  const close = () => dialog.current?.close();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = Object.fromEntries(FIELDS.map((f) => [f, check(f, v) ?? undefined]));
    setErrors(errs);
    const bad = FIELDS.find((f) => errs[f]);
    if (bad) {
      (document.getElementById(`f-${bad}`) as HTMLElement | null)?.focus();
      return;
    }
    setState("sending");
    await new Promise((r) => setTimeout(r, 700));
    try { localStorage.setItem("amor-entry-demo", JSON.stringify({ ...v, at: new Date().toISOString() })); } catch {}
    setState("done");
  };

  const err = (f: Field) => errors[f];
  const first = v.name.trim().split(/\s+/)[0];

  return (
    <section className="join" id="join" aria-labelledby="join-title">
      <ClickSpark sparkColor="#fbf6f2" sparkCount={10} sparkRadius={28} className="join__spark">
        <div className="join__grid">
          <div>
            <h2 id="join-title" className="display">Join Amor Run Club</h2>
            <p className="join__lead">{site.involved}</p>
          </div>

          {state === "done" ? (
            <div className="join__done" role="status" tabIndex={-1}>
              <h3 className="display">See you on the run, {first}!</h3>
              <p>You’re in. Follow {site.links.handle} for the next run and hop in the WhatsApp community.</p>
              <a className="pill pill--light" href={site.links.whatsapp} target="_blank" rel="noopener noreferrer">Open WhatsApp</a>
            </div>
          ) : (
            <form className="form" onSubmit={submit} noValidate>
              <label htmlFor="f-name">Name</label>
              <input id="f-name" name="name" autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)}
                aria-invalid={!!err("name")} aria-describedby="e-name" />
              <p className="form__err" id="e-name">{err("name")}</p>

              <label htmlFor="f-email">Email</label>
              <input id="f-email" name="email" type="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)}
                aria-invalid={!!err("email")} aria-describedby="e-email" />
              <p className="form__err" id="e-email">{err("email")}</p>

              <label htmlFor="f-instagram">Instagram <span>(optional)</span></label>
              <input id="f-instagram" name="instagram" placeholder="@yourhandle" value={v.instagram} onChange={(e) => set("instagram", e.target.value)}
                aria-invalid={!!err("instagram")} aria-describedby="e-instagram" />
              <p className="form__err" id="e-instagram">{err("instagram")}</p>

              <div className="form__accept">
                <input id="f-accept" type="checkbox" checked={v.accept} onChange={(e) => set("accept", e.target.checked)}
                  aria-invalid={!!err("accept")} aria-describedby="e-accept" />
                <label htmlFor="f-accept">
                  I have read and accept the{" "}
                  <button type="button" className="linkbtn" onClick={open}>Release of Liability</button>
                </label>
              </div>
              <p className="form__err" id="e-accept">{err("accept")}</p>

              <Magnet magnetStrength={4} padding={40}>
                <button className="pill pill--light" type="submit" disabled={state === "sending"}>
                  {state === "sending" ? "Joining…" : "Join the club"}
                </button>
              </Magnet>
              <p className="form__note">Demo form: nothing is sent yet.</p>
            </form>
          )}
        </div>
      </ClickSpark>

      <dialog ref={dialog} className="modal" aria-label="Release of Liability"
        onClose={() => lenis?.current?.lenis?.start()}
        onClick={(e) => { if (e.target === dialog.current) close(); }}>
        <div className="modal__body" data-lenis-prevent>
          <ReleaseText />
        </div>
        <div className="modal__bar">
          <button type="button" className="pill pill--sm" onClick={close}>Close</button>
          <button type="button" className="pill pill--sm pill--ghost" onClick={() => { set("accept", true); close(); }}>I accept</button>
        </div>
      </dialog>
    </section>
  );
}
