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
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },
  nitro: {
    prerender: { routes: ["/", "/capsule"], crawlLinks: true },
  },
});
