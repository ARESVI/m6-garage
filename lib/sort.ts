const collator = new Intl.Collator('tr-TR', {
  sensitivity: 'base',
  usage: 'sort',
});

export const trSort = (a: string, b: string) => collator.compare(a, b);
