# Palier 3 - GitHub Actions et GitHub Pages

## Fonctionnement
- Build et deploiement par GitHub Actions.
- Heure de reference: Europe/Paris.
- Le cron GitHub etant exprime en UTC, le workflow s'execute a 23:05 UTC en novembre/decembre. En decembre Paris est en CET (UTC+1), soit 00:05 heure de Paris.
- `scripts/build.mjs` ne place dans `dist/contents` que les cases autorisees.
- `scripts/security-test.mjs` fait echouer le workflow si un fichier posterieur a la case autorisee est present.
- Les vraies surprises 02-24 sont stockees dans le secret GitHub `ADVENT_CONTENTS`, pas dans le depot.

## Secret ADVENT_CONTENTS
Creer un Repository secret nomme `ADVENT_CONTENTS` contenant un objet JSON. Exemple de structure (utiliser vos vrais contenus dans GitHub, ne pas sauvegarder ce JSON dans le depot):

{
  "02": {"title":"Titre jour 2","message":"Contenu jour 2"},
  "03": {"title":"Titre jour 3","message":"Contenu jour 3"}
}

## Mode demo
Actions > Advent AI First - build and deploy > Run workflow
- mode: demo
- demo_day: nombre entre 1 et 24

Pour la demonstration 1 case / 5 minutes, relancer manuellement le workflow toutes les 5 minutes avec demo_day = 1, puis 2, puis 3, etc. Le Palier 4 pourra automatiser la sequence complete sans boucle longue dans un runner.

## Pages
Dans Settings > Pages, choisir GitHub Actions comme source. Une URL publique ne doit etre consideree validee qu'apres une execution reussie du workflow.
