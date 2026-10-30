<script setup lang="ts">
import { ArrowDownRight, ArrowRight, Move3D, Rotate3D, Sparkles } from "@lucide/vue";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const media = {
  video: "/manus-storage/neon-saga-scroll_978038a2.mp4",
  music: "/manus-storage/neon-saga-ambience_0a885fa9.mp3",
  hero: "/manus-storage/capsule-hero_4839566a.webp",
  mobile: "/manus-storage/capsule-mobile_54604945.webp",
  top: "/manus-storage/capsule-top_d8baa549.webp",
  open: "/manus-storage/capsule-open_b90a1d03.webp",
  exploded: "/manus-storage/capsule-exploded_193e25bd.webp",
  figure: "/manus-storage/cyber-samurai_4e27a167.webp",
  dragon: "/manus-storage/pulse-dragon_f419c303.webp",
  card: "/manus-storage/holo-card_7b1433f0.webp",
  accessories: "/manus-storage/pin-sword_e1092a47.webp",
};

const entered = ref(false);
const soundEnabled = ref(false);
const playing = ref(false);
const volume = ref(0.42);
const theme = ref<"dark" | "light">("dark");
const capsuleOpen = ref(false);
const activeChapter = ref(0);
const capsuleSceneMount = ref<HTMLElement | null>(null);
const capsuleSceneVisible = ref(false);
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
const audioElement = ref<HTMLAudioElement | null>(null);
const audioContext = ref<AudioContext | null>(null);

function playUiSound(frequency = 680) {
  if (!import.meta.client || !soundEnabled.value || volume.value <= 0) return;
  try {
    const Context = window.AudioContext;
    if (!audioContext.value) audioContext.value = new Context();
    const context = audioContext.value;
    if (context.state === "suspended") void context.resume();
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const now = context.currentTime;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.16, now + 0.08);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.038 * volume.value), now + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);
    oscillator.connect(envelope);
    envelope.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  } catch {
    // Audio feedback is an enhancement; the page remains fully usable without Web Audio support.
  }
}

async function startMusic() {
  const audio = audioElement.value;
  if (!audio) return;
  audio.volume = volume.value;
  try {
    await audio.play();
  } catch {
    playing.value = false;
  }
}

function enterExperience(withSound: boolean) {
  entered.value = true;
  soundEnabled.value = withSound;
  if (withSound) {
    void startMusic();
    window.setTimeout(() => playUiSound(740), 100);
  } else {
    audioElement.value?.pause();
  }
}

function toggleSound() {
  if (soundEnabled.value) {
    playUiSound(510);
    soundEnabled.value = false;
    audioElement.value?.pause();
    return;
  }
  soundEnabled.value = true;
  void startMusic();
  window.setTimeout(() => playUiSound(740), 80);
}

function updateVolume(nextVolume: number) {
  volume.value = Math.max(0, Math.min(1, nextVolume));
  if (audioElement.value) audioElement.value.volume = volume.value;
}

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
  playUiSound(theme.value === "dark" ? 720 : 560);
}

function toggleCapsule() {
  capsuleOpen.value = !capsuleOpen.value;
  playUiSound(capsuleOpen.value ? 760 : 540);
}

function onChapterChange(index: number) {
  if (index !== activeChapter.value) {
    activeChapter.value = index;
    playUiSound(550 + index * 80);
  }
}

watch(theme, value => {
  if (!import.meta.client) return;
  document.documentElement.dataset.theme = value;
  try { localStorage.setItem("neon-saga-theme", value); } catch { /* Storage can be unavailable in private contexts. */ }
});

watch(volume, value => {
  if (audioElement.value) audioElement.value.volume = value;
});

onMounted(() => {
  try {
    const saved = localStorage.getItem("neon-saga-theme");
    if (saved === "light" || saved === "dark") theme.value = saved;
  } catch { /* Keep the dark default when storage is unavailable. */ }
  document.documentElement.dataset.theme = theme.value;
  if (audioElement.value) audioElement.value.volume = volume.value;
});

onBeforeUnmount(() => {
  stopSceneObserver();
  audioElement.value?.pause();
  if (audioContext.value && audioContext.value.state !== "closed") void audioContext.value.close();
});
</script>

<template>
  <div id="top" class="site-shell">
    <BrandHeader :theme="theme" @toggle-theme="toggleTheme" />

    <main>
      <section class="hero-section" aria-labelledby="hero-title">
        <div class="hero-grid-bg" aria-hidden="true"></div>
        <div class="hero-copy">
          <p class="eyebrow hero-eyebrow"><span class="status-dot"></span> NEON SAGA / COLLECTOR CAPSULE</p>
          <h1 id="hero-title">Un univers.<br /><em>À portée de main.</em></h1>
          <p class="hero-intro">Le rituel de l’unboxing devient une expérience de collection. Six pièces singulières, réunies dans un écrin pensé pour être exposé.</p>
          <a class="button button-primary hero-cta" href="#parcours" @click="playUiSound(720)">
            Explorer la capsule <ArrowDownRight :size="17" />
          </a>
          <div class="hero-facts" aria-label="Caractéristiques de la capsule">
            <div><strong>06</strong><span>PIÈCES<br />INCLUSES</span></div>
            <div><strong>01</strong><span>ÉCRIN<br />TRANSPARENT</span></div>
            <div><strong>∞</strong><span>UNIVERS<br />À EXPLORER</span></div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-orbit hero-orbit--one" aria-hidden="true"></div>
          <div class="hero-orbit hero-orbit--two" aria-hidden="true"></div>
          <picture class="hero-picture">
            <source :srcset="media.mobile" media="(max-width: 700px)" />
            <img :src="media.hero" alt="Collector Capsule NEON SAGA ouverte, avec le cyber-samouraï et ses accessoires" fetchpriority="high" decoding="async" />
          </picture>
          <div class="hero-visual-label"><span>CAPSULE / 001</span><span>COLLECTOR SERIES</span></div>
          <div class="hero-visual-index"><Sparkles :size="16" /><span>UNE PIÈCE<br />À EXPOSER</span></div>
        </div>
        <a class="hero-scroll-cue" href="#parcours" aria-label="Défiler vers le parcours" @click="playUiSound(600)"><span class="scroll-cue-line"></span><span>FAITES DÉFILER</span></a>
      </section>

      <StoryScroll :video-src="media.video" :poster="media.hero" @chapter="onChapterChange" />

      <section id="capsule" class="capsule-section section-shell" aria-labelledby="capsule-title">
        <div class="capsule-copy">
          <RevealBlock>
            <p class="eyebrow"><span class="status-dot"></span> OBJET / 3D INTERACTIVE</p>
            <h2 id="capsule-title" class="section-title">L’écrin devient<br /><em>une scène.</em></h2>
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
          <RevealBlock>
            <PieceCard number="01" category="PIÈCE CENTRALE" title="Cyber-Samouraï" description="Armure cobalt, détails argentés et foulard d’énergie rouge sur son socle translucide bleu." :image="media.figure" alt="Figurine de cyber-samouraï en armure cobalt" @interact="playUiSound(690)" />
          </RevealBlock>
          <RevealBlock>
            <PieceCard number="02" category="COMPAGNON MÉCANIQUE" title="Mini-dragon Pulse" description="Un compagnon bleu nuit, ailes translucides et accents carmin." :image="media.dragon" alt="Mini-dragon mécanique bleu nuit et rouge" @interact="playUiSound(740)" />
          </RevealBlock>
          <RevealBlock>
            <PieceCard number="03" category="ART HOLOGRAPHIQUE" title="Carte d’art" description="Une silhouette originale capturée dans une lumière irisée." :image="media.card" alt="Carte d’art holographique NEON SAGA" @interact="playUiSound(790)" />
          </RevealBlock>
          <RevealBlock>
            <PieceCard number="04" category="ÉMAIL / DOUBLE ÉCLAIR" title="Pin émaillé" description="Bleu, rouge et contour métal argenté : le symbole de la capsule." :image="media.accessories" alt="Pin émaillé bleu et rouge à symbole éclair double" @interact="playUiSound(640)" />
          </RevealBlock>
          <RevealBlock>
            <PieceCard number="05" category="LAME / FINITION SATINÉE" title="Mini-épée" description="Lame argentée, garde carmin et fourreau bleu nuit." :image="media.accessories" alt="Mini-épée argentée avec garde rouge et fourreau bleu nuit" @interact="playUiSound(710)" />
          </RevealBlock>
          <RevealBlock>
            <PieceCard number="06" category="ACCESSOIRE DE SOIN" title="Tissu microfibre" description="Noir profond, liseré bleu et pliage premium." :image="media.top" alt="Vue du dessus du coffret et du tissu microfibre noir à liseré bleu" @interact="playUiSound(560)" />
          </RevealBlock>
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
            <a class="text-link" href="#top" @click="playUiSound(680)">Revoir la capsule <ArrowRight :size="16" /></a>
          </RevealBlock>
        </div>
      </section>

      <section class="closing-section" aria-labelledby="closing-title">
        <div class="closing-glow" aria-hidden="true"></div>
        <RevealBlock>
          <p class="eyebrow"><span class="status-dot"></span> COLLECTION / NEON SAGA</p>
          <h2 id="closing-title">Tout un monde.<br /><em>Dans son écrin.</em></h2>
          <p>Une capsule à ouvrir, à explorer, puis à garder en vue.</p>
          <a class="button button-primary" href="#top" @click="playUiSound(820)">Revenir au début <ArrowRight :size="16" /></a>
        </RevealBlock>
      </section>
    </main>

    <footer class="site-footer">
      <a class="footer-wordmark" href="#top">NEON <span>SAGA</span></a>
      <p>COLLECTOR CAPSULE <span>·</span> UNIVERS ORIGINAL</p>
      <a href="#top" class="footer-top">HAUT DE PAGE ↑</a>
    </footer>

    <audio ref="audioElement" :src="media.music" preload="none" loop @play="playing = true" @pause="playing = false" @ended="playing = false" />
    <AudioDock v-if="entered" :enabled="soundEnabled" :volume="volume" :playing="playing" @toggle="toggleSound" @update:volume="updateVolume" />
    <SoundGate :visible="!entered" @choose="enterExperience" />
  </div>
</template>
