# Nūn — récitations du Coran

App web installable (PWA) : téléphone et ordinateur, en ligne et hors-ligne. Gratuite, sans pub, sans compte, sans collecte de données.

## Lancer sur ton ordinateur

```
py -m http.server 5173
```

Puis ouvre http://localhost:5173 (le hors-ligne ne marche qu'en `localhost` ou en `https`).

## Publier gratuitement

Le dossier n'a besoin d'aucune compilation : il suffit de l'héberger tel quel.
- **Netlify Drop** : glisse le dossier sur https://app.netlify.com/drop.
- **GitHub Pages** ou **Cloudflare Pages** : mets le dossier dans un dépôt et active les Pages.

Une fois en ligne, « Ajouter à l'écran d'accueil » (téléphone) ou l'icône d'installation du navigateur (ordinateur) installe l'app.

## Sources
- Texte (écriture uthmani, Tanzil) et traduction de Muhammad Hamidullah : api.alquran.cloud
- Audio, un fichier par verset : everyayah.com
- Photos : Wikimedia Commons, fond retiré (crédits dans `data.js` et dans l'écran Profil). Les photos CC BY-SA modifiées restent sous CC BY-SA.

## Vérifier les données

```
node selfcheck.mjs
```
