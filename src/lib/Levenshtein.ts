export function substringLevenshtein(hay: string, needle: string) {
  hay = hay.toLowerCase(); needle = needle.toLowerCase();
  if (hay.includes(needle)) return 0;
  if (needle.length > hay.length) return levenshtein(hay, needle);
  let min = Infinity;
  for (let i = 0; i <= hay.length - needle.length; i++) {
    min = Math.min(min, levenshtein(hay.slice(i, i + needle.length), needle));
  }
  return min;
};

function levenshtein(a: string, b: string) {
  const m = Array.from({ length: b.length + 1 }, () => []);
  //@ts-ignore
  for (let i = 0; i <= b.length; i++) m[i][0] = i;
  //@ts-ignore
  for (let j = 0; j <= a.length; j++) m[0][j] = j;
  for (let i = 1; i <= b.length; i++)
    for (let j = 1; j <= a.length; j++)
      //@ts-ignore
      m[i][j] = a[j - 1] === b[i - 1] ? m[i - 1][j - 1]
        : Math.min(m[i - 1][j - 1], m[i][j - 1], m[i - 1][j]) + 1;
  return m[b.length][a.length];
}