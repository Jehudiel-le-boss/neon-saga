<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { ref } from "vue";

const target = ref<HTMLElement | null>(null);
const visible = ref(false);
const { stop } = useIntersectionObserver(
  target,
  ([entry]) => {
    if (entry?.isIntersecting) {
      visible.value = true;
      stop();
    }
  },
  { threshold: 0.12 },
);
</script>

<template>
  <div ref="target" class="reveal-block" :class="{ 'is-visible': visible }">
    <slot />
  </div>
</template>
