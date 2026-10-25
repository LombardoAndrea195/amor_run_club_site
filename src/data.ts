const B = import.meta.env.BASE_URL;
export const asset = (p: string) => `${B}${p}`;
export const photo = (name: string) => asset(`photos/${name}.jpg`);

export const site = {
  links: {
    instagram: "https://www.instagram.com/amor_runclub/",
    handle: "@amor_runclub",
    whatsapp: "https://chat.whatsapp.com/H0ZIIUmXV1ND4bi73CpGDf",
    strava: "https://www.strava.com/clubs/1224988",
  },
  legal: "Amor Run Club A.S.D. · Via Agostino Magliani 6, Rome · VAT 17811321003 · Tax Code 96605360583",
  about:
    "Be a part of the Amor Run Club community and experience the joy of running together through the beautiful streets of Rome. Whether you’re looking to improve your fitness, make new friends, or simply enjoy the city from a different perspective, we welcome runners of all levels. Join us for our weekly runs and social gatherings, and make the most of your time in the Eternal City.",
  involved:
    "Amor Run Club in Rome is your gateway to fitness and fun! Join our vibrant community of runners, where every stride brings joy and new friendships. Whether you’re a seasoned runner or just starting out, our inclusive environment welcomes all levels. Come run with us and discover the magic of running together!",
};

/**
 * Drop the exported reel videos in public/reels/ (reel-1.mp4 …) and they play here.
 * Until a file exists the card falls back to the photo and links to Instagram.
 */
export const reels = [
  { src: "reels/reel-1.mp4", poster: "group-piazza", title: "Sunday in the piazza" },
  { src: "reels/reel-2.mp4", poster: "run-park-cheer", title: "Run, laugh, repeat" },
  { src: "reels/reel-3.mp4", poster: "pasta-shop-team", title: "Pasta after the run" },
  { src: "reels/reel-4.mp4", poster: "crowd-saucony-van", title: "Amor x Saucony" },
  { src: "reels/reel-5.mp4", poster: "nonno-ravioli", title: "Nonno approves" },
];

export const gallery = [
  ["girl-journal", "A runner laughing while holding up a copy of The Runner’s Journal"],
  ["pasta-shop-team", "Club members and the pasta maker behind the counter"],
  ["edicola-kiosk", "A Roman newsstand dressed in Saucony and Amor Run Club red"],
  ["wings-tees", "Runners from behind in black Roma t-shirts with winged-foot prints"],
  ["nonno-ravioli", "An elderly pasta maker with fresh ravioli and running shoes on his shoulders"],
  ["handshake-piazza", "Two runners clasping hands and laughing on a cobbled street"],
  ["hanging-shoes", "Orange running shoes hanging by their laces in the sun"],
  ["reading-journal", "Two runners reading The Runner’s Journal together"],
] as const;

export const events = [
  {
    title: "Halloween Takeover",
    meta: "With The Hoxton, Rome",
    lines: ["10:00 · Spooky Run, DJ bike and brunch", "19:00 · After Party: DJ set, food and drinks until midnight"],
  },
  {
    title: "Easy Run 5K",
    meta: "5 km · all paces",
    lines: ["Date, time and meeting point are announced on Instagram."],
  },
];
