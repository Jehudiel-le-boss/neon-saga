<script setup lang="ts">
import { ArrowRight, Headphones, Volume2, VolumeX } from "@lucide/vue";

defineProps<{ visible: boolean }>();
const emit = defineEmits<{ choose: [withSound: boolean] }>();
</script>

<template>
  <Transition name="gate-fade">
    <div v-if="visible" class="sound-gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div class="gate-card">
        <div class="gate-topline"><span class="status-dot"></span> NEON SAGA <span class="gate-topline__line"></span> IMMERSION</div>
        <div class="gate-emblem"><Headphones :size="22" stroke-width="1.5" /></div>
        <p class="eyebrow">AVANT D’ENTRER DANS LA CAPSULE</p>
        <h2 id="gate-title">Votre immersion.<br /><em>Votre rythme.</em></h2>
        <p class="gate-copy">Une bande-son originale et de subtils sons d’interface accompagnent la découverte. Vous pourrez régler le volume ou couper le son à tout moment.</p>
        <div class="gate-actions">
          <button class="button button-primary gate-button" type="button" @click="emit('choose', true)">
            <Volume2 :size="17" /> Entrer avec le son <ArrowRight :size="16" />
          </button>
          <button class="button button-quiet gate-button" type="button" @click="emit('choose', false)">
            <VolumeX :size="17" /> Entrer sans le son
          </button>
        </div>
        <div class="gate-footnote"><span>FILM 30 SEC</span><span>·</span><span>SON CONTRÔLABLE</span><span>·</span><span>CHOIX LIBRE</span></div>
      </div>
    </div>
  </Transition>
</template>
