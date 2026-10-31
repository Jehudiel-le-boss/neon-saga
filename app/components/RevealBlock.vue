<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { ref } from "vue";

type RevealDirection = "up" | "left" | "right" | "scale";
const props = withDefaults(defineProps<{ delay?: number; direction?: RevealDirection }>(), {
  delay: 0,
  direction: "up",
});

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
  <div
    ref="target"
    class="reveal-block"
    :class="[`reveal-block--${props.direction}`, { 'is-visible': visible }]"
    :style="{ transitionDelay: `${props.delay}ms` }"
  >
    <slot />
  </div>
</template>
