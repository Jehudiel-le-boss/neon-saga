<script setup lang="ts">
import { ref } from "vue";
import { useSiteSound } from "~/composables/useSiteSound";

const media = {
  video: "/media/neon-saga-scroll-scrub.mp4",
  poster: "/media/capsule-hero.webp",
};
const activeChapter = ref(0);
const playUiSound = useSiteSound();

function onChapterChange(index: number) {
  if (index !== activeChapter.value) {
    activeChapter.value = index;
    playUiSound(550 + index * 80);
  }
}

useSeoMeta({
  title: "NEON SAGA — Le film au fil du scroll",
  description: "Faites défiler le film NEON SAGA : une expérience de 30 secondes où chaque mouvement révèle la Collector Capsule et ses pièces.",
  ogType: "website",
  ogTitle: "NEON SAGA — Le film au fil du scroll",
  ogDescription: "Une expérience de 30 secondes où chaque mouvement révèle la Collector Capsule et ses pièces.",
  ogImage: "https://raw.githubusercontent.com/Jehudiel-le-boss/neon-saga/main/public/media/capsule-hero.webp",
  ogImageAlt: "Collector Capsule NEON SAGA dans une lumière bleu électrique et carmin",
  twitterCard: "summary_large_image",
  twitterTitle: "NEON SAGA — Le film au fil du scroll",
  twitterDescription: "Une expérience de 30 secondes où chaque mouvement révèle la Collector Capsule et ses pièces.",
  twitterImage: "https://raw.githubusercontent.com/Jehudiel-le-boss/neon-saga/main/public/media/capsule-hero.webp",
  twitterImageAlt: "Collector Capsule NEON SAGA dans une lumière bleu électrique et carmin",
});
useHead({
  meta: [{ name: "keywords", content: "NEON SAGA, Collector Capsule, film immersif, vidéo pilotée par le scroll, figurine cyberpunk" }],
});
</script>

<template>
  <main class="home-film">
    <StoryScroll :video-src="media.video" :poster="media.poster" @chapter="onChapterChange" @interaction="playUiSound(720)" />
  </main>
</template>
