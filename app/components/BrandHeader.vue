<script setup lang="ts">
import { Menu, Moon, Sun, X } from "@lucide/vue";
import { ref } from "vue";

const props = defineProps<{ theme: "dark" | "light" }>();
const emit = defineEmits<{ toggleTheme: [] }>();
const menuOpen = ref(false);

const links = [
  { to: "/#parcours", label: "Le film" },
];
</script>

<template>
  <header class="site-header">
    <NuxtLink class="brand-lockup" to="/" aria-label="NEON SAGA — accueil immersif" @click="menuOpen = false">
      <span class="brand-sigil" aria-hidden="true">
        <svg viewBox="0 0 36 36" fill="none">
          <path d="M18 3 31 10.5v15L18 33 5 25.5v-15L18 3Z" stroke="currentColor" stroke-width="1.4" />
          <path d="m20.5 8-8 10h5l-2 10 8-11h-5l2-9Z" fill="currentColor" />
        </svg>
      </span>
      <span class="brand-wordmark"><strong>NEON</strong><span>SAGA</span></span>
      <span class="brand-divider" aria-hidden="true"></span>
      <span class="brand-caption">COLLECTOR<br />CAPSULE</span>
    </NuxtLink>

    <button
      class="mobile-menu-toggle icon-button"
      type="button"
      :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
      :aria-expanded="menuOpen"
      @click="menuOpen = !menuOpen"
    >
      <X v-if="menuOpen" :size="19" />
      <Menu v-else :size="19" />
    </button>

    <nav class="main-navigation" :class="{ 'is-open': menuOpen }" aria-label="Navigation principale">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" @click="menuOpen = false">{{ link.label }}</NuxtLink>
      <NuxtLink class="nav-cta" to="/capsule" @click="menuOpen = false">La capsule <span aria-hidden="true">↗</span></NuxtLink>
    </nav>

    <button
      class="theme-toggle icon-button"
      type="button"
      :aria-label="props.theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'"
      :title="props.theme === 'dark' ? 'Mode clair' : 'Mode sombre'"
      @click="emit('toggleTheme')"
    >
      <Sun v-if="props.theme === 'dark'" :size="17" />
      <Moon v-else :size="17" />
    </button>
  </header>
</template>
