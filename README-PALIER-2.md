# Palier 2 - séparation des contenus

## Objectif
Le navigateur ne reçoit plus les surprises dans `app.js`. Une surprise publiée est chargée depuis `contents/day-XX.json`.

## Démonstration
Seul `contents/day-01.json` existe volontairement.

- Simuler le 1er décembre puis ouvrir la case 1 : le contenu public est chargé.
- Simuler le 12 décembre puis ouvrir la case 12 : l'interface indique que le contenu n'est pas publié.
- Vérifier que `contents/day-12.json` n'existe pas : une requête directe doit donc échouer.

## Règle de sécurité
Ne jamais créer/commiter les 24 vraies surprises dans le dépôt public. Les futures surprises seront injectées au moment autorisé par GitHub Actions dans un palier ultérieur.
