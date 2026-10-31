# TODO — NEON SAGA — Collector Capsule

## Parcours et contenu
- [x] Construire le site vitrine avec Nuxt/Vue, en modules et composants réutilisables, pour faciliter son évolution ; le projet reste statique, sans base de données.
- [x] Créer une page de présentation immersive et professionnelle, organisée comme une narration visuelle autour de la Collector Capsule NEON SAGA.
- [x] Intégrer la vidéo de 30 secondes au parcours de page et synchroniser sa progression ou ses séquences avec le défilement, plutôt que de la limiter à une bannière d’accueil.
- [x] Reproduire la mécanique de la vidéo de référence sans reprendre son visuel automobile : l’objet NEON SAGA reste épinglé au viewport pendant le récit ; le défilement fait avancer la séquence, le défilement vers le haut la fait reculer, et l’image reste stable quand l’utilisateur s’arrête ; les chapitres et textes changent avec la même progression.
- [x] Faire réellement défiler une colonne de textes empilés du bas vers le haut selon la même progression que la page ; chaque chapitre sort par le haut et le suivant entre par le bas, sans défilement automatique.
- [x] Faire de la page d’accueil une expérience centrée sur la vidéo, les textes synchronisés et le scroll ; déplacer tout le contenu qui commence par « OBJET / 3D INTERACTIVE — L’écrin devient une scène. » sur une page « La capsule » accessible depuis le menu.
- [x] Présenter le coffret à partir des visuels NEON SAGA fournis, puis mettre en valeur séparément les accessoires inclus avec images, intitulés et descriptions.
- [x] Ajouter des sections éditoriales sur l’univers, le concept et le caractère collector de NEON SAGA.
- [x] Employer des bibliothèques populaires et maintenues, dont une bibliothèque d’icônes, dans une architecture claire et réutilisable.

## Interactions et direction visuelle
- [x] Ajouter une présentation 3D interactive du coffret avec Three.js, adaptée au pointeur et au tactile.
- [x] Proposer au visiteur d’entrer avec ou sans son ; ajouter un retour sonore aux interactions.
- [x] Fournir des commandes accessibles pour couper le son et régler son volume.
- [x] Créer une direction visuelle bleue soignée et proposer un mode sombre.
- [x] Déclencher au changement de thème une transition lumineuse remarquable qui part du bouton clair/sombre et révèle le nouveau thème ; respecter la préférence de mouvement réduit.
- [x] Sur /capsule, synchroniser au scroll la progression visuelle, les révélations séquencées des sections et un mouvement maîtrisé de l’objet 3D ; conserver le contrôle manuel et respecter la préférence de mouvement réduit.
- [x] Ajouter des transitions et animations fluides au service de la découverte progressive du produit.

## Responsive et performance
- [x] Rendre l’expérience utilisable sur desktop et mobile, avec adaptation des médias et des interactions tactiles.
- [x] Optimiser le chargement des images et de la vidéo afin de conserver une navigation fluide pendant le scrub du clip.
- [x] Garder le projet sans backend et sans base de données.
