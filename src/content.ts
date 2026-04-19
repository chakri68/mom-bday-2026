import content from "./content.json";

/**
 * Central typed content config. Edit `src/content.json` to change any text,
 * image URL, or caption on the site — nothing else needs to be touched.
 */
export type PolaroidImage = {
  src: string;
  caption: string;
  rotate: number;
};

export type Content = {
  siteTitle: string;
  start: { tagline: string; button: string; hint: string };
  loading: {
    loadingText: string;
    readyText: string;
    buttonLoading: string;
    buttonReady: string;
    footer: string;
  };
  celebration: { line1: string; line2: string; emoji: string };
  envelope: { hint: string };
  letter: { lines: string[]; closing: string; signature: string };
  polaroids: { heading: string; photos: PolaroidImage[] };
  credits: { withLove: string; writtenBy: string; directedBy: string };
};

const typed = content as Content;

export default typed;
export const POLAROID_IMAGES: PolaroidImage[] = typed.polaroids.photos;
