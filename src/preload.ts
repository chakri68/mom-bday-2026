import { SOUNDS, BG_MUSIC_SRC, loadSound, bgMusic } from "./audio/sounds";
import { POLAROID_IMAGES } from "./assets/images";

/**
 * Preload every sound effect (decoded to AudioBuffer) and every image
 * used by the experience. Reports 0 → 1 progress via `onProgress`.
 */
export async function preloadAll(
  onProgress: (p: number) => void,
): Promise<void> {
  const soundSrcs = Array.from(
    new Set(Object.values(SOUNDS).map((s) => s.src)),
  );
  const imageSrcs = POLAROID_IMAGES.map((i) => i.src);

  const tasks: Array<() => Promise<void>> = [
    ...soundSrcs.map((src) => () => loadSound(src)),
    ...imageSrcs.map((src) => () => loadImage(src)),
  ];

  let done = 0;
  const total = tasks.length;
  onProgress(0);

  await Promise.all(
    tasks.map(async (t) => {
      try {
        await t();
      } catch {
        /* don't block the experience on a single failed asset */
      } finally {
        done += 1;
        onProgress(done / total);
      }
    }),
  );

  // fire-and-forget: tell the browser to start buffering the bg track
  bgMusic.preload();
  // bump volume hint — actual buffering is async; we don't block on it
  void BG_MUSIC_SRC;
}

function loadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`image ${src}`));
    img.src = src;
  });
}
