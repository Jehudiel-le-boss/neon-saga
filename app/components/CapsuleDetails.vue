<script setup lang="ts">
import { ArrowRight, Move3D, Rotate3D } from "@lucide/vue";
import { onBeforeUnmount, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useSiteSound } from "~/composables/useSiteSound";

const media = {
  top: "/manus-storage/capsule-top_d8baa549.webp",
  open: "/manus-storage/capsule-open_b90a1d03.webp",
  exploded: "/manus-storage/capsule-exploded_193e25bd.webp",
  figure: "/manus-storage/cyber-samurai_4e27a167.webp",
  dragon: "/manus-storage/pulse-dragon_f419c303.webp",
  card: "/manus-storage/holo-card_7b1433f0.webp",
  accessories: "/manus-storage/pin-sword_e1092a47.webp",
};

const capsuleOpen = ref(false);
const capsuleSceneMount = ref<HTMLElement | null>(null);
const capsuleSceneVisible = ref(false);
const playUiSound = useSiteSound();
const { stop: stopSceneObserver } = useIntersectionObserver(
  capsuleSceneMount,
  ([entry]) => {
    if (entry?.isIntersecting) {
      capsuleSceneVisible.value = true;
      stopSceneObserver();
    }
  },
  { rootMargin: "280px 0px" },
);

function toggleCapsule() {
  capsuleOpen.value = !capsuleOpen.value;
  playUiSound(capsuleOpen.value ? 760 : 540);
}

onBeforeUnmount(() => stopSceneObserver());
</script>

<template>
  <main class="capsule-page">
    <section id="capsule" class="capsule-section section-shell" aria-labelledby="capsule-title">
      <div class="capsule-copy">
        <RevealBlock>
          <p class="eyebrow"><span class="status-dot"></span> OBJET / 3D INTERACTIVE</p>
          <h1 id="capsule-title" class="section-title">L’écrin devient<br /><em>une scène.</em></h1>
          <p class="section-copy">Bords polis, rails bleu électrique, clips carmin. Sous le plexiglas, un insert en velours noir maintient chaque pièce dans son propre logement.</p>
          <div class="capsule-specs">
            <div><span>01</span><p><strong>PLEXIGLAS POLI</strong><small>La lumière traverse, le détail reste.</small></p></div>
            <div><span>02</span><p><strong>INTÉRIEUR VELOURS</strong><small>Une place dédiée à chaque objet.</small></p></div>
            <div><span>03</span><p><strong>BLEU / CARMIN</strong><small>Deux accents, une signature.</small></p></div>
          </div>
          <button class="button button-outline capsule-open-button" type="button" :aria-pressed="capsuleOpen" @click="toggleCapsule">
            <Rotate3D :size="16" /> {{ capsuleOpen ? "Refermer le couvercle" : "Ouvrir le couvercle 3D" }}
          </button>
        </RevealBlock>
      </div>
      <div ref="capsuleSceneMount" class="capsule-visual-wrap">
        <LazyCapsuleScene v-if="capsuleSceneVisible" :poster="media.open" :open="capsuleOpen" />
        <div v-else class="capsule-scene" role="img" aria-label="Aperçu du coffret NEON SAGA ouvert">
          <img class="capsule-scene__fallback" :src="media.open" alt="Coffret NEON SAGA ouvert et ses pièces" loading="lazy" decoding="async" />
          <div class="capsule-scene__grain" aria-hidden="true"></div>
          <div class="capsule-scene__label"><span class="status-dot"></span> MODÈLE 3D / INTERACTIF</div>
          <div class="capsule-scene__instruction">Chargement du modèle 3D à l’approche</div>
        </div>
        <div class="capsule-visual-caption"><span>NEON SAGA / OBJET 01</span><span><Move3D :size="13" /> GLISSER POUR OBSERVER</span></div>
      </div>
    </section>

    <section id="pieces" class="pieces-section section-shell" aria-labelledby="pieces-title">
      <div class="section-heading">
        <RevealBlock>
          <p class="eyebrow"><span class="status-dot"></span> INVENTAIRE / 06 ÉLÉMENTS</p>
          <h2 id="pieces-title" class="section-title">Six pièces.<br /><em>Une même saga.</em></h2>
        </RevealBlock>
        <p class="section-heading__aside">Chaque élément a été imaginé pour vivre dans l’écrin — ou en dehors. Approchez-vous des détails.</p>
      </div>
      <div class="piece-grid">
        <RevealBlock><PieceCard number="01" category="PIÈCE CENTRALE" title="Cyber-Samouraï" description="Armure cobalt, détails argentés et foulard d’énergie rouge sur son socle translucide bleu." :image="media.figure" alt="Figurine de cyber-samouraï en armure cobalt" @interact="playUiSound(690)" /></RevealBlock>
        <RevealBlock><PieceCard number="02" category="COMPAGNON MÉCANIQUE" title="Mini-dragon Pulse" description="Un compagnon bleu nuit, ailes translucides et accents carmin." :image="media.dragon" alt="Mini-dragon mécanique bleu nuit et rouge" @interact="playUiSound(740)" /></RevealBlock>
        <RevealBlock><PieceCard number="03" category="ART HOLOGRAPHIQUE" title="Carte d’art" description="Une silhouette originale capturée dans une lumière irisée." :image="media.card" alt="Carte d’art holographique NEON SAGA" @interact="playUiSound(790)" /></RevealBlock>
        <RevealBlock><PieceCard number="04" category="ÉMAIL / DOUBLE ÉCLAIR" title="Pin émaillé" description="Bleu, rouge et contour métal argenté : le symbole de la capsule." :image="media.accessories" alt="Pin émaillé bleu et rouge à symbole éclair double" @interact="playUiSound(640)" /></RevealBlock>
        <RevealBlock><PieceCard number="05" category="LAME / FINITION SATINÉE" title="Mini-épée" description="Lame argentée, garde carmin et fourreau bleu nuit." :image="media.accessories" alt="Mini-épée argentée avec garde rouge et fourreau bleu nuit" @interact="playUiSound(710)" /></RevealBlock>
        <RevealBlock><PieceCard number="06" category="ACCESSOIRE DE SOIN" title="Tissu microfibre" description="Noir profond, liseré bleu et pliage premium." :image="media.top" alt="Vue du dessus du coffret et du tissu microfibre noir à liseré bleu" @interact="playUiSound(560)" /></RevealBlock>
      </div>
    </section>

    <section id="univers" class="universe-section" aria-labelledby="universe-title">
      <div class="universe-image">
        <img :src="media.exploded" alt="Vue éclatée de la Collector Capsule NEON SAGA et de ses pièces" loading="lazy" decoding="async" />
        <span class="universe-image__tag">NEON SAGA / VUE ÉCLATÉE</span>
      </div>
      <div class="universe-copy">
        <RevealBlock>
          <p class="eyebrow"><span class="status-dot"></span> L’UNIVERS / DANS LES DÉTAILS</p>
          <h2 id="universe-title" class="section-title">Le futur<br />se collectionne<br /><em>au présent.</em></h2>
          <p class="section-copy">NEON SAGA transforme l’ouverture d’un coffret en moment de galerie. Une composition nette, une lumière bleue et rouge, et des pièces qui gardent chacune leur identité.</p>
          <NuxtLink class="text-link" to="/#parcours" @click="playUiSound(680)">Revoir le film <ArrowRight :size="16" /></NuxtLink>
        </RevealBlock>
      </div>
    </section>

    <section class="closing-section" aria-labelledby="closing-title">
      <div class="closing-glow" aria-hidden="true"></div>
      <RevealBlock>
        <p class="eyebrow"><span class="status-dot"></span> COLLECTION / NEON SAGA</p>
        <h2 id="closing-title">Tout un monde.<br /><em>Dans son écrin.</em></h2>
        <p>Une capsule à ouvrir, à explorer, puis à garder en vue.</p>
        <NuxtLink class="button button-primary" to="/#parcours" @click="playUiSound(820)">Revenir au film <ArrowRight :size="16" /></NuxtLink>
      </RevealBlock>
    </section>
  </main>

  <footer class="site-footer">
    <NuxtLink class="footer-wordmark" to="/">NEON <span>SAGA</span></NuxtLink>
    <p>COLLECTOR CAPSULE <span>·</span> UNIVERS ORIGINAL</p>
    <NuxtLink to="#top" class="footer-top">HAUT DE PAGE ↑</NuxtLink>
  </footer>
</template>
