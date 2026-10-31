# NEON SAGA — Collector Capsule

## Architecture des pages

- `/` est l’accueil immersif : le film de 30 secondes reste épinglé à l’écran et le défilement, vers le bas comme vers le haut, pilote son timecode et ses chapitres. Cette page ne contient pas les sections éditoriales ou 3D.
- `/capsule`, accessible depuis le lien « La capsule » du menu, rassemble la scène Three.js, les six pièces, les détails de l’écrin et l’univers NEON SAGA.
- Le layout partagé (`app/layouts/default.vue`) conserve l’en-tête, le thème, le choix de la bande-son et le dock audio sur les deux pages.

## Parcours scrollytelling

Le film utilise des images clés rapprochées pour que le scrubbing reste réactif. Les chapitres et textes suivent la même progression que le timecode. La présentation est inspirée de la mécanique de référence, avec les visuels NEON SAGA fournis.

Site vitrine construit avec Nuxt 4 et Vue 3, sans backend applicatif ni base de données. Les médias du brief sont servis depuis le stockage du projet WebDev.

## Développement

```bash
pnpm install
pnpm dev:static
```

Le serveur de développement écoute sur `0.0.0.0` et le port `PORT` transmis par l’environnement (3000 par défaut).

## Vérifications et génération statique

```bash
pnpm check
pnpm build:static
```

Nuxt génère le site prêt à servir sous `.output/public`. Le code est organisé dans `app/pages`, `app/layouts`, `app/components`, `app/composables` et `app/assets`; les ressources statiques sont dans `public`.

## Socle technique

- Nuxt 4 / Vue 3 pour le rendu et le routage.
- Three.js pour la scène 3D interactive du coffret.
- VueUse pour les utilitaires réactifs et les observations d’intersection.
- Lucide Vue pour les icônes vectorielles.
- Aucun serveur métier et aucune base de données ne sont requis.
