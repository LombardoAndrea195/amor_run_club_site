/**
 * Shared hero video behaviour for every direction.
 *
 * Markup contract:
 *   <video data-hero-video data-poster="…" data-poster-portrait="…">
 *   <button data-video-toggle data-label-play="…" data-label-pause="…">
 *     optional <span data-video-label>; otherwise aria-label is used.
 * The toggle exposes aria-pressed="true" while the video is paused.
 */
export function initHeroVideo() {
  const video = document.querySelector<HTMLVideoElement>("[data-hero-video]");
  const toggle = document.querySelector<HTMLButtonElement>("[data-video-toggle]");
  if (!video) return;

  const portrait = matchMedia("(max-width: 700px)").matches;
  const poster = portrait ? video.dataset.posterPortrait : video.dataset.poster;
  if (poster) video.poster = poster;

  const label = toggle?.querySelector<HTMLElement>("[data-video-label]");
  const setState = (playing: boolean) => {
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", String(!playing));
    const text = playing ? toggle.dataset.labelPause : toggle.dataset.labelPlay;
    if (!text) return;
    if (label) label.textContent = text;
    else toggle.setAttribute("aria-label", text);
  };

  video.addEventListener("loadeddata", () => video.classList.add("is-ready"));
  video.addEventListener("play", () => setState(true));
  video.addEventListener("pause", () => setState(false));
  video.querySelector("source:last-of-type")?.addEventListener("error", () => {
    toggle?.remove();
    video.remove();
  });

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) setState(false);
  else video.play().catch(() => setState(false));

  toggle?.addEventListener("click", () => {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  });
}
