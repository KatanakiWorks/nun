// Vérification rapide des données : node selfcheck.mjs
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { VERSES, NAMES_AR, NAMES_LATIN, RECITERS } from './data.js';

assert.equal(VERSES.length, 114);
assert.equal(NAMES_AR.length, 114);
assert.equal(NAMES_LATIN.length, 114);
assert.equal(VERSES.reduce((a, b) => a + b, 0), 6236);
assert.equal(new Set(RECITERS.map((r) => r.id)).size, RECITERS.length);
for (const r of RECITERS) if (r.photo) assert.ok(existsSync(new URL(r.photo, import.meta.url)), `photo manquante : ${r.photo}`);
console.log('ok : 114 sourates, 6236 versets,', RECITERS.length, 'récitateurs');
