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

## Ce que fait l'app
- 25 récitateurs, les 114 sourates, en écoute continue (une sourate = un enregistrement) ou verset par verset (réglage dans Profil).
- Lecture : texte uthmani, tajwid en couleur, phonétique, traduction en 10 langues, verset en cours surligné.
- Favoris, écoutés récemment, marque-pages, suivi de khatma, horaires de prière (méthode officielle du pays, réglables à la minute).
- Interface en français ou en anglais, thème jour / nuit, hors-ligne, bouton retour et gestes tactiles sur téléphone.

## Sources
- Texte (écriture uthmani, Tanzil), tajwid, phonétique et traductions : api.alquran.cloud
- Audio en continu et horaires de chaque verset : mp3quran.net
- Audio verset par verset : everyayah.com
- Horaires de prière : aladhan.com
- Photos : Wikimedia Commons, fond retiré (crédits dans `data.js` et dans l'écran Profil). Les photos CC BY-SA modifiées restent sous CC BY-SA.

## Vérifier les données

```
node selfcheck.mjs
```

Vérifie les données du Coran, les photos et que chaque texte de l'interface a sa traduction anglaise (`i18n.js`).
