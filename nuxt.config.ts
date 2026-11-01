import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-01",
  srcDir: "app/",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: false },
  app: {
    head: {
      htmlAttrs: { lang: "fr" },
      title: "NEON SAGA — Collector Capsule",
      meta: [
        {
          name: "description",
          content:
            "La Collector Capsule NEON SAGA : un cyber-samouraï, son dragon mécanique et six pièces à découvrir au fil du scroll.",
        },
        { name: "theme-color", content: "#07101d" },
        { name: "keywords", content: "NEON SAGA, Collector Capsule, figurine cyberpunk, collection, scrollytelling" },
        { property: "og:site_name", content: "NEON SAGA" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: "NEON SAGA — Collector Capsule" },
        { property: "og:description", content: "La Collector Capsule NEON SAGA : un cyber-samouraï, son dragon mécanique et six pièces à découvrir au fil du scroll." },
        { property: "og:image", content: "https://raw.githubusercontent.com/Jehudiel-le-boss/neon-saga/main/public/media/capsule-hero.webp" },
        { property: "og:image:type", content: "image/webp" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "NEON SAGA — Collector Capsule" },
        { name: "twitter:description", content: "La Collector Capsule NEON SAGA : un cyber-samouraï, son dragon mécanique et six pièces à découvrir au fil du scroll." },
        { name: "twitter:image", content: "https://raw.githubusercontent.com/Jehudiel-le-boss/neon-saga/main/public/media/capsule-hero.webp" },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap",
        },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      ],
    },
  },
  nitro: {
    prerender: { routes: ["/", "/capsule"], crawlLinks: true },
  },
});
