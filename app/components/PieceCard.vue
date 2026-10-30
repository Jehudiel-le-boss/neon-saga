<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue";

defineProps<{
  number: string;
  category: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}>();
const emit = defineEmits<{ interact: [] }>();
</script>

<template>
  <article class="piece-card" @pointerenter="emit('interact')">
    <div class="piece-card__image">
      <img :src="image" :alt="alt" loading="lazy" decoding="async" />
      <span class="piece-card__number">{{ number }}</span>
      <span class="piece-card__corner"><ArrowUpRight :size="16" /></span>
    </div>
    <div class="piece-card__body">
      <p class="piece-card__category">{{ category }}</p>
      <h3>{{ title }}</h3>
      <p class="piece-card__description">{{ description }}</p>
    </div>
  </article>
</template>
