export const generateSlugId = (id: number, name: string) => {
  const slug = name
    .normalize('NFKD')
    .replace(/\p{Mark}+/gu, '')
    .replace(/['"`´‘’‚‛“”„‟«»‹›]+/g, '')
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');

  return `${slug || 'item'}-${id}`;
};

export const extractSlugId = (slugId: string) => {
  const id = slugId.match(/(?:^|-)(\d+)$/)?.[1];
  return Number(id);
};
