// Vérification rapide des données : node selfcheck.mjs
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { VERSES, NAMES_AR, NAMES_LATIN, RECITERS, isMedinan } from './data.js';

assert.equal(VERSES.length, 114);
assert.equal(NAMES_AR.length, 114);
assert.equal(NAMES_LATIN.length, 114);
assert.equal(VERSES.reduce((a, b) => a + b, 0), 6236);
assert.equal(new Set(RECITERS.map((r) => r.id)).size, RECITERS.length);
for (const r of RECITERS) if (r.photo) assert.ok(existsSync(new URL(r.photo, import.meta.url)), `photo manquante : ${r.photo}`);
assert.equal(VERSES.filter((_, k) => isMedinan(k + 1)).length, 28); // 28 médinoises (Tanzil)
console.log('ok : 114 sourates, 6236 versets,', RECITERS.length, 'récitateurs');

// Interface anglaise : chaque texte de app.js (et chaque libellé traduit dynamiquement) doit avoir sa traduction.
const { EN } = await import('./i18n.js');
const { i18nKeys } = await import('./i18n-keys.mjs');
const { readFileSync } = await import('node:fs');
const dynamic = ['Accueil', 'Rechercher', 'Lire', 'Profil', 'Verset par verset', 'Texte continu', 'Serré', 'Normal', 'Aéré', 'Standard', 'Hanafite', 'Nuit', 'Jour', 'Auto',
  'Madd', 'Madd long', 'Ghunna', 'Ikhfa', 'Idgham', 'Iqlab', 'Qalqala', 'Muette', 'Méthode de calcul',
  'Officielle du pays (recommandé)', 'Turquie · Diyanet', 'Ligue islamique mondiale · 18°/17°', 'France · UOIF 12°', 'Umm al-Qura · La Mecque', 'Égypte', 'Maroc', 'Algérie', 'Tunisie', 'ISNA · Amérique du Nord',
  ...new Set(RECITERS.map((r) => r.country))];
const missing = [...i18nKeys(readFileSync(new URL('./app.js', import.meta.url), 'utf8')), ...dynamic].filter((k) => !(k in EN));
assert.deepEqual(missing, [], 'textes sans traduction anglaise');
for (const [k, v] of Object.entries(EN)) assert.equal(k.split('{}').length, v.split('{}').length, `nombre de valeurs différent : ${k}`);
console.log('ok : interface anglaise complète,', Object.keys(EN).length, 'textes');
