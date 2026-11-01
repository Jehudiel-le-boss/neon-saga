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
  title: "NEON SAGA — L’expérience immersive",
  description: "Faites défiler le film NEON SAGA : une expérience de 30 secondes où chaque mouvement révèle la Collector Capsule.",
});
</script>

<template>
  <main class="home-film">
    <StoryScroll :video-src="media.video" :poster="media.poster" @chapter="onChapterChange" @interaction="playUiSound(720)" />
  </main>
</template>
