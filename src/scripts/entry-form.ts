/**
 * Demo entry form: client-side validation only, no backend.
 *
 * Markup contract (any direction can style it freely):
 *   <form data-entry-form novalidate>
 *     <input name="name"> <input name="email" type="email"> <input name="instagram">
 *     <input name="accept" type="checkbox">
 *     <p data-error-for="name|email|instagram|accept" id="..."></p>   (inputs use aria-describedby)
 *     <button type="submit">
 *   </form>
 *   <div data-form-success hidden> ... <span data-success-name></span> ... </div>
 *
 * State hooks: form gets data-state="idle|sending|done"; invalid fields get aria-invalid="true".
 */

type Field = "name" | "email" | "instagram" | "accept";

const messages: Record<Field, (el: HTMLInputElement) => string | null> = {
  name: (el) => (el.value.trim().length < 2 ? "Tell us your name so we know who to cheer for." : null),
  email: (el) => {
    const v = el.value.trim();
    if (!v) return "We need an email to send you run updates.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : "That email looks off. Check for typos.";
  },
  instagram: (el) => {
    const v = el.value.trim();
    if (!v) return null; // optional
    return /^@?[A-Za-z0-9._]{1,30}$/.test(v) ? null : "Instagram handles use letters, numbers, dots and underscores.";
  },
  accept: (el) => (el.checked ? null : "Please read and accept the Release of Liability to join."),
};

function validateField(form: HTMLFormElement, field: Field): boolean {
  const el = form.elements.namedItem(field) as HTMLInputElement | null;
  if (!el) return true;
  const msg = messages[field](el);
  const out = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
  if (msg) {
    el.setAttribute("aria-invalid", "true");
    if (out) out.textContent = msg;
  } else {
    el.removeAttribute("aria-invalid");
    if (out) out.textContent = "";
  }
  return !msg;
}

export function initEntryForms(root: ParentNode = document) {
  root.querySelectorAll<HTMLFormElement>("form[data-entry-form]").forEach((form) => {
    if (form.dataset.bound) return;
    form.dataset.bound = "true";
    form.dataset.state = "idle";
    const fields: Field[] = ["name", "email", "instagram", "accept"];

    fields.forEach((f) => {
      const el = form.elements.namedItem(f) as HTMLInputElement | null;
      el?.addEventListener(f === "accept" ? "change" : "blur", () => {
        if (el.value || el.getAttribute("aria-invalid") || f === "accept") validateField(form, f);
      });
      el?.addEventListener("input", () => {
        if (el.getAttribute("aria-invalid")) validateField(form, f);
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const results = fields.map((f) => validateField(form, f));
      if (results.includes(false)) {
        const firstBad = form.querySelector<HTMLElement>('[aria-invalid="true"]');
        firstBad?.focus();
        return;
      }
      form.dataset.state = "sending";
      const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
      submit?.setAttribute("disabled", "");
      await new Promise((r) => setTimeout(r, 700));

      const data = Object.fromEntries(new FormData(form).entries());
      try {
        localStorage.setItem("amor-entry-demo", JSON.stringify({ ...data, at: new Date().toISOString() }));
      } catch {}

      form.dataset.state = "done";
      submit?.removeAttribute("disabled");
      const success = (form.parentElement ?? document).querySelector<HTMLElement>("[data-form-success]");
      if (success) {
        const first = String(data.name ?? "").trim().split(/\s+/)[0];
        success.querySelectorAll("[data-success-name]").forEach((n) => (n.textContent = first));
        success.hidden = false;
        form.hidden = true;
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
    });
  });
}
