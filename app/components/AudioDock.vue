<script setup lang="ts">
import { Volume2, VolumeX } from "@lucide/vue";

const props = defineProps<{ enabled: boolean; volume: number; playing: boolean }>();
const emit = defineEmits<{ toggle: []; "update:volume": [value: number] }>();

function updateVolume(event: Event) {
  emit("update:volume", Number((event.target as HTMLInputElement).value));
}
</script>

<template>
  <aside class="audio-dock" aria-label="Contrôles sonores">
    <button class="audio-toggle" type="button" :aria-label="props.enabled ? 'Couper le son' : 'Activer le son'" @click="emit('toggle')">
      <Volume2 v-if="props.enabled" :size="17" />
      <VolumeX v-else :size="17" />
    </button>
    <div class="audio-dock__body">
      <div class="audio-dock__top"><span>{{ props.enabled ? "IMMERSION SONORE" : "SON DÉSACTIVÉ" }}</span><span class="audio-status" :class="{ 'is-playing': props.playing && props.enabled }"><i></i><i></i><i></i></span></div>
      <label class="sr-only" for="site-volume">Volume de l’ambiance sonore</label>
      <input id="site-volume" type="range" min="0" max="1" step="0.01" :value="props.volume" :disabled="!props.enabled" @input="updateVolume" />
    </div>
    <output class="audio-volume">{{ Math.round(props.volume * 100) }}%</output>
  </aside>
</template>
