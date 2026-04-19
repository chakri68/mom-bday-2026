/**
 * Central audio manager.
 *
 * - Decodes all sound effects into AudioBuffers once (via the preloader).
 * - Plays sub-regions of each buffer using `from` / `to` (seconds) so we can
 *   trim the stock assets without re-encoding them.
 * - Handles a single looping background track with fade in / fade out.
 * - Respects a global mute flag persisted in localStorage.
 */

export type SoundId = "popper" | "cheer" | "snap" | "paperTurn" | "paperSlide";

export type SoundDef = {
  src: string;
  /** Playback start offset in seconds. Default: 0. */
  from?: number;
  /** Playback end offset in seconds. Default: full buffer length. */
  to?: number;
  /** Playback volume 0-1. Default: 1. */
  volume?: number;
};

const base = import.meta.env.BASE_URL; // "/" locally, "/mom-bday-2026/" on pages

export const SOUNDS: Record<SoundId, SoundDef> = {
  // celebration: short cartoon popper
  popper: {
    src: `${base}sounds/cartoon-music-soundtrack-party-popper-light-pop-508699.mp3`,
    from: 0,
    to: 1.3,
    volume: 0.7,
  },
  // celebration: soft crowd cheer under the confetti
  cheer: {
    src: `${base}sounds/driken5482-applause-cheer-236786.mp3`,
    from: 0.2,
    to: 2.6,
    volume: 0.35,
  },
  // seal click — short snap
  snap: {
    src: `${base}sounds/freesound_community-snapping-48244.mp3`,
    from: 0,
    to: 0.5,
    volume: 0.6,
  },
  // envelope flap opening
  paperTurn: {
    src: `${base}sounds/freesound_community-paper-turn-40077.mp3`,
    from: 0,
    to: 1.6,
    volume: 0.7,
  },
  // letter sliding out — reuse the same paper asset, different region
  paperSlide: {
    src: `${base}sounds/freesound_community-paper-turn-40077.mp3`,
    from: 1.6,
    to: 3.2,
    volume: 0.55,
  },
};

/** Path for the background music. Expected to be loopable. */
export const BG_MUSIC_SRC = `${base}sounds/bg-music.mp3`;

/* ------------------------------------------------------------------ */

let ctx: AudioContext | null = null;
const buffers = new Map<string, AudioBuffer>();

function getCtx(): AudioContext {
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new Ctor();
  }
  return ctx;
}

/** Call from a user gesture (e.g. the "Begin" button). */
export async function unlockAudio(): Promise<void> {
  const c = getCtx();
  if (c.state === "suspended") {
    try {
      await c.resume();
    } catch {
      /* ignore */
    }
  }
}

export function isMuted(): boolean {
  return localStorage.getItem("bday:muted") === "1";
}

export function setMuted(v: boolean): void {
  localStorage.setItem("bday:muted", v ? "1" : "0");
  if (v) bgMusic.pauseNow();
  else bgMusic.resumeIfStarted();
}

/** Fetch + decode a single sound. Used by the preloader. */
export async function loadSound(src: string): Promise<void> {
  if (buffers.has(src)) return;
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Failed to load ${src}`);
  const arr = await res.arrayBuffer();
  const buf = await getCtx().decodeAudioData(arr.slice(0));
  buffers.set(src, buf);
}

/** Play a registered sound id. No-op if muted. */
export function playSound(id: SoundId): void {
  if (isMuted()) return;
  const def = SOUNDS[id];
  const buf = buffers.get(def.src);
  if (!buf) return; // not loaded yet — silently skip
  const c = getCtx();
  const source = c.createBufferSource();
  source.buffer = buf;

  const gain = c.createGain();
  gain.gain.value = def.volume ?? 1;

  source.connect(gain).connect(c.destination);

  const from = Math.max(0, def.from ?? 0);
  const to = Math.min(buf.duration, def.to ?? buf.duration);
  const duration = Math.max(0.05, to - from);
  source.start(0, from, duration);
}

/* ------------------ background music ------------------- */

class BgMusic {
  private el: HTMLAudioElement | null = null;
  private started = false;
  private targetVolume = 0.3;
  private fadeRaf = 0;

  preload(): void {
    if (this.el) return;
    const a = new Audio(BG_MUSIC_SRC);
    a.loop = true;
    a.preload = "auto";
    a.volume = 0;
    // kick the browser to actually buffer
    try {
      a.load();
    } catch {
      /* ignore */
    }
    this.el = a;
  }

  /** Start playing at 0 volume and fade in. Safe to call once. */
  fadeIn(targetVolume = 0.3, durationMs = 2500): void {
    if (!this.el) this.preload();
    const el = this.el!;
    this.targetVolume = targetVolume;
    if (this.started) return;
    this.started = true;
    if (isMuted()) return; // don't play audio, but mark as started so unmute resumes
    el.volume = 0;
    el.play().catch(() => {
      /* autoplay may still be blocked on some browsers; ignored */
    });
    this.fadeTo(targetVolume, durationMs);
  }

  private fadeTo(target: number, durationMs: number): void {
    if (!this.el) return;
    cancelAnimationFrame(this.fadeRaf);
    const el = this.el;
    const start = el.volume;
    const startedAt = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / durationMs);
      el.volume = start + (target - start) * t;
      if (t < 1) this.fadeRaf = requestAnimationFrame(step);
    };
    this.fadeRaf = requestAnimationFrame(step);
  }

  pauseNow(): void {
    this.el?.pause();
  }

  resumeIfStarted(): void {
    if (!this.started || !this.el || isMuted()) return;
    this.el.play().catch(() => {});
    this.fadeTo(this.targetVolume, 800);
  }
}

export const bgMusic = new BgMusic();
