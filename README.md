# NEON SAGA — Collector Capsule

## Parcours scrollytelling

Le premier écran épingle le film NEON SAGA pendant toute sa séquence : le défilement fait avancer le timecode, le scroll vers le haut le fait reculer, et cinq jalons éditoriaux suivent la progression. La vidéo est encodée avec des images clés rapprochées pour rendre le scrubbing réactif.

Site vitrine immersif construit avec Nuxt 4 et Vue 3, sans backend applicatif ni base de données. Les médias du brief NEON SAGA sont servis depuis le stockage du projet WebDev.

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

Nuxt génère le site prêt à servir sous `.output/public`. Le code est organisé en `app/pages`, `app/components`, `app/composables` et `app/assets`, avec les médias dans le stockage WebDev et les ressources statiques dans `public`.

## Socle technique

- Nuxt 4 / Vue 3 pour le rendu et le routage.
- Three.js pour la scène 3D interactive du coffret.
- VueUse pour les utilitaires réactifs et les interactions liées au scroll.
- VueUse pour les utilitaires réactifs et les observations d’intersection; le timecode vidéo est synchronisé au scroll avec une mise à jour par frame.
- Lucide Vue pour les icônes vectorielles.
- Aucun serveur métier et aucune base de données ne sont requis.
