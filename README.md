# NEON SAGA — Collector Capsule

Site vitrine immersif pour le projet NEON SAGA, créé par [Jehudiel le boss](https://github.com/Jehudiel-le-boss).

## L’expérience

- **Accueil (`/`)** — un film de 30 secondes épinglé à l’écran. Le scroll, vers le bas ou vers le haut, pilote son timecode et fait réellement défiler le rail de textes de chapitre.
- **La capsule (`/capsule`)** — présentation 3D interactive du coffret, six pièces, révélations séquencées au scroll et rotation du modèle liée à la progression.
- **Commandes partagées** — choix d’entrée avec ou sans musique, contrôle du volume, sons de clic générés en Web Audio, thèmes clair/sombre avec transition radiale et scrollbar assortie au thème.
- **Partage et identité** — métadonnées SEO/Open Graph propres aux pages et favicon vectoriel NEON SAGA.
- **Accessibilité** — prise en compte de la préférence système de mouvement réduit.

Le projet est un site vitrine statique : pas de base de données, de serveur applicatif, de compte utilisateur ou de paiement.

## Stack

Nuxt 4 et Vue 3 pour les pages et le rendu, TypeScript, Three.js pour le coffret 3D, VueUse pour les utilitaires réactifs et `@lucide/vue` pour les icônes.

## Développement

Prérequis : Node.js et pnpm (`pnpm@10.18.0`, déclaré dans `package.json`).

```bash
pnpm install --frozen-lockfile
pnpm dev:static
```

Le serveur de développement écoute sur `0.0.0.0` et utilise le port `PORT` transmis par l’environnement, ou `3000` par défaut.

## Vérification et build statique

```bash
pnpm check
pnpm build:static
```

Le site généré se trouve dans `.output/public` et peut être déployé sur un hébergement statique compatible.

## Organisation du code

- `app/pages/` contient les routes Nuxt `/` et `/capsule`.
- `app/layouts/default.vue` partage l’en-tête, le thème et les commandes audio.
- `app/components/` contient les scènes, la narration, les cartes et les contrôles réutilisables.
- `app/composables/` regroupe les fonctions partagées côté Vue.
- `app/assets/css/` contient le système visuel et les animations.
- `public/manus-routes.json` déclare les routes au projet WebDev.
- `public/favicon.svg` fournit l’icône de l’onglet.
- `public/media/` contient la vidéo, la musique et les visuels utilisés par le site.

## Médias

Les médias sont inclus dans Git et copiés dans le build statique par Nuxt; le site ne dépend plus des chemins `/manus-storage/...`.

- `public/media/neon-saga-scroll-scrub.mp4` — vidéo H.264 de 30 secondes, en 16:9 (1344 × 756), conçue pour le scrubbing au scroll.
- `public/media/neon-saga-ambience.mp3` — ambiance musicale en boucle.
- `public/media/` contient aussi l’affiche de la capsule, les vues du coffret, le cyber-samouraï, le mini-dragon, la carte holographique et l’accessoire.


## Rendu vidéo

Le master inclus fait 30 secondes en H.264, 24 i/s et 1344 × 756. La scène conserve le cadre 16:9 complet et limite son rendu desktop à cette définition native : elle ne rajoute ni zoom CSS ni agrandissement artificiel sur écran large. La lueur d’ambiance remplit l’espace autour de l’image sans recadrer le film.
