<script setup lang="ts">
import { useWindowScroll } from "@vueuse/core";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

defineProps<{ videoSrc: string; poster: string }>();
const emit = defineEmits<{ chapter: [index: number] }>();

const track = ref<HTMLElement | null>(null);
const video = ref<HTMLVideoElement | null>(null);
const progress = ref(0);
const activeChapter = ref(0);
const chapters = [
  { label: "01 / RÉVÉLATION", title: "L’écrin s’éveille.", text: "La transparence du plexiglas laisse d’abord deviner une silhouette. Puis le couvercle s’ouvre et révèle un univers tenu en équilibre." },
  { label: "02 / LES DÉTAILS", title: "Chaque pièce a sa place.", text: "Le samouraï cobalt, son compagnon mécanique et les accessoires apparaissent dans leurs logements, sous des reflets électriques." },
  { label: "03 / VUE ÉCLATÉE", title: "L’objet devient spectacle.", text: "Le coffret se déploie autour de sa pièce centrale. Le regard prend le temps de parcourir chaque détail." },
  { label: "04 / COLLECTION", title: "Tout retrouve son écrin.", text: "Les éléments reviennent à leur place ; la capsule se referme, prête à rejoindre une collection ou une vitrine." },
];
const timeLabel = computed(() => {
  const seconds = Math.floor(progress.value * 30);
  return `00:${String(Math.min(seconds, 30)).padStart(2, "0")}`;
});
const { y } = useWindowScroll({ throttle: 16 });
let raf = 0;

function updateProgress() {
  raf = 0;
  if (!track.value || !import.meta.client) return;
  const rect = track.value.getBoundingClientRect();
  const travel = Math.max(track.value.offsetHeight - window.innerHeight, 1);
  const next = Math.min(1, Math.max(0, -rect.top / travel));
  if (Math.abs(next - progress.value) > 0.003) progress.value = next;

  const index = Math.min(chapters.length - 1, Math.floor(next * chapters.length));
  if (index !== activeChapter.value) {
    activeChapter.value = index;
    emit("chapter", index);
  }

  const element = video.value;
  if (element && element.readyState >= 1 && Number.isFinite(element.duration)) {
    const targetTime = Math.min(element.duration - 0.04, next * element.duration);
    if (Math.abs(element.currentTime - targetTime) > 0.07) element.currentTime = Math.max(0, targetTime);
  }
}

function queueProgress() {
  if (!raf) raf = window.requestAnimationFrame(updateProgress);
}

const stopWatching = watch(y, queueProgress, { flush: "post" });

onMounted(() => {
  video.value?.addEventListener("loadedmetadata", queueProgress);
  queueProgress();
});

onBeforeUnmount(() => {
  stopWatching();
  video.value?.removeEventListener("loadedmetadata", queueProgress);
  if (raf) window.cancelAnimationFrame(raf);
});
</script>

<template>
  <section id="parcours" ref="track" class="story-section" aria-label="La capsule racontée au fil du défilement">
    <div class="story-intro">
      <div>
        <p class="eyebrow"><span class="status-dot"></span> UNE SÉQUENCE À PARCOURIR</p>
        <h2 class="section-title">Le scroll donne<br /><em>le mouvement.</em></h2>
      </div>
      <p class="story-intro__note">Faites défiler la page : le film avance avec vous, de l’ouverture au retour de chaque pièce dans son écrin.</p>
    </div>

    <div class="story-track">
      <div class="story-stage-wrap">
        <div class="story-stage">
          <video ref="video" :src="videoSrc" :poster="poster" muted playsinline preload="metadata" aria-label="Film de présentation NEON SAGA, contrôlé par le défilement" />
          <div class="story-stage__wash"></div>
          <div class="story-stage__top"><span>NEON SAGA / FILM 01</span><span>30 SEC</span></div>
          <div class="story-stage__bottom">
            <span class="story-stage__chapter">{{ chapters[activeChapter]?.label }}</span>
            <span class="story-stage__time">{{ timeLabel }} <span>/ 00:30</span></span>
          </div>
          <div class="story-progress" role="progressbar" :aria-valuenow="Math.round(progress * 100)" aria-valuemin="0" aria-valuemax="100" aria-label="Progression du film">
            <span :style="{ transform: `scaleX(${progress})` }"></span>
          </div>
        </div>
        <p class="story-stage-hint"><span class="scroll-key">↓</span> DÉFILEZ POUR FAIRE AVANCER LE FILM</p>
      </div>

      <div class="story-rail">
        <article v-for="(chapter, index) in chapters" :key="chapter.label" class="story-step" :class="{ 'is-active': activeChapter === index }">
          <span class="story-step__number">{{ chapter.label }}</span>
          <h3>{{ chapter.title }}</h3>
          <p>{{ chapter.text }}</p>
          <span class="story-step__line" aria-hidden="true"></span>
        </article>
      </div>
    </div>
  </section>
</template>
