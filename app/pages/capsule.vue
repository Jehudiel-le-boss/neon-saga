<script setup lang="ts">
const capsuleTitle = "La Collector Capsule 3D — NEON SAGA";
const capsuleDescription = "Explorez l’écrin interactif, les six pièces de collection et l’univers NEON SAGA dans une présentation 3D animée au fil du scroll.";
const capsuleImage = "https://raw.githubusercontent.com/Jehudiel-le-boss/neon-saga/main/public/media/capsule-open.webp";

useSeoMeta({
  title: capsuleTitle,
  description: capsuleDescription,
  ogType: "website",
  ogTitle: capsuleTitle,
  ogDescription: capsuleDescription,
  ogImage: capsuleImage,
  ogImageAlt: "Coffret NEON SAGA ouvert et ses pièces de collection",
  twitterCard: "summary_large_image",
  twitterTitle: capsuleTitle,
  twitterDescription: capsuleDescription,
  twitterImage: capsuleImage,
  twitterImageAlt: "Coffret NEON SAGA ouvert et ses pièces de collection",
});
useHead({
  meta: [{ name: "keywords", content: "NEON SAGA, capsule de collection, figurine cyberpunk, coffret 3D, accessoires collector" }],
});
</script>

<template>
  <CapsuleDetails />
</template>
