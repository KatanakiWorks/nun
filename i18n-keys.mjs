// Liste les textes à traduire dans app.js : T`gabarit ${x}` (clé = texte avec {} à la place des valeurs) et T('texte').
// Utilisé par selfcheck.mjs pour vérifier que le dictionnaire anglais (i18n.js) n'oublie rien.
export function i18nKeys(src) {
  const keys = new Set();
  for (let i = src.indexOf('T`'); i >= 0; i = src.indexOf('T`', i + 1)) {
    if (/[\w$]/.test(src[i - 1] || '')) continue; // ex. « ...T` » au milieu d'un identifiant
    let j = i + 2, key = '', depth = 0;
    // On lit le gabarit jusqu'au ` fermant, en sautant le contenu des ${ … } (qui peut contenir d'autres gabarits).
    while (j < src.length) {
      const c = src[j];
      if (depth === 0) {
        if (c === '\\') { key += src[j + 1]; j += 2; continue; }
        if (c === '`') break;
        if (c === '$' && src[j + 1] === '{') { key += '{}'; depth = 1; j += 2; continue; }
        key += c; j++;
      } else {
        if (c === '`') { // gabarit imbriqué : on le saute en entier
          j++;
          let d2 = 0;
          while (j < src.length && !(src[j] === '`' && d2 === 0)) {
            if (src[j] === '$' && src[j + 1] === '{') { d2++; j += 2; continue; }
            if (src[j] === '}' && d2 > 0) d2--;
            j++;
          }
          j++;
          continue;
        }
        if (c === '{') depth++;
        if (c === '}') depth--;
        j++;
      }
    }
    keys.add(key);
  }
  for (const m of src.matchAll(/\bT\('((?:[^'\\]|\\.)*)'\)/g)) keys.add(m[1].replace(/\\'/g, "'"));
  return keys;
}

