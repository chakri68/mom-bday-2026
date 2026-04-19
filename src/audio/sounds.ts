/**
 * Central audio manager.
 *
 * - Decodes all sound effects into AudioBuffers once (via the preloader).
 * - Plays sub-regions of each buffer using `from` / `to` (seconds) so we can
 *   trim the stock assets without re-encoding them.
 * - Supports per-sound fade in / out / both, via `fade` and `fadeDuration`.
 * - Handles a single looping background track with fade in / fade out.
 * - Respects a global mute flag persisted in localStorage.
 */

export type SoundId = "popper" | "cheer" | "snap" | "paperTurn" | "paperSlide";

export type SoundFade = "none" | "in" | "out" | "both";

export type SoundDef = {
  src: string;
  /** Playback start offset in seconds. Default: 0. */
  from?: number;
  /** Playback end offset in seconds. Default: full buffer length. */
  to?: number;
  /** Playback volume 0-1. Default: 1. */
  volume?: number;
  /** Fade behaviour at the edges of the clip. Default: "none". */
  fade?: SoundFade;
  /** Fade duration in seconds. Default: 0.15. Clamped to duration/2. */
  fadeDuration?: number;
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
    to: 3.6,
    volume: 0.35,
    fade: "both",
    fadeDuration: 0.4,
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
    fade: "out",
    fadeDuration: 0.2,
  },
  // letter sliding out — reuse the same paper asset, different region
  paperSlide: {
    src: `${base}sounds/freesound_community-paper-turn-40077.mp3`,
    from: 1.6,
    to: 3.2,
    volume: 0.55,
    fade: "both",
    fadeDuration: 0.2,
  },
};

/**
 * Background music playlist. First track starts when the letter opens and
 * carries the emotional tone; subsequent tracks fade in after it ends and
 * the cycle continues forever (crossfaded).
 *
 * Clair de Lune is intentionally first — melancholic + tender.
 */
export const BG_PLAYLIST: string[] = [
  `${base}music/Clair de Lune (Studio Version) [X-Xxqt6Xdio].mp3`,
  `${base}music/Erik Satie - Gymnopédie No.1 [S-Xm7s9eGxU].mp3`,
  `${base}music/Benson Boone - Beautiful Things (Instrumental) [Official Audio] [yKGWdveqdVA].mp3`,
];

/** Single looping track used during the celebration screen. */
export const HAPPY_BIRTHDAY_SRC = `${base}music/Happy Birthday (Piano Version) [vhVBWw6rId0].mp3`;

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
  const volume = def.volume ?? 1;

  const from = Math.max(0, def.from ?? 0);
  const to = Math.min(buf.duration, def.to ?? buf.duration);
  const duration = Math.max(0.05, to - from);

  const fade: SoundFade = def.fade ?? "none";
  const fadeDur = Math.min(def.fadeDuration ?? 0.15, duration / 2);
  const now = c.currentTime;

  if (fade === "in" || fade === "both") {
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + fadeDur);
  } else {
    gain.gain.setValueAtTime(volume, now);
  }

  if (fade === "out" || fade === "both") {
    // hold full volume until fade-out starts, then ramp down to ~0
    gain.gain.setValueAtTime(volume, now + duration - fadeDur);
    gain.gain.linearRampToValueAtTime(0.0001, now + duration);
  }

  source.connect(gain).connect(c.destination);
  source.start(0, from, duration);
}

/* ------------------ background music ------------------- */

/**
 * Plays a playlist of tracks with fade-in / fade-out at track boundaries.
 *
 * - Track 0 starts on `fadeIn()` (called once the letter opens).
 * - When a track is near its end we start fading it out and fade in the
 *   next one, then swap the active element. Order cycles forever.
 * - Uses two <audio> elements so crossfades are smooth (no gap, no click).
 */
class BgMusic {
  private elA: HTMLAudioElement | null = null;
  private elB: HTMLAudioElement | null = null;
  private active: "A" | "B" = "A";
  private index = 0;
  private started = false;
  private targetVolume = 0.22; // low-medium — melancholic, not overpowering
  private fadeRafs = new Map<HTMLAudioElement, number>();
  private endWatchRaf = 0;
  private readonly fadeMs = 3500;

  /** Warm the browser cache for the first track (and a hint for the second). */
  preload(): void {
    if (this.elA) return;
    this.elA = this.makeEl(BG_PLAYLIST[0]);
    if (BG_PLAYLIST.length > 1) {
      // fetch second track too so the first crossfade is smooth
      const hint = new Audio(BG_PLAYLIST[1]);
      hint.preload = "auto";
      try {
        hint.load();
      } catch {
        /* ignore */
      }
    }
  }

  private makeEl(src: string): HTMLAudioElement {
    const a = new Audio(src);
    a.preload = "auto";
    a.volume = 0;
    try {
      a.load();
    } catch {
      /* ignore */
    }
    return a;
  }

  private get activeEl(): HTMLAudioElement | null {
    return this.active === "A" ? this.elA : this.elB;
  }

  /** Start playing the first track (fades in). Safe to call once. */
  fadeIn(targetVolume = 0.22, durationMs = this.fadeMs): void {
    if (!this.elA) this.preload();
    this.targetVolume = targetVolume;
    if (this.started) return;
    this.started = true;
    if (isMuted()) return;
    this.playActive(durationMs);
    this.watchForEnd();
  }

  private playActive(fadeMs: number): void {
    const el = this.activeEl;
    if (!el) return;
    el.volume = 0;
    el.play().catch(() => {
      /* autoplay may still be blocked on some browsers */
    });
    this.fadeTo(el, this.targetVolume, fadeMs);
  }

  private fadeTo(
    el: HTMLAudioElement,
    target: number,
    durationMs: number,
    onDone?: () => void,
  ): void {
    const existing = this.fadeRafs.get(el);
    if (existing !== undefined) cancelAnimationFrame(existing);
    const start = el.volume;
    const startedAt = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / durationMs);
      el.volume = Math.max(0, start + (target - start) * t);
      if (t < 1) {
        this.fadeRafs.set(el, requestAnimationFrame(step));
      } else {
        this.fadeRafs.delete(el);
        onDone?.();
      }
    };
    this.fadeRafs.set(el, requestAnimationFrame(step));
  }

  /**
   * Poll the active track's position and, when it's within fadeMs of the
   * end, start the crossfade to the next track.
   */
  private watchForEnd(): void {
    cancelAnimationFrame(this.endWatchRaf);
    const tick = () => {
      const el = this.activeEl;
      if (!this.started || !el) return;
      const remaining = (el.duration || 0) - el.currentTime;
      if (
        el.duration > 0 &&
        !Number.isNaN(el.duration) &&
        remaining <= this.fadeMs / 1000 + 0.1
      ) {
        this.advance();
        return;
      }
      this.endWatchRaf = requestAnimationFrame(tick);
    };
    this.endWatchRaf = requestAnimationFrame(tick);
  }

  /** Crossfade from the active element to the next track in the playlist. */
  private advance(): void {
    const nextIndex = (this.index + 1) % BG_PLAYLIST.length;
    const nextSrc = BG_PLAYLIST[nextIndex];
    const nextKey: "A" | "B" = this.active === "A" ? "B" : "A";
    const nextEl = this.makeEl(nextSrc);
    if (nextKey === "A") this.elA = nextEl;
    else this.elB = nextEl;

    const prevEl = this.activeEl;

    // start the new one and fade it in
    nextEl.volume = 0;
    nextEl.play().catch(() => {});
    this.fadeTo(nextEl, this.targetVolume, this.fadeMs);

    // fade out + stop the previous one
    if (prevEl) {
      this.fadeTo(prevEl, 0, this.fadeMs, () => {
        prevEl.pause();
        prevEl.src = "";
        if (this.active === "A") this.elA = null;
        else this.elB = null;
      });
    }

    this.active = nextKey;
    this.index = nextIndex;
    this.watchForEnd();
  }

  pauseNow(): void {
    cancelAnimationFrame(this.endWatchRaf);
    this.elA?.pause();
    this.elB?.pause();
  }

  resumeIfStarted(): void {
    if (!this.started || isMuted()) return;
    const el = this.activeEl;
    if (!el) return;
    el.play().catch(() => {});
    this.fadeTo(el, this.targetVolume, 1000);
    this.watchForEnd();
  }
}

export const bgMusic = new BgMusic();

/* ------------------ happy-birthday loop ------------------- */

/**
 * Simple looping track with fade-in / fade-out. Used during the celebration
 * screen and independent of the main letter-scene playlist.
 */
class LoopTrack {
  private el: HTMLAudioElement | null = null;
  private rafId = 0;
  private readonly src: string;

  constructor(src: string) {
    this.src = src;
  }

  preload(): void {
    if (this.el) return;
    const a = new Audio(this.src);
    a.loop = true;
    a.preload = "auto";
    a.volume = 0;
    try {
      a.load();
    } catch {
      /* ignore */
    }
    this.el = a;
  }

  fadeIn(targetVolume = 0.45, durationMs = 1200): void {
    if (isMuted()) return;
    if (!this.el) this.preload();
    const el = this.el;
    if (!el) return;
    el.loop = true;
    el.play().catch(() => {
      /* autoplay may still be blocked */
    });
    this.fadeTo(targetVolume, durationMs);
  }

  fadeOut(durationMs = 900, onDone?: () => void): void {
    const el = this.el;
    if (!el) {
      onDone?.();
      return;
    }
    this.fadeTo(0, durationMs, () => {
      el.pause();
      el.currentTime = 0;
      onDone?.();
    });
  }

  private fadeTo(target: number, durationMs: number, onDone?: () => void) {
    const el = this.el;
    if (!el) return;
    cancelAnimationFrame(this.rafId);
    const start = el.volume;
    const startedAt = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / durationMs);
      el.volume = Math.max(0, start + (target - start) * t);
      if (t < 1) {
        this.rafId = requestAnimationFrame(step);
      } else {
        onDone?.();
      }
    };
    this.rafId = requestAnimationFrame(step);
  }
}

export const happyBirthdayLoop = new LoopTrack(HAPPY_BIRTHDAY_SRC);
