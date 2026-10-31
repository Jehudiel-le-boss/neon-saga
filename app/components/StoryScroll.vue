<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

defineProps<{ videoSrc: string; poster: string }>();
const emit = defineEmits<{ chapter: [index: number]; interaction: [] }>();

const track = ref<HTMLElement | null>(null);
const video = ref<HTMLVideoElement | null>(null);
const progress = ref(0);
const activeChapter = ref(0);
const duration = ref(30);
const chapters = [
  { label: "01 / RÉVÉLATION", title: "Un univers.", emphasis: "À portée de main.", text: "Le rituel de l’unboxing commence. Faites défiler pour révéler la Collector Capsule NEON SAGA." },
  { label: "02 / L’ÉCRIN S’ÉVEILLE", title: "L’écrin", emphasis: "s’ouvre.", text: "Les lignes du coffret se dévoilent progressivement, au rythme exact de votre défilement." },
  { label: "03 / PIÈCE MAÎTRESSE", title: "Le samouraï", emphasis: "prend forme.", text: "Armure cobalt et énergie carmin : la pièce centrale apparaît au cœur de la capsule." },
  { label: "04 / VUE D’ENSEMBLE", title: "Six pièces.", emphasis: "Une même saga.", text: "La composition s’ouvre pour laisser découvrir le cyber-samouraï, le mini-dragon et les accessoires." },
  { label: "05 / COLLECTION", title: "Tout retrouve", emphasis: "son écrin.", text: "Poursuivez pour refermer le récit — ou remontez pour revoir chaque détail à rebours." },
];
const active = computed(() => chapters[activeChapter.value] ?? chapters[0]!);
const timeLabel = computed(() => {
  const seconds = Math.min(Math.floor(progress.value * duration.value), Math.floor(duration.value));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
});
const durationLabel = computed(() => {
  const seconds = Math.floor(duration.value);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
});
let raf = 0;

function updateProgress() {
  raf = 0;
  const section = track.value;
  if (!section || !import.meta.client) return;

  const rect = section.getBoundingClientRect();
  const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
  const next = Math.min(1, Math.max(0, -rect.top / travel));
  if (Math.abs(next - progress.value) > 0.0015) progress.value = next;

  const nextChapter = Math.min(chapters.length - 1, Math.floor(next * chapters.length));
  if (nextChapter !== activeChapter.value) {
    activeChapter.value = nextChapter;
    emit("chapter", nextChapter);
  }

  const film = video.value;
  if (film && film.readyState >= 1 && Number.isFinite(film.duration) && film.duration > 0) {
    const targetTime = Math.min(film.duration - 0.015, next * film.duration);
    if (Math.abs(film.currentTime - targetTime) > 0.025) film.currentTime = Math.max(0, targetTime);
    if (!film.paused) film.pause();
  }
}

function queueProgress() {
  if (!raf && import.meta.client) raf = window.requestAnimationFrame(updateProgress);
}

function onMetadata() {
  const film = video.value;
  if (film && Number.isFinite(film.duration) && film.duration > 0) duration.value = film.duration;
  film?.pause();
  queueProgress();
}

function jumpToChapter(index: number) {
  const section = track.value;
  if (!section || !import.meta.client) return;
  emit("interaction");
  const start = window.scrollY + section.getBoundingClientRect().top;
  const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
  const targetProgress = (index + 0.45) / chapters.length;
  window.scrollTo({ top: start + travel * targetProgress, behavior: "smooth" });
}

onMounted(() => {
  window.addEventListener("scroll", queueProgress, { passive: true });
  window.addEventListener("resize", queueProgress, { passive: true });
  video.value?.pause();
  queueProgress();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", queueProgress);
  window.removeEventListener("resize", queueProgress);
  if (raf) window.cancelAnimationFrame(raf);
});
</script>

<template>
  <section id="parcours" ref="track" class="scroll-film" aria-label="Film NEON SAGA piloté par le défilement">
    <div class="scroll-film__sticky">
      <div class="scroll-film__ambient" aria-hidden="true"></div>
      <div class="scroll-film__visual">
        <video
          ref="video"
          class="scroll-film__video"
          :src="videoSrc"
          :poster="poster"
          muted
          playsinline
          preload="auto"
          fetchpriority="high"
          aria-label="Film NEON SAGA de 30 secondes, avancé et reculé par le défilement"
          @loadedmetadata="onMetadata"
        />
        <div class="scroll-film__wash" aria-hidden="true"></div>
      </div>

      <div class="scroll-film__topline">
        <span><i class="status-dot"></i> NEON SAGA / COLLECTOR CAPSULE</span>
        <span>FILM <b>30 SEC</b></span>
      </div>

      <Transition name="scroll-copy" mode="out-in">
        <article :key="activeChapter" class="scroll-film__copy">
          <p class="eyebrow"><span class="status-dot"></span>{{ active.label }}</p>
          <h1 v-if="activeChapter === 0">{{ active.title }}<br /><em>{{ active.emphasis }}</em></h1>
          <h2 v-else>{{ active.title }}<br /><em>{{ active.emphasis }}</em></h2>
          <p class="scroll-film__description">{{ active.text }}</p>
          <NuxtLink v-if="activeChapter === 0" class="button button-primary scroll-film__cta" to="/capsule" @click="emit('interaction')">
            Découvrir la capsule <span aria-hidden="true">↘</span>
          </NuxtLink>
          <div v-if="activeChapter === 0" class="scroll-film__facts" aria-label="La Collector Capsule en trois repères">
            <span><b>06</b> pièces</span><span><b>01</b> écrin</span><span><b>∞</b> univers</span>
          </div>
        </article>
      </Transition>

      <div class="scroll-film__position" aria-hidden="true">
        <span>{{ String(activeChapter + 1).padStart(2, "0") }}</span>
        <span class="scroll-film__position-divider"></span>
        <span>{{ String(chapters.length).padStart(2, "0") }}</span>
      </div>

      <nav class="scroll-film__chapters" aria-label="Aller à un chapitre du film">
        <button
          v-for="(chapter, index) in chapters"
          :key="chapter.label"
          type="button"
          :class="{ 'is-active': activeChapter === index }"
          :aria-label="`Aller au chapitre ${index + 1} : ${chapter.title} ${chapter.emphasis}`"
          :aria-current="activeChapter === index ? 'step' : undefined"
          @click="jumpToChapter(index)"
        ><span></span></button>
      </nav>

      <div class="scroll-film__bottomline">
        <span class="scroll-film__hint"><b aria-hidden="true">↓</b> DÉFILEZ POUR AVANCER · REMONTEZ POUR REVENIR</span>
        <span class="scroll-film__time"><b>{{ timeLabel }}</b><i>/</i>{{ durationLabel }}</span>
      </div>
      <div class="scroll-film__progress" role="progressbar" :aria-valuenow="Math.round(progress * 100)" aria-valuemin="0" aria-valuemax="100" :aria-valuetext="`${Math.round(progress * 100)} %, ${timeLabel} sur ${durationLabel}`" aria-label="Progression du film">
        <span :style="{ transform: `scaleX(${progress})` }"></span>
      </div>
      <span class="sr-only" aria-live="polite">{{ active.label }} — {{ active.title }} {{ active.emphasis }}</span>
    </div>
  </section>
</template>
