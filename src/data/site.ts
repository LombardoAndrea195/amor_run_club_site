import type { ImageMetadata } from "astro";

import groupPiazza from "../assets/photos/group-piazza.jpg";
import handshakePiazza from "../assets/photos/handshake-piazza.jpg";
import runParkCheer from "../assets/photos/run-park-cheer.jpg";
import crowdSauconyVan from "../assets/photos/crowd-saucony-van.jpg";
import pastaShopTeam from "../assets/photos/pasta-shop-team.jpg";
import pastaAlluovoTestaccio from "../assets/photos/pasta-alluovo-testaccio.jpg";
import nonnoRavioli from "../assets/photos/nonno-ravioli.jpg";
import shoeOnScale from "../assets/photos/shoe-on-scale.jpg";
import edicolaKiosk from "../assets/photos/edicola-kiosk.jpg";
import edicolaManShoe from "../assets/photos/edicola-man-shoe.jpg";
import journalStack from "../assets/photos/journal-stack.jpg";
import journalRack from "../assets/photos/journal-rack.jpg";
import journalShoesLight from "../assets/photos/journal-shoes-light.jpg";
import readingJournal from "../assets/photos/reading-journal.jpg";
import girlJournal from "../assets/photos/girl-journal.jpg";
import wingsTees from "../assets/photos/wings-tees.jpg";
import hangingShoes from "../assets/photos/hanging-shoes.jpg";
import shopWindow from "../assets/photos/shop-window.jpg";
import logo from "../assets/logo.png";

export { logo };

export const site = {
  name: "Amor Run Club",
  legalName: "Amor Run Club A.S.D.",
  tagline: "Eat pasta run fasta.",
  headline: "Run, laugh and connect",
  city: "Rome",
  description:
    "Amor Run Club is a free social run club in Rome for every pace. Weekly runs through the city, then pasta and good company.",
  links: {
    instagram: "https://www.instagram.com/amor_runclub/",
    instagramHandle: "@amor_runclub",
    whatsapp: "https://chat.whatsapp.com/H0ZIIUmXV1ND4bi73CpGDf",
    strava: "https://www.strava.com/clubs/1224988",
  },
  legal: {
    address: "Via Agostino Magliani 6, Rome, Italy",
    vat: "17811321003",
    taxCode: "96605360583",
    sdi: "BA6ET11",
  },
  // Copy from the original site, kept verbatim.
  copy: {
    exploreRome:
      "Be a part of the Amor Run Club community and experience the joy of running together through the beautiful streets of Rome. Whether you’re looking to improve your fitness, make new friends, or simply enjoy the city from a different perspective, we welcome runners of all levels. Join us for our weekly runs and social gatherings, and make the most of your time in the Eternal City.",
    getInvolved:
      "Amor Run Club in Rome is your gateway to fitness and fun! Join our vibrant community of runners, where every stride brings joy and new friendships. Whether you’re a seasoned runner or just starting out, our inclusive environment welcomes all levels. We organize scenic runs through Rome’s beautiful landscapes, followed by social events to bond over shared passions. With Amor Run Club, fitness becomes a delightful journey. Come run with us and discover the magic of running together!",
    eventsNote: "You can stay updated on all our activities through our Instagram page.",
  },
  events: [
    {
      title: "Easy Run 5K",
      distance: "5 km",
      note: "Date, time and meeting point are announced on Instagram.",
    },
  ],
} as const;

export type Photo = { src: ImageMetadata; alt: string; key: string };

export const photos = {
  groupPiazza: { key: "groupPiazza", src: groupPiazza, alt: "Around a hundred Amor Run Club members posing together in a sunny Roman piazza" },
  handshakePiazza: { key: "handshakePiazza", src: handshakePiazza, alt: "Two runners in club t-shirts clasping hands and laughing on a cobbled street" },
  runParkCheer: { key: "runParkCheer", src: runParkCheer, alt: "Runners smiling and waving at the camera during a group run in the park" },
  crowdSauconyVan: { key: "crowdSauconyVan", src: crowdSauconyVan, alt: "A crowd of runners gathered around a Saucony van under ivy-covered arches" },
  pastaShopTeam: { key: "pastaShopTeam", src: pastaShopTeam, alt: "Club members and the pasta maker behind the counter with fresh pasta and orange running shoes" },
  pastaAlluovoTestaccio: { key: "pastaAlluovoTestaccio", src: pastaAlluovoTestaccio, alt: "Runner entering a Testaccio pasta shop with an Amor Run Club banner in the window" },
  nonnoRavioli: { key: "nonnoRavioli", src: nonnoRavioli, alt: "An elderly pasta maker holding a tray of fresh ravioli with running shoes on his shoulders" },
  shoeOnScale: { key: "shoeOnScale", src: shoeOnScale, alt: "A runner weighing an orange running shoe on the pasta shop scale" },
  edicolaKiosk: { key: "edicolaKiosk", src: edicolaKiosk, alt: "A Roman newsstand dressed in Saucony and Amor Run Club red panels" },
  edicolaManShoe: { key: "edicolaManShoe", src: edicolaManShoe, alt: "The newsstand owner proudly holding a yellow running shoe" },
  journalStack: { key: "journalStack", src: journalStack, alt: "Copies of The Runner’s Journal, Amor x Saucony, stacked on a red stand" },
  journalRack: { key: "journalRack", src: journalRack, alt: "A rack full of The Runner’s Journal newspapers inside the newsstand" },
  journalShoesLight: { key: "journalShoesLight", src: journalShoesLight, alt: "Running shoes and The Runner’s Journal in warm afternoon light" },
  readingJournal: { key: "readingJournal", src: readingJournal, alt: "Two runners reading The Runner’s Journal together" },
  girlJournal: { key: "girlJournal", src: girlJournal, alt: "A runner laughing while holding up a copy of The Runner’s Journal" },
  wingsTees: { key: "wingsTees", src: wingsTees, alt: "Runners from behind wearing black Roma t-shirts with winged-foot prints" },
  hangingShoes: { key: "hangingShoes", src: hangingShoes, alt: "A pair of orange running shoes hanging by their laces in the sun" },
  shopWindow: { key: "shopWindow", src: shopWindow, alt: "A shop window displaying running shoes between rows of newspapers" },
} satisfies Record<string, Photo>;

export const gallery: Photo[] = [
  photos.girlJournal,
  photos.pastaShopTeam,
  photos.edicolaKiosk,
  photos.wingsTees,
  photos.nonnoRavioli,
  photos.journalStack,
  photos.pastaAlluovoTestaccio,
  photos.readingJournal,
  photos.hangingShoes,
  photos.edicolaManShoe,
  photos.shoeOnScale,
  photos.journalRack,
  photos.shopWindow,
  photos.journalShoesLight,
];

export const directions = [
  { slug: "world", name: "Fly through the club", summary: "An immersive 3D clay Rome: scroll flies the camera from the piazza to the pasta table, no video needed." },
  { slug: "menu", name: "Menu del giorno", summary: "Trattoria world: tomato red and ink on paper, the run served as a menu, sign-up on a waiter’s order pad." },
  { slug: "cartoon", name: "Rubber-hose title card", summary: "The mascot’s 1930s cartoon world: title cards, iris wipes, ink and red." },
  { slug: "journal", name: "The Runner’s Journal", summary: "The club as a broadsheet, after the real Amor x Saucony newsstand edition." },
  { slug: "classic", name: "Run club classic", summary: "The category standard played straight: full-bleed photography, condensed type, one loud CTA." },
] as const;
