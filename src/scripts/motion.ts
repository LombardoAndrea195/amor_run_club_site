/**
 * transitions.dev wiring shared by every direction (styles in styles/transitions.css).
 *
 *   [data-stagger]          direct children rise in one after another (texts reveal).
 *                           data-stagger="load" plays on page load, otherwise on scroll.
 *   initTilt(selector)      images inside matching elements tilt toward the pointer.
 *   shake(el)               error state shake, used by the entry form.
 */

const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function prepareStagger(block: HTMLElement) {
  block.classList.add("t-stagger");
  Array.from(block.children).forEach((child, i) => {
    const el = child as HTMLElement;
    const display = getComputedStyle(el).display;
    el.classList.add("t-stagger-line");
    if (display !== "block") el.style.display = display;
    el.style.setProperty("--line", String(i));
  });
}

export function showStagger(block: HTMLElement) {
  if (!block.classList.contains("t-stagger")) prepareStagger(block);
  block.classList.remove("is-shown");
  void block.offsetHeight;
  block.classList.add("is-shown");
}

export function initStagger(root: ParentNode = document) {
  const blocks = root.querySelectorAll<HTMLElement>("[data-stagger]");
  if (reduce()) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        (e.target as HTMLElement).classList.add("is-shown");
        io.unobserve(e.target);
      });
    },
    { threshold: 0.25 },
  );
  blocks.forEach((block) => {
    prepareStagger(block);
    if (block.dataset.stagger === "load") requestAnimationFrame(() => showStagger(block));
    else io.observe(block);
  });
}

const MAX = 10;

export function initTilt(selector: string) {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  document.querySelectorAll<HTMLElement>(selector).forEach((host) => {
    const img = host.querySelector("img");
    const tilt = img?.parentElement;
    if (!img || !tilt || tilt.classList.contains("t-tilt")) return;
    const card = document.createElement("div");
    card.className = "t-tilt-card";
    const glare = document.createElement("div");
    glare.className = "t-tilt-glare";
    img.replaceWith(card);
    card.append(img, glare);
    tilt.classList.add("t-tilt");

    const reset = () => {
      tilt.classList.remove("is-hover");
      card.classList.remove("is-tilting");
      card.style.setProperty("--tilt-rx", "0deg");
      card.style.setProperty("--tilt-ry", "0deg");
    };
    tilt.addEventListener("pointermove", (e) => {
      if (reduce()) return;
      const r = tilt.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      tilt.classList.add("is-hover");
      card.classList.add("is-tilting");
      card.style.setProperty("--tilt-ry", ((px - 0.5) * MAX).toFixed(2) + "deg");
      card.style.setProperty("--tilt-rx", ((0.5 - py) * MAX).toFixed(2) + "deg");
      card.style.setProperty("--tilt-gx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--tilt-gy", (py * 100).toFixed(1) + "%");
    });
    tilt.addEventListener("pointerleave", reset);
  });
}

export function shake(el: HTMLElement) {
  el.classList.add("t-input");
  el.classList.remove("is-shaking");
  void el.offsetWidth;
  el.classList.add("is-shaking");
  const cs = getComputedStyle(document.documentElement);
  const a = parseFloat(cs.getPropertyValue("--shake-dur-a")) || 80;
  const b = parseFloat(cs.getPropertyValue("--shake-dur-b")) || 60;
  setTimeout(() => el.classList.remove("is-shaking"), a * 2 + b * 2 + 20);
}
