/**
 * Shared image registry so the preloader and the Polaroid component stay
 * in sync. Swap the URLs here to swap the displayed photos.
 */

export type PolaroidImage = {
  src: string;
  caption: string;
  rotate: number;
};

export const POLAROID_IMAGES: PolaroidImage[] = [
  {
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=60",
    caption: "family days ♡",
    rotate: -6,
  },
  {
    src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&q=60",
    caption: "your smile",
    rotate: 3,
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=60",
    caption: "little moments",
    rotate: -2,
  },
  {
    src: "https://images.unsplash.com/photo-1478476868527-002ae3f3e159?w=400&q=60",
    caption: "home",
    rotate: 5,
  },
];
