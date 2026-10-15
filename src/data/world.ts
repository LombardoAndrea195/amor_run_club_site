/**
 * Content for the /world flight. Facts only: anything unknown stays out.
 *
 * Founders: portrait files live in public/world/founders/ (any size — they are
 * cover-cropped into the frame, never stretched). `focus` is optional and sets
 * where the crop lands, 0 = top of the image, 1 = bottom, default 0.5 (centre).
 */
export const founders = [
  { name: "Founder", photo: "founder1.png" },
  { name: "Founder", photo: "founder2.png" },
  { name: "Founder", photo: "founder3.png" },
] as { name: string; photo: string | null; focus?: number }[];

export const schedule = {
  social: { day: "Saturday", what: "Social run, about 5 km, starting around Testaccio. Routes change every week." },
  intervals: { day: "Tuesday", what: "Evening intervals led by our running coach." },
};
