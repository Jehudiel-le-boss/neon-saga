<script setup lang="ts">
import { ArrowRight, Volume2, VolumeX } from "@lucide/vue";

defineProps<{ visible: boolean }>();
const emit = defineEmits<{ choose: [withSound: boolean] }>();
</script>

<template>
  <Transition name="gate-fade">
    <div v-if="visible" class="sound-gate" role="region" aria-labelledby="gate-title" aria-label="Choix de la bande-son">
      <div class="gate-card">
        <div class="gate-topline"><span class="status-dot"></span> NEON SAGA <span class="gate-topline__line"></span> SON</div>
        <h2 id="gate-title">La bande-son <em>à votre choix.</em></h2>
        <p class="gate-copy">Le film reste muet jusqu’à votre accord.</p>
        <div class="gate-actions">
          <button class="button button-primary gate-button" type="button" @click="emit('choose', true)">
            <Volume2 :size="15" /> Avec le son <ArrowRight :size="13" />
          </button>
          <button class="button button-quiet gate-button" type="button" @click="emit('choose', false)">
            <VolumeX :size="15" /> Sans le son
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
