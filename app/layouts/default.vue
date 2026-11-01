<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import { siteUiSoundKey } from "~/composables/useSiteSound";

const entered = ref(false);
const soundEnabled = ref(false);
const playing = ref(false);
const volume = ref(0.42);
const theme = ref<"dark" | "light">("dark");
const themeAnimating = ref(false);
const audioElement = ref<HTMLAudioElement | null>(null);
const audioContext = ref<AudioContext | null>(null);
let themeFallbackTimer = 0;

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => { finished: Promise<void> };
};

function playUiSound(frequency = 680) {
  if (!import.meta.client || !soundEnabled.value || volume.value <= 0) return;
  try {
    const Context = window.AudioContext;
    if (!audioContext.value) audioContext.value = new Context();
    const context = audioContext.value;
    if (context.state === "suspended") void context.resume();
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const now = context.currentTime;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.16, now + 0.08);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.038 * volume.value), now + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);
    oscillator.connect(envelope);
    envelope.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  } catch {
    // Audio feedback is an enhancement; the site remains usable without Web Audio support.
  }
}

provide(siteUiSoundKey, playUiSound);

async function startMusic() {
  const audio = audioElement.value;
  if (!audio) return;
  audio.volume = volume.value;
  try {
    await audio.play();
  } catch {
    playing.value = false;
  }
}

function enterExperience(withSound: boolean) {
  entered.value = true;
  soundEnabled.value = withSound;
  if (withSound) {
    void startMusic();
    window.setTimeout(() => playUiSound(740), 100);
  } else {
    audioElement.value?.pause();
  }
}

function toggleSound() {
  if (soundEnabled.value) {
    playUiSound(510);
    soundEnabled.value = false;
    audioElement.value?.pause();
    return;
  }
  soundEnabled.value = true;
  void startMusic();
  window.setTimeout(() => playUiSound(740), 80);
}

function updateVolume(nextVolume: number) {
  volume.value = Math.max(0, Math.min(1, nextVolume));
  if (audioElement.value) audioElement.value.volume = volume.value;
}

function finishThemeAnimation() {
  themeAnimating.value = false;
}

function toggleTheme(event?: MouseEvent) {
  if (!import.meta.client || themeAnimating.value) return;
  const nextTheme = theme.value === "dark" ? "light" : "dark";
  const origin = event?.currentTarget instanceof HTMLElement ? event.currentTarget.getBoundingClientRect() : null;
  const x = origin ? origin.left + origin.width / 2 : window.innerWidth - 36;
  const y = origin ? origin.top + origin.height / 2 : 40;
  const root = document.documentElement;
  root.style.setProperty("--theme-origin-x", `${x}px`);
  root.style.setProperty("--theme-origin-y", `${y}px`);
  themeAnimating.value = true;

  const applyTheme = async () => {
    theme.value = nextTheme;
    playUiSound(nextTheme === "dark" ? 720 : 560);
    await nextTick();
  };
  const finish = () => finishThemeAnimation();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion) {
    const transitionDocument = document as ViewTransitionDocument;
    if (typeof transitionDocument.startViewTransition === "function") {
      try {
        const transition = transitionDocument.startViewTransition(applyTheme);
        void transition.finished.then(finish, finish);
        return;
      } catch {
        // Fall through to the CSS flare if the browser cancels or rejects the transition API.
      }
    }

    root.classList.remove("theme-wipe");
    void root.offsetWidth;
    root.classList.add("theme-wipe");
    themeFallbackTimer = window.setTimeout(() => {
      root.classList.remove("theme-wipe");
      finish();
    }, 820);
  } else {
    finish();
  }

  void applyTheme();
}

watch(theme, value => {
  if (!import.meta.client) return;
  document.documentElement.dataset.theme = value;
  try {
    localStorage.setItem("neon-saga-theme", value);
  } catch {
    // Storage can be unavailable in private contexts.
  }
}, { flush: "sync" });

watch(volume, value => {
  if (audioElement.value) audioElement.value.volume = value;
});

onMounted(() => {
  try {
    const saved = localStorage.getItem("neon-saga-theme");
    if (saved === "light" || saved === "dark") theme.value = saved;
  } catch {
    // Keep the dark default when storage is unavailable.
  }
  document.documentElement.dataset.theme = theme.value;
  if (audioElement.value) audioElement.value.volume = volume.value;
});

onBeforeUnmount(() => {
  audioElement.value?.pause();
  if (audioContext.value && audioContext.value.state !== "closed") void audioContext.value.close();
  if (themeFallbackTimer) window.clearTimeout(themeFallbackTimer);
});
</script>

<template>
  <div id="top" class="site-shell">
    <BrandHeader :theme="theme" @toggle-theme="toggleTheme" />
    <slot />
    <audio ref="audioElement" src="/media/neon-saga-ambience.mp3" preload="none" loop @play="playing = true" @pause="playing = false" @ended="playing = false" />
    <AudioDock v-if="entered" :enabled="soundEnabled" :volume="volume" :playing="playing" @toggle="toggleSound" @update:volume="updateVolume" />
    <SoundGate :visible="!entered" @choose="enterExperience" />
  </div>
</template>
